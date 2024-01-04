from .database import db
from flask_login import UserMixin
from flask_security.models import fsqla_v3 as fsqla
from datetime import datetime


fsqla.FsModels.set_db_info(db)

class User(db.Model,fsqla.FsUserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique = True)
    email = db.Column(db.String(100), nullable = False, unique = True)
    password = db.Column(db.String(100))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    telephone = db.Column(db.String(20))
    active = db.Column(db.Boolean, default = True)
    fs_uniquifier = db.Column(db.String(100), unique = True, nullable = False)
    confirmed_at = db.Column(db.DateTime)
    last_login_at = db.Column(db.DateTime)
    current_login_at = db.Column(db.DateTime)
    last_login_ip = db.Column(db.String(100))
    current_login_ip = db.Column(db.String(100))
    login_count = db.Column(db.Integer)
    role = db.Column(db.Integer, db.ForeignKey('role.id'))
    role_type = db.relationship('Role', backref=db.backref('user', lazy=True))
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)

class Role(db.Model, fsqla.FsRoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable = False, unique = True)
    description = db.Column(db.String(255))

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    desc = db.Column(db.String(255))
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)


class Discount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    desc = db.Column(db.String(255))
    discount_percent = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default = True)
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    desc = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category', backref=db.backref('products', lazy=True))
    inventory = db.Column(db.Integer, default = 0)
    price = db.Column(db.Float)
    discount_id = db.Column(db.Integer, db.ForeignKey('discount.id'))
    discount = db.relationship('Discount', backref=db.backref('products', lazy=True))
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)


class ShoppingSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('shopping_sessions', lazy=True))
    total_amount = db.Column(db.Float)
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)


class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('shopping_session.id'))
    session = db.relationship('ShoppingSession', backref=db.backref('cart_items', lazy=True))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship('Product', backref=db.backref('cart_items', lazy=True))
    quantity = db.Column(db.Integer)
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)


class OrderDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('order_details', lazy=True))
    total = db.Column(db.Float)
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)


class OrderItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order_details.id'))
    order = db.relationship('OrderDetails', backref=db.backref('order_items', lazy=True))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship('Product', backref=db.backref('order_items', lazy=True))
    quantity = db.Column(db.Integer)
    created_on = db.Column(db.DateTime, default=datetime.now)
    modified_on = db.Column(db.DateTime, default=datetime.now, onupdate = datetime.now)
