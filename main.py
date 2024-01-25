import os
from celery import Celery
from flask import Flask, render_template
from flask_restful import Api
from flask_security import Security, SQLAlchemyUserDatastore
from application.config import LocalDevelopmentConfig
from application.database import db
from application.models import user_datastore
from application.tasks import daily_reminder, monthly_report
from celery.schedules import crontab
from worker import celery_init_app
from application.instances import cache


app = None
api = None

def create_app():
    app = Flask(__name__, template_folder="templates")
    if os.getenv('ENV', "development") == "production":
      raise Exception("Currently no production config is setup.")
    else:
      print("Staring Local Development")
      app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    api = Api(app)
    cache.init_app(app)
    app.security = Security(app, user_datastore)
    app.app_context().push()  
    return app, api

app, api = create_app()
celery_app = celery_init_app(app)

# Import all the controllers so they are loaded
from application.controllers.admin import *
from application.controllers.user import *
from application.controllers.manager import *
from application.controllers.common import *
from application.controllers.async_jobs import *

# Add all restful controllers here
from application.api.category import *
api.add_resource(CategoryResource, '/api/categories', '/api/categories/<int:category_id>')

from application.api.product import *
api.add_resource(ProductResource, '/api/products', '/api/products/<int:product_id>')

from application.api.discount import *
api.add_resource(DiscountResource, '/api/discounts', '/api/discounts/<int:discount_id>')

@app.route("/")
def home():
  # return monthly_report('ishaan@gmail.com','test')
  return render_template('index.html')


@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=13, minute=25),
        daily_reminder.s('narendra@email.com', 'Daily Reminder'),
    )
    sender.add_periodic_task(
        crontab(hour=15, minute=25, day_of_month=25),
        monthly_report.s('narendra@gmail.com', 'Monthly Report'),
    )

@app.route("/do_initial_setup")
def do_initial_setup():
    # db.create_all()
    admin_role = user_datastore.create_role(name='admin', description='Administrator')
    user_role = user_datastore.create_role(name='user', description='Customer')
    user_datastore.create_role(name='manager', description='Manager')
    new_admin = user_datastore.create_user(
       username='admin',
       email='admin@grocery.com', 
       password='admin', 
       first_name='Admin', 
       last_name='Admin', 
       telephone='1234567890'
      )
    user_datastore.add_role_to_user(new_admin, admin_role)
    # new_user = user_datastore.create_user(
    #    username='ishaan',
    #    email='ishaan@grocery.com', 
    #    password='123', 
    #    first_name='Ishaan', 
    #    last_name='Maheshwari', 
    #    telephone='1234567890'
    #   )
    # user_datastore.add_role_to_user(new_user, user_role)
    import json
    from application.models import Product, Category, Discount
    with open('./db_directory/category.json') as json_file:
      data = json.load(json_file)
      for c in data:
        category = Category(name=c['name'], desc=c['desc'])
        db.session.add(category)
    with open('./db_directory/discount.json') as json_file:
      data = json.load(json_file)
      for d in data:
        discount = Discount(
           name=d['name'], 
           desc=d['desc'], 
           discount_percent=d['discount_percent'], 
           is_active=d['is_active']
          )
        db.session.add(discount)
    with open('./db_directory/product.json') as json_file:
      from datetime import datetime
      data = json.load(json_file)
      for p in data:
        product = Product(
           name=p['name'], 
           desc=p['desc'], 
           price=p['price'], 
           category_id=p['category_id'], 
           discount_id=p['discount_id'], inventory=p['inventory'], 
           manf_date=datetime.today()
          )
        db.session.add(product)
    db.session.commit()
    return "Initial setup complete"

if __name__ == '__main__':
  # Run the Flask app
  app.run(host='0.0.0.0',port=8080)
