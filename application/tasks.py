from datetime import datetime
from celery import Celery, shared_task
from flask import jsonify
from jinja2 import Template
from sqlalchemy import extract
from application.database import db
from application.models import Category, Discount, OrderDetails, OrderItems, Product, Role, User, user_datastore
from application.mailservice import send_message
import csv
import json

def usr_mnthly_rprt(usr_id):

    order_details = db.session.query(OrderDetails).filter(OrderDetails.user_id == usr_id).filter(extract('month', OrderDetails.modified_on) == datetime.now().month).all()
    order_ids = []
    total_amount = 0
    
    for order in order_details:
        total_amount += order.total
        order_ids.append(order.id)
    total_number_of_orders = len(order_details)
    if total_number_of_orders == 0:
        av_order_value = 0
    else:
        av_order_value = total_amount/total_number_of_orders

    ordrd_items = db.session.query(OrderItems).filter(OrderItems.order_id.in_(order_ids)).group_by(OrderItems.product_id).having(db.func.count(OrderItems.id)).order_by(db.func.count(OrderItems.id).desc()).limit(5).all()
    most_freq_prdcts = [ordrd_item.name for ordrd_item in ordrd_items]

    ordrd_items = db.session.query(OrderItems).filter(OrderItems.order_id.in_(order_ids)).group_by(OrderItems.product_id).having(db.func.sum(OrderItems.quantity)).order_by(db.func.sum(OrderItems.quantity).desc()).limit(5).all()
    most_ordered_product = [ordrd_item.name for ordrd_item in ordrd_items]

    data = {
        "month": datetime.now().month,
        "year": datetime.now().year,
        "total_order_amount": total_amount,
        "total_number_of_orders": total_number_of_orders,
        "average_order_value": av_order_value,
        "most_ordered_product": most_ordered_product,
        "most_freq_prdcts": most_freq_prdcts
    }

    return data

def adm_mnthly_rprt():

    order_details = db.session.query(OrderDetails).filter(extract('month', OrderDetails.created_on) == datetime.now().month).all()
    order_ids = []
    total_amount = 0
    
    for order in order_details:
        total_amount += order.total
        order_ids.append(order.id)
    total_number_of_orders = len(order_details)
    if total_number_of_orders == 0:
        av_order_value = 0
    else:
        av_order_value = total_amount/total_number_of_orders

    ordrd_items = db.session.query(OrderItems).filter(OrderItems.order_id.in_(order_ids)).group_by(OrderItems.product_id).having(db.func.count(OrderItems.id)).order_by(db.func.count(OrderItems.id).desc()).limit(5).all()
    most_freq_prdcts = [ordrd_item.name for ordrd_item in ordrd_items]

    ordrd_items = db.session.query(OrderItems).filter(OrderItems.order_id.in_(order_ids)).group_by(OrderItems.product_id).having(db.func.sum(OrderItems.quantity)).order_by(db.func.sum(OrderItems.quantity).desc()).limit(5).all()
    most_ordered_product = [ordrd_item.name for ordrd_item in ordrd_items]

    data = {
        "month": datetime.now().month,
        "year": datetime.now().year,
        "total_order_amount": total_amount,
        "total_number_of_orders": total_number_of_orders,
        "average_order_value": av_order_value,
        "most_ordered_product": most_ordered_product,
        "most_freq_prdcts": most_freq_prdcts
    }

    return data


def generate_report():
    #genrate report on products, orders, users, etc to make a csv file
    products = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).all()
    product_details = []
    ordrd_items = db.session.query(OrderItems).group_by(OrderItems.product_id).having(db.func.sum(OrderItems.quantity)).order_by(db.func.sum(OrderItems.quantity).desc()).all()
    prod_ord_freq = {}
    sell_price_tbl = {}
    for ordrd_item in ordrd_items:
        prod_ord_freq[ordrd_item.product_id] = ordrd_item.quantity
        sell_price_tbl[ordrd_item.product_id] = ordrd_item.sell_price
    
    if products:
        for product in products:
            units_sold = 0
            revenue = 0
            if product.Product.id in prod_ord_freq.keys():
                units_sold = prod_ord_freq[product.Product.id]
                revenue = units_sold * sell_price_tbl[product.Product.id]
            product_details.append({
                "product_id": product.Product.id,
                "product_name": product.Product.name,
                "product_desc": product.Product.desc,
                "category": product.Category.name,
                "category_id": product.Category.id,
                "inventory": product.Product.inventory,
                "discount_perc": product.Discount.discount_percent,
                "discount_id": product.Discount.id,
                "discount_name": product.Discount.name,
                "discount_desc": product.Discount.desc,
                "price": product.Product.price,
                "manf_date": product.Product.manf_date,
                "units_sold": units_sold,
                "revenue_generated": revenue
            })
    return {"products": product_details}, 200

@shared_task(ignore_result=False)
def create_resource_csv():
    report = generate_report()
    filename = "output.csv"
    with open(filename, "w", newline="") as csvfile:
        fieldnames = report[0].keys() 
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()  # Write headers
        writer.writerows(report)  # Write data rows
    return filename



@shared_task(ignore_result=True)
def daily_reminder(email, subject):
    subject = "Daily Reminder"
    today = datetime.now().date()
    user_emails = db.session.query(User.email).join(OrderDetails, User.id == OrderDetails.user_id).filter(extract('day', OrderDetails.created_on) != today.day).all()

    for email in user_emails:
        with open('templates/usr_reminder_email_temp.html', 'r') as f:
            template = Template(f.read())
            print(template.render())
            send_message(to=email[0], subject=subject,
                         content_body=template.render())

    return "Daily reminder sent"

@shared_task(ignore_result=True)
def monthly_report(email, subject):
    manager_role = user_datastore.find_role('manager')
    user_role = user_datastore.find_role('user')

    manager_role_id = manager_role.id
    user_role_id = user_role.id

    managers = db.session.query(User).join(User.roles).filter(User.roles.any(id=manager_role_id)).all()
    users = db.session.query(User).join(User.roles).filter(User.roles.any(id=user_role_id)).all()
    print(users)
    monthly_report_data = {}

    for user in users:
        monthly_report_data = usr_mnthly_rprt(user.id)
        with open('templates/monthly_report_tmp.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, "Monthly Report",
                        template.render(data = monthly_report_data))
    for manager in managers:
        monthly_report_data = adm_mnthly_rprt()  
        with open('templates/monthly_report_tmp.html', 'r') as f:
            template = Template(f.read())
            send_message(manager.email, "Monthly Report",
                        template.render(data = monthly_report_data))
    return "OK"