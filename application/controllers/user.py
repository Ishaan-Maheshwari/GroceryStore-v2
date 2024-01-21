from flask import current_app as app, request
from flask_login import current_user
from flask_security import auth_required, login_user, roles_accepted, verify_password
from application.models import CartItem, Category, Discount, OrderDetails, OrderItems, Product, ShoppingSession, user_datastore
from application.database import db

def new_products(num=8):
    products = []
    try:
        res = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).order_by(Product.created_on.desc()).limit(num).all()
        for product in res:
            products.append({
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
    except Exception as e:
        print(e)
    return products
        
def get_popular_products(num=8):
    product_ids = []
    products = []
    try:
        product_details = db.session.query(OrderItems.product_id).group_by(OrderItems.product_id).order_by(db.func.sum(OrderItems.quantity).desc()).limit(num).all()
        if product_details is not None:
            product_ids = [product[0] for product in product_details]
            res = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).filter(Product.id.in_(product_ids)).all()
            for product in res:
                products.append({
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
    except Exception as e:
        print(e)
    return products

def get_high_discounted_items(num=8):
    discount_ids = []
    products = []
    try:
        discounts = Discount.query.filter(Discount.discount_percent > 0).order_by(Discount.discount_percent.desc()).limit(2).all()
        if discounts is not None:
            discount_ids = [discount.id for discount in discounts]
        if discount_ids is not None:
            res = db.session.query(Product, Category, Discount).filter(Product.category_id == Category.id).filter(Product.discount_id == Discount.id).filter(Product.discount_id.in_(discount_ids)).limit(num).all()
            for product in res:
                products.append({
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
    except Exception as e:
        print(e)
    return products

@app.post("/api/user/register")
def user_register():
    try:
        request_data = request.get_json()
        user_role = user_datastore.find_role('user')
        if user_role == None:
            return {"message":"User role not available."},200
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
            active = True,
            first_name = request_data['first_name'],
            last_name = request_data['last_name'],
            telephone = request_data['telephone'],
        )
        user_datastore.add_role_to_user(new_user,user_role)
        user_datastore.commit()
        return {"message":"Successfully registered as User."},201
    except Exception as e:
        print(e)
        return {"message":"Something went wrong."},500
    

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

@app.post("/api/cart/add")
@auth_required('token')
@roles_accepted('user')
def add_to_cart():
    try:
        request_data = request.get_json()
        product_id = request_data['product_id']
        # check if product id is valid and is an integer
        if not product_id or not isinstance(product_id, int):
            return {"message": "Invalid product id", "status": "Failed"}, 400
        #check if product exists and is not out of stock
        product = Product.query.filter_by(id=product_id).first()
        if not (product and product.inventory > 0):
            return {"message": "Product not available or Out of Stock", "status": "Failed"}, 404
        #check if any shopping session exists for the user
        shopping_session = db.session.query(ShoppingSession).filter(ShoppingSession.user_id == current_user.id).first()
        if not shopping_session:
            #create a new shopping session
            new_shopping_session = ShoppingSession(user_id=current_user.id, total_amount = 0)
            db.session.add(new_shopping_session)
            db.session.commit()
            shopping_session = db.session.query(ShoppingSession).filter(ShoppingSession.user_id == current_user.id).first()
        #check if the product is already in the CartItem table with same shopping session id and product id
        cart_item = db.session.query(CartItem).filter(CartItem.session_id == shopping_session.id).filter(CartItem.product_id == product_id).first()
        if cart_item:
            #update the quantity in the cart item
            cart_item.quantity += 1
        else:
            #create a new cart item
            cart_item = CartItem(session_id=shopping_session.id, product_id=product_id, quantity=1)
            db.session.add(cart_item)
        #fetch discount for the product
        discount = Discount.query.filter_by(id=product.discount_id).first()
        #update the total amount in the shopping session
        shopping_session.total_amount += (product.price - (product.price * discount.discount_percent / 100))

        db.session.commit()
        return {"message": "Product added to cart successfully", "status": "Success"}, 200
    except Exception as e:
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.get("/api/cart/details")
@auth_required('token')
@roles_accepted('user')
def cart_details():
    try:
        shopping_session = db.session.query(ShoppingSession).filter(ShoppingSession.user_id == current_user.id).first()
        cart_items = []
        if shopping_session:
            cart_items = db.session.query(CartItem, Product, Discount).filter(CartItem.session_id == shopping_session.id).filter(CartItem.product_id == Product.id).filter(Product.discount_id == Discount.id).all()
            if not cart_items:
                return {"message": "No items in cart", "status": "Failed"}, 404
        else:
            return {"message": "No items in cart", "status": "Failed"}, 404
        items = []
        total_amount = 0
        for cart_item in cart_items:
            items.append({
                "id": cart_item[0].id,
                "product_id": cart_item[1].id,
                "product_name": cart_item[1].name,
                "product_description": cart_item[1].desc,
                "price": cart_item[1].price,
                "discount_percent": cart_item[2].discount_percent,
                "quantity": cart_item[0].quantity,
                "discounted_price": cart_item[1].price - (cart_item[1].price * cart_item[2].discount_percent / 100),
                "total_price": (cart_item[1].price - (cart_item[1].price * cart_item[2].discount_percent / 100)) * cart_item[0].quantity
            })
            total_amount += (cart_item[1].price - (cart_item[1].price * cart_item[2].discount_percent / 100)) * cart_item[0].quantity
        shopping_session.total_amount = total_amount
        db.session.commit()
        return {"items": items, "total_amount": total_amount, "status": "Success"}, 200
    
    except Exception as e:
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.post("/api/cart/reduce/")
@auth_required('token')
@roles_accepted('user')
def reduce_from_cart():
    try:
        request_data = request.get_json()
        cart_item_id = request_data['cart_item_id']
        if not cart_item_id or not isinstance(cart_item_id, int):
            return {"message": "Invalid cart item id", "status": "Failed"}, 400
        cart_item = CartItem.query.filter_by(id=cart_item_id).first()
        if cart_item:
            shopping_session = db.session.query(ShoppingSession).filter(ShoppingSession.id == cart_item.session_id).first()
            if shopping_session:
                print("this is cart  item ID : ",cart_item.product_id)
                product = Product.query.filter_by(id=cart_item.product_id).first()
                if product:
                    discount = Discount.query.filter_by(id=product.discount_id).first()
                    shopping_session.total_amount -= (cart_item.quantity *(product.price - (product.price * discount.discount_percent / 100)))
                    if cart_item.quantity > 1:
                        cart_item.quantity -= 1
                    else:  
                        db.session.delete(cart_item)
                    db.session.commit()
                    return {"message": "Product removed from cart successfully", "status": "Success"}, 200
                else:
                    return {"message": "Product not found", "status": "Failed"}, 404
            else:
                return {"message": "Shopping session not found", "status": "Failed"}, 404
        else:
            return {"message": "Product not found", "status": "Failed"}, 404
    except Exception as e:
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.post("/api/cart/remove/")
@auth_required('token')
@roles_accepted('user')
def remove_from_cart():
    try:
        request_data = request.get_json()
        cart_item_id = request_data['cart_item_id']
        if not cart_item_id or not isinstance(cart_item_id, int):
            return {"message": "Invalid cart item id", "status": "Failed"}, 400
        cart_item = CartItem.query.filter_by(id=cart_item_id).first()
        if cart_item:
            shopping_session = db.session.query(ShoppingSession).filter(ShoppingSession.id == cart_item.session_id).first()
            if shopping_session:
                print("this is cart  item ID : ",cart_item.product_id)
                product = Product.query.filter_by(id=cart_item.product_id).first()
                if product:
                    discount = Discount.query.filter_by(id=product.discount_id).first()
                    shopping_session.total_amount -= (cart_item.quantity *(product.price - (product.price * discount.discount_percent / 100))) * cart_item.quantity 
                    db.session.delete(cart_item)
                    db.session.commit()
                    return {"message": "Product removed from cart successfully", "status": "Success"}, 200
                else:
                    return {"message": "Product not found", "status": "Failed"}, 404
            else:
                return {"message": "Shopping session not found", "status": "Failed"}, 404
        else:
            return {"message": "Product not found", "status": "Failed"}, 404
    except Exception as e:
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.post("/api/cart/checkout/")
@auth_required('token')
@roles_accepted('user')
def checkout():
    try:
        address = request.get_json()['address']
        shopping_session = db.session.query(ShoppingSession).filter(ShoppingSession.user_id == current_user.id).first()
        if shopping_session:
            cart_items = db.session.query(CartItem, Product).filter(CartItem.session_id == shopping_session.id).filter(CartItem.product_id == Product.id).all()
            if cart_items:
                order_details = OrderDetails(user_id=current_user.id, total=0, address=address)
                db.session.add(order_details)
                db.session.commit()
                order_details = db.session.query(OrderDetails).filter(OrderDetails.user_id == current_user.id).order_by(OrderDetails.id.desc()).first()
                for cart_item, product in cart_items:
                    if product:
                        if product.inventory < cart_item.quantity:
                            return {"message": "Product " + product.name + " is out of stock", "status": "Failed"}, 404
                        else:
                            product.inventory -= cart_item.quantity
                            discount = Discount.query.filter_by(id=product.discount_id).first()
                            discount_failed_flag = False
                            if not discount:
                                discount_failed_flag = True
                            sell_price = product.price - (product.price * discount.discount_percent / 100)       
                            
                            order_item = OrderItems(order_id=order_details.id, 
                                                    name=product.name,
                                                    product_id = product.id,
                                                    desc=product.desc,
                                                    sell_price=sell_price,
                                                    manf_date=product.manf_date,
                                                    quantity=cart_item.quantity)
                            db.session.add(order_item)
                            db.session.delete(cart_item)
                            db.session.commit()
                order_details.total=shopping_session.total_amount
                shopping_session.total_amount = 0
                db.session.commit()
                if discount_failed_flag:
                    return {"message": "Checkout successful but failed to apply some discounts.", "status": "Success"}, 200
                return {"message": "Checkout successful", "status": "Success"}, 200
            else:
                return {"message": "No items in cart", "status": "Failed"}, 404
        else:
            return {"message": "No items in cart", "status": "Failed"}, 404
    except Exception as e:
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.get("/api/user/orders/")
@auth_required('token')
@roles_accepted('user')
def show_orders():
    try:
        res_objs = db.session.query(OrderDetails).filter(OrderDetails.user_id == current_user.id).order_by(OrderDetails.id.desc()).all()
        if res_objs:
            orders = []
            for res_obj in res_objs:
                orders.append({
                    "id": res_obj.id,
                    "total": res_obj.total,
                    "date": res_obj.created_on.strftime("%d-%m-%Y"),
                    "time" : res_obj.created_on.strftime("%H:%M:%S"),
                    "address": res_obj.address,
                })
            return {"orders": orders, "message": "Orders found", "status": "Success"}, 200
        else:
            return {"message": "No orders found", "status": "Failed"}, 404
    except Exception as e:
        print(e)
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.get("/api/order/<int:order_id>")
@auth_required('token')
@roles_accepted('user')
def get_order_details(order_id):
    try:
        res_obj = db.session.query(OrderDetails).filter(OrderDetails.id == order_id).filter(OrderDetails.user_id == current_user.id).first()
        if res_obj:
            order_items = db.session.query(OrderItems).filter(OrderItems.order_id == order_id).all()
            if order_items:
                items = []
                for order_item in order_items:
                    items.append({
                        "id": order_item.id,
                        "name": order_item.name,
                        "product_id": order_item.product_id,
                        "desc": order_item.desc,
                        "sell_price": order_item.sell_price,
                        "manf_date": order_item.manf_date,
                        "quantity": order_item.quantity,
                    })
                return {"order_details": {
                    "id": res_obj.id,
                    "total": res_obj.total,
                    "date": res_obj.created_on.strftime("%d-%m-%Y"),
                    "time" : res_obj.created_on.strftime("%H:%M:%S"),
                    "address": res_obj.address,
                    "items": items
                }, "message": "Order found", "status": "Success"}, 200
            else:
                return {"message": "No items in order", "status": "Failed"}, 404
        else:
            return {"message": "Order not found", "status": "Failed"}, 404
    except Exception as e:
        print(e)
        return {"message": "Something went wrong", "status": "Failed"}, 500

@app.route("/api/user/home", methods=["GET"])
@auth_required('token')
@roles_accepted('user')
def user_dashboard():
    latest_products = new_products(num=4)
    popular_products = get_popular_products(num=4)
    discounted_products = get_high_discounted_items(num=8)
    return {"latest_products": latest_products, 
            "popular_products": popular_products, 
            "discounted_products": discounted_products}, 200
