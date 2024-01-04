import os
from flask import Flask
from flask_restful import Resource, Api
from flask_security import Security, SQLAlchemyUserDatastore
from application.config import LocalDevelopmentConfig
from application.database import db
from application.models import User, Role

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
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, user_datastore)
    app.app_context().push()  
    return app, api

app, api = create_app()


@app.route("/")
def home():
    return "Hello World!"

if __name__ == '__main__':
  # Run the Flask app
  app.run(host='0.0.0.0',port=8080)
