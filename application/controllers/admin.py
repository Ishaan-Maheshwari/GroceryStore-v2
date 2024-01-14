from flask import current_app as app, request
from flask_security import auth_required, login_user, logout_user, verify_password
from application.models import user_datastore

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
