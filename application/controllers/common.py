from application.instances import cache
from flask import current_app as app, jsonify, request, send_file
from flask_login import current_user
from flask_security import auth_required, http_auth_required, login_user, logout_user, roles_accepted, verify_password
from application.models import user_datastore
from application.database import db
from application.models import Product, Category, Discount
from application.tasks import create_resource_csv
from celery.result import AsyncResult

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
# @auth_required('token')
def logout():
    if request.method == 'POST':
        logout_user()
        return {"message": "Logout successful"}, 200

@app.get("/api/all_products")
@cache.cached(timeout=300)
def get_all_products():
    products = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).all()
    product_details = []
    if products:
        for product in products:
            product_details.append({
                "product_id": product.Product.id,
                "product_name": product.Product.name,
                "product_desc": product.Product.desc,
                "category": product.Category.name,
                "category_id": product.Category.id,
                "inventory": product.Product.inventory,
                "discount_perc": product.Discount.discount_percent,
                "discount_id": product.Discount.id,
                "discount_name": product.Discount.name,
                "discount_desc": product.Discount.desc,
                "price": product.Product.price,
                "manf_date": product.Product.manf_date
            })
        return {"products": product_details}, 200
    else:
        return {"message" : "Something went wrong. Cannot fetch products."}, 401

@app.get("/api/product/<int:product_id>")
@cache.cached(timeout=300)
def get_product(product_id):
    product = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).filter(Product.id == product_id).first()
    if product:
        return {"product": {
                "product_id": product.Product.id,
                "product_name": product.Product.name,
                "product_desc": product.Product.desc,
                "category": product.Category.name,
                "category_id": product.Category.id,
                "inventory": product.Product.inventory,
                "discount_perc": product.Discount.discount_percent,
                "discount_id": product.Discount.id,
                "discount_name": product.Discount.name,
                "discount_desc": product.Discount.desc,
                "price": product.Product.price,
                "manf_date": product.Product.manf_date
            }}, 200
    else:
        return {"message" : "Something went wrong. Cannot fetch product."}, 401

@app.get("/api/category/<int:category_id>/products")
@cache.cached(timeout=300)
def get_products_by_category(category_id):
    products = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).filter(Product.category_id == category_id).all()
    product_details = []
    if products:
        for product in products:
            product_details.append({
                "product_id": product.Product.id,
                "product_name": product.Product.name,
                "product_desc": product.Product.desc,
                "category": product.Category.name,
                "category_id": product.Category.id,
                "inventory": product.Product.inventory,
                "discount_perc": product.Discount.discount_percent,
                "discount_id": product.Discount.id,
                "discount_name": product.Discount.name,
                "discount_desc": product.Discount.desc,
                "price": product.Product.price,
                "manf_date": product.Product.manf_date
            })
        return {"products": product_details}, 200
    else:
        return {"message" : "Something went wrong. Cannot fetch products."}, 401

@app.get("/api/common/user_details/<int:user_id>")
@auth_required('token')
def get_user_details(user_id):
    if user_id != current_user.id:
        return {"message": "You are not authorized to access this resource. You cannot view other user details"}, 401
    user = user_datastore.find_user(id=user_id)
    if user:
        return {"user_details": {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_active": user.active,
                "role": user.roles[0].name,
                "telephone": user.telephone,
                "id": user.id
            }}, 200
    else:
        return {"message" : "Something went wrong. Cannot fetch user details."}, 401

@app.get("/api/search/products/<search_term>")
def search_products(search_term):
    products = []
    try:
        products = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).filter(Product.name.like('%' + search_term + '%')).all()
        if not products:
            products = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).filter(Product.desc.like('%' + search_term + '%')).all()
        product_details = []
        if products:
            for product in products:
                product_details.append({
                    "product_id": product.Product.id,
                    "product_name": product.Product.name,
                    "product_desc": product.Product.desc,
                    "category": product.Category.name,
                    "category_id": product.Category.id,
                    "inventory": product.Product.inventory,
                    "discount_perc": product.Discount.discount_percent,
                    "discount_id": product.Discount.id,
                    "discount_name": product.Discount.name,
                    "discount_desc": product.Discount.desc,
                    "price": product.Product.price,
                    "manf_date": product.Product.manf_date
                })
            return {"products": product_details}, 200
        else:
            return {"message" : "No Products found similar to {search_term}"}, 404
    except Exception as e:
        return {"message" : "Something went wrong. Cannot fetch products."}, 401

@app.get("/api/search/categories/<search_term>")
def search_categories(search_term):
    categories = []
    try:
        categories = Category.query.filter(Category.name.like('%' + search_term + '%')).all()
        if not categories:
            categories = Category.query.filter(Category.desc.like('%' + search_term + '%')).all()
            if not categories:
                return {"message" : "No categories found"}, 404
        category_details = []
        for category in categories:
            category_details.append({
                "id": category.id,
                "name": category.name,
                "desc": category.desc,
            })
        return {"categories": category_details}, 200
    except Exception as e:
        return {"message" : "Something went wrong. Cannot fetch categories."}, 401