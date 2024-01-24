from datetime import datetime
from celery import Celery, shared_task
from flask import jsonify
from jinja2 import Template
from application.database import db
from application.models import OrderDetails, OrderItems, Role, User
from application.mailservice import send_message

def usr_mnthly_rprt(usr_id):
    from sqlalchemy import extract

    order_details = db.session.query(OrderDetails).filter(OrderDetails.user_id == usr_id).filter(extract('month', OrderDetails.created_on) == datetime.now().month).all()
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
    from sqlalchemy import extract

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



@shared_task(ignore_result=False)
def create_resource_csv():
    filename = "test.txt"
    with open(filename, 'w') as f:
        f.writeline("Hello World")
        f.close()
        return filename


@shared_task(ignore_result=True)
def daily_reminder():
    subject = "Daily Reminder"
    user_emails = db.session.query(User.email).join(OrderDetails, User.id == OrderDetails.user_id).filter(OrderDetails.created_on.date() != datetime.now().date()).all()
    for email in user_emails:
        with open('usr_reminder_email_temp.html', 'r') as f:
            template = Template(f.read())
            send_message(email, subject,
                         template.render(email=email))

    return "Daily reminder sent"

@shared_task(ignore_result=True)
def monthly_report():
    users = db.session.query(User).join(Role, User.role_id == Role.id).all()
    monthly_report_data = {}
    for user in users:
        if user.role.name == "user":
            monthly_report_data = usr_mnthly_rprt(user[0].id)
        else:
            monthly_report_data = adm_mnthly_rprt()
        
        with open('monthly_report_tmp.html', 'r') as f:
            template = Template(f.read())
            send_message(user[0].id, "Monthly Report",
                        template.render(data = monthly_report_data))
    return "OK"