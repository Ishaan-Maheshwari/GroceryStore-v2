from flask import current_app as app, request
from flask_security import login_user, verify_password
from application.models import user_datastore

#user register
@app.route("/user/register", methods=['POST'])
def user_register():
    if request.method == 'POST':
        request_data = request.get_json()
        user_role = user_datastore.find_role('user')
        if user_role == None:
            return {"message":"User role not available."},200
        #check if user already exists
        user = user_datastore.find_user(username=request_data['username'])
        if user:
            return {"message":"Username already exists."},409
        user = user_datastore.find_user(email=request_data['email'])
        if user:
            return {"message":"Email already exists."},409
        new_user = user_datastore.create_user(
            email = request_data['email'],
            password = request_data['password'],
            username = request_data['username'],
            active = False,
            first_name = request_data['first_name'],
            last_name = request_data['last_name'],
            telephone = request_data['telephone'],
        )
        user_datastore.add_role_to_user(new_user,user_role)
        user_datastore.commit()
        return {
            "message":"Successfully registered as User.",
            "email" : new_user.email,
            "username": new_user.username,
            "role": "User",
            "Active": new_user.active
        },201
    
#user login
@app.route("/user/login", methods=['POST'])
def user_login():
    if request.method == 'POST':
        request_data = request.get_json()
        username = request_data['username']
        password = request_data['password']
        user = user_datastore.find_user(username=username)
        if user:
            if verify_password(password, user.password):
                if user.has_role('user'):
                    if user.active == False:
                        return {"message": "Account is not active. Admin will approve your request."}, 401
                    login_user(user)
                    user_datastore.commit()
                    auth_token = user.get_auth_token()
                    return {"message": "Login successful", "token":auth_token, "role": "user"}, 200
                else:
                    return {"message": "You are not a user"}, 401
            else:
                return {"message": "Incorrect password"}, 401
        else:
            return "User not found"

#user logout
@app.route("/user/logout", methods=['POST'])
def user_logout():
    if request.method == 'POST':
        request_data = request.get_json()
        username = request_data['username']
        user = user_datastore.find_user(username=username)
        if user:
            user_datastore.delete_auth_token(user)
            user_datastore.commit()
            return {"message": "Logout successful"}, 200
        else:
            return {"message": "User not found"}, 404
