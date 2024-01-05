from flask import current_app as app, request
from flask_security import login_user, verify_password
from application.models import user_datastore

@app.route("/manager/register", methods=['POST'])
def manager_register():
    if request.method == 'POST':
        request_data = request.get_json()
        manager_role = user_datastore.find_role('manager')
        if manager_role == None:
            return {"message":"Manager role not available."},200
        new_manager = user_datastore.create_user(
            email = request_data['email'],
            password = request_data['password'],
            username = request_data['username'],
            active = False,
            first_name = request_data['first_name'],
            last_name = request_data['last_name'],
            telephone = request_data['telephone'],
        )
        user_datastore.add_role_to_user(new_manager,manager_role)
        user_datastore.commit()
        return {
            "message":"Successfully registered as Manager.",
            "email" : new_manager.email,
            "username": new_manager.username,
            "role": "Manager",
            "Active": new_manager.active
        },201


