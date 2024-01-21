from flask import current_app as app, request
from flask_security import auth_required, login_user, logout_user, roles_accepted, roles_required, verify_password
from application.models import OrderDetails, user_datastore
from application.database import db
from application.models import Product, Category, Discount, OrderItems, User


@app.route("/admin/activate/manager", methods=['POST'])
@roles_required('admin')
def activate_manager():
    if request.method == 'POST':
        request_data = request.get_json()
        manager_id = request_data['manager_id']
        manager = user_datastore.find_user(id=manager_id)
        if manager:
            if manager.has_role('manager'):
                manager.active = True
                user_datastore.commit()
                return {"message": "Manager activated"}, 200
            else:
                return {"message": "User is not a manager"}, 401
        else:
            return {"message": "User not found"}, 404


@app.route("/admin/deactivate/manager", methods=['POST'])
@roles_required('admin')
def deactivate_manager():
    if request.method == 'POST':
        request_data = request.get_json()
        manager_id = request_data['manager_id']
        manager = user_datastore.find_user(id=manager_id)
        if manager:
            if manager.has_role('manager'):
                manager.active = False
                user_datastore.commit()
                return {"message": "Manager deactivated"}, 200
            else:
                return {"message": "User is not a manager"}, 401
        else:
            return {"message": "User not found"}, 404

@app.post("/api/product_stats")
@auth_required('token')
@roles_accepted('admin','manager')
def product_stats():
    product_stats = db.session.query(Product.name, db.func.sum(OrderItems.quantity).label('total_quantity')).join(OrderItems).group_by(Product.name).all()
    product_names = []
    total_quantity = []
    for product in product_stats:
        product_names.append(product[0])
        total_quantity.append(product[1])
    product_stats = {
        'product_names': product_names,
        'total_quantity': total_quantity
    }
    return product_stats

@app.get("/api/admin/dailysales")
@auth_required('token')
@roles_accepted('admin','manager')
def daily_sales():
    daily_sales = db.session.query(db.func.sum(OrderDetails.total).label('total_price'), db.func.date(OrderDetails.created_on).label('date')).group_by(db.func.date(OrderDetails.created_on)).order_by(db.func.date(OrderDetails.created_on)).all()

    total_price = []
    date = []
    for sales in daily_sales:
        total_price.append(sales[0])
        date.append(sales[1])
    daily_sales = {
        'total_price': total_price,
        'date': date
    }
    return {"daily_sales" : daily_sales, "message": "Daily sales retrieved successfully", "status": "Success"}, 200