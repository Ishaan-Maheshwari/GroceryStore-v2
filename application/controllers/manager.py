import json
from flask import current_app as app, request
from flask_login import current_user
from flask_security import login_user, roles_required, verify_password
from application.database import db
from application.models import Requests, user_datastore

@app.post("/api/manager/register")
def manager_register():
    try:
        request_data = request.get_json()
        manager_role = None
        requested_active = False
        if current_user and current_user.has_role('admin'):
            manager_role = user_datastore.find_or_create_role('manager')
            requested_active = True if request_data['active'] == 'true' else False
        else:
            manager_role = user_datastore.find_role('manager')
        if manager_role == None:
            return {"message":"Manager role not available."},418
        
        user = user_datastore.find_user(username=request_data['username'])
        if user:
            return {"message":"Username already exists."},409
        user = user_datastore.find_user(email=request_data['email'])
        if user:
            return {"message":"Email already exists."},409
        new_manager = user_datastore.create_user(
            email = request_data['email'],
            password = request_data['password'],
            username = request_data['username'],
            active = requested_active,
            first_name = request_data['first_name'],
            last_name = request_data['last_name'],
            telephone = request_data['telephone'],
        )
        user_datastore.add_role_to_user(new_manager,manager_role)
        user_datastore.commit()
        if current_user and current_user.has_role('admin'):
            new_manager = user_datastore.find_user(username=request_data['username'])
            new_request = Requests(
                requester_id = new_manager.id,
                action = 'approve_manager',
                details = json.dumps({
                    'manager_id': new_manager.id
                }),
                status = 'pending'
            )
            db.session.add(new_request)
            db.session.commit()
            return {"message":"Successfully registered as Manager and request sent to admin for approval."},201
        return {"message":"Successfully registered as Manager."},201
    except Exception as e:
        print(e)
        return {"message":"Something went wrong."},500

@app.route("/manager/login", methods=['POST'])
def manager_login():
    if request.method == 'POST':
        request_data = request.get_json()
        username = request_data['username']
        password = request_data['password']
        user = user_datastore.find_user(username=username)
        if user:
            if verify_password(password, user.password):
                if user.has_role('manager'):
                    if user.active == False:
                        return {"message": "Account is not active. Admin will approve your request."}, 401
                    login_user(user)
                    user_datastore.commit()
                    auth_token = user.get_auth_token()
                    return {"message": "Login successful", "token":auth_token, "role": "manager"}, 200
                else:
                    return {"message": "You are not a manager"}, 401
            else:
                return {"message": "Incorrect password"}, 401
        else:
            return "User not found"

#manager request approval from admin
@app.post("/manager/request")
@roles_required('manager')
def manager_request():
    request_data = request.get_json()
    manager_id = request_data['manager_id']
    user = user_datastore.find_user(id=manager_id)
    if user:
        if user.active == True:
            return {"message": "User is already active"}, 200
        new_request = Requests(
            requester_id = manager_id,
            action = 'approve_manager',
            details = json.dumps({
                'manager_id': manager_id
            }),
            status = 'pending'
        )
        db.session.add(new_request)
        db.session.commit()
        return {"message": "Request sent to admin"}, 200
    else:
        return {"message": "User not found"}, 404


