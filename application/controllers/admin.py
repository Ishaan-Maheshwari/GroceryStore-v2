from flask import current_app as app, request
from flask_security import auth_required, login_user, logout_user, roles_required, verify_password
from application.models import user_datastore
from application.database import db
from application.models import Product, Category, Discount, OrderItems, User

#activate manager by its id
@app.route("/admin/activate/manager", methods=['POST'])
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

#deactivate manager by its id
@app.route("/admin/deactivate/manager", methods=['POST'])
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
@roles_required('admin')
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