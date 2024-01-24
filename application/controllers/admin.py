import json
from flask import current_app as app, request
from flask_security import auth_required, login_user, logout_user, roles_accepted, roles_required, verify_password
from application.models import OrderDetails, Requests, user_datastore
from application.database import db
from application.models import Product, Category, Discount, OrderItems, User

@app.post("/api/admin/get-all-managers")
@auth_required('token')
@roles_required('admin')
def get_all_managers():
    role_name = 'manager'
    manager_role = user_datastore.find_role(role_name)
    manager_role_id = manager_role.id
    managers = db.session.query(User).join(User.roles).filter(User.roles.any(id=manager_role_id)).all()
    managers_list = []
    for manager in managers:
        managers_list.append({
            'id': manager.id,
            'username': manager.username,
            'email': manager.email,
            'first_name': manager.first_name,
            'last_name': manager.last_name,
            'active': manager.active
        })
    return {"managers": managers_list, "message": "Managers retrieved successfully", "status": "Success"}, 200

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

@app.get("/api/admin/get-all-requests")
@auth_required('token')
@roles_required('admin')
def get_all_requests():
    requests = db.session.query(Requests, User).join(User).filter(Requests.status == 'pending').all()
    request_list = []
    for request in requests:
        request_list.append({
            'id': request.Requests.id,
            'requester_id': request.Requests.requester_id,
            'requester_username': request.User.username,
            'action': request.Requests.action,
            'details': json.loads(request.Requests.details),
            'status': request.Requests.status
        })
    return {"requests": request_list, "message": "Requests retrieved successfully", "status": "Success"}, 200

@app.post("/api/admin/decline-request")
@auth_required('token')
@roles_required('admin')
def decline_request():
    request_data = request.get_json()
    request_id = request_data['request_id']
    myrequest = Requests.query.filter_by(id=request_id).first()
    if myrequest:
        myrequest.status = 'declined'
        db.session.commit()
        return {"message": "Request declined"}, 200
    else:
        return {"message": "Request not found"}, 404

@app.post("/api/admin/approve-request")
@auth_required('token')
@roles_required('admin')
def accept_request():
    request_data = request.get_json()
    request_id = request_data['request_id']
    myrequest = Requests.query.filter_by(id=request_id).first()
    if myrequest is None:
        return {"message": "Request not found"}, 404
    if myrequest.action == 'add_category':
        details = json.loads(myrequest.details)
        category = Category(name=details['name'], desc=details['desc'])
        db.session.add(category)
        myrequest.status = 'accepted'
        db.session.commit()
        return {"message": "Request Accepted and processed. Category added."}, 200
    elif myrequest.action == 'edit_category':
        details = json.loads(myrequest.details)
        category = Category.query.filter_by(id=details['id']).first()
        if category is None:
            return {"message": "Category not found"}, 404
        category.name = details['name']
        category.desc = details['desc']
        myrequest.status = 'accepted'
        db.session.commit()
        return {"message": "Request Accepted and processed. Category edited."}, 200
    elif myrequest.action == 'delete_category':
        details = json.loads(myrequest.details)
        category = Category.query.filter_by(id=details['id']).first()
        if category is None:
            return {"message": "Category not found"}, 404
        db.session.delete(category)
        myrequest.status = 'accepted'
        db.session.commit()
        return {"message": "Request Accepted and processed. Category deleted."}, 200
    elif myrequest.action == 'approve_manager':
        details = json.loads(myrequest.details)
        manager = User.query.filter_by(id=details['id']).first()
        if manager is None:
            return {"message": "Manager not found"}, 404
        manager.active = True
        myrequest.status = 'accepted'
        db.session.commit()
        return {"message": "Request Accepted and processed. Manager activated."}, 200
    elif myrequest.action == 'decline_manager':
        details = json.loads(myrequest.details)
        manager = User.query.filter_by(id=details['id']).first()
        if manager is None:
            return {"message": "Manager not found"}, 404
        manager.active = False
        myrequest.status = 'accepted'
        db.session.commit()
        return {"message": "Request Accepted and processed. Manager deactivated."}, 200
    else:
        return {"message": "Request Action not found"}, 404
