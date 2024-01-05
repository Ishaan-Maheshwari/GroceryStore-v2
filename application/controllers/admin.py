from flask import current_app as app, request
from flask_security import login_user, verify_password
from application.models import user_datastore

@app.route("/admin/login", methods=['POST'])
def admin_login():
    if request.method == 'POST':
        request_data = request.get_json()
        username = request_data['username']
        password = request_data['password']
        user = user_datastore.find_user(username=username)
        if user:
            if verify_password(password, user.password):
                if user.has_role('admin'):
                    login_user(user)
                    user_datastore.commit()
                    auth_token = user.get_auth_token()
                    return {"message": "Login successful", "token":auth_token, "role": "admin"}, 200
                else:
                    return {"message": "You are not an admin"}, 401
            else:
                return {"message": "Incorrect password"}, 401
        else:
            return "User not found"
