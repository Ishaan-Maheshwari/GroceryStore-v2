from flask import current_app as app, request
from flask_security import auth_required, login_user, logout_user, verify_password
from application.models import user_datastore

@app.route("/api/login", methods=['POST'])
def login():
    if request.method == 'POST':
        request_data = request.get_json()
        username = request_data['username']
        password = request_data['password']
        print(username, password)
        user = user_datastore.find_user(username=username)
        if user:
            if verify_password(password, user.password):
                if user.is_active:
                    login_user(user)
                    user_datastore.commit()
                    auth_token = user.get_auth_token()
                    return {"message": "Login successful", 
                            "token":auth_token, 
                            "role": user.roles[0].name, 
                            "username":user.username,
                            "email":user.email,
                            "first_name":user.first_name,
                            "last_name":user.last_name,
                            "id":user.id,
                            }, 200
                else:
                    return {"message": "Account is not active. Admin will approve your request."}, 401
            else:
                return {"message": "Incorrect password"}, 401
        else:
            return {"message": "User not found"}, 401

@app.post("/api/logout")
@auth_required('token')
def logout():
    if request.method == 'POST':
        logout_user()
        return {"message": "Logout successful"}, 200