from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app
from application.database import db
from application.models import Product, Category


class ProductResource(Resource):
    def get(self, product_id=None):
        if product_id:
            product = Product.query.get(product_id)
            if not product:
                return {'message': 'Product not found'}, 404
            return {
                'id': product.id,
                'name': product.name,
                'desc': product.desc,
                'category_id': product.category_id,
                'inventory': product.inventory,
                'price': product.price,
                'discount_id': product.discount_id
            }, 200
        else:
            products = Product.query.all()
            result = []
            for product in products:
                result.append({
                    'id': product.id,
                    'name': product.name,
                    'desc': product.desc,
                    'category_id': product.category_id,
                    'inventory': product.inventory,
                    'price': product.price,
                    'discount_id': product.discount_id
                })
            return result, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        parser.add_argument('category_id', type=int, required=True)
        parser.add_argument('inventory', type=int, required=True)
        parser.add_argument('price', type=float, required=True)
        parser.add_argument('discount_id', type=int, required=False)
        args = parser.parse_args()
        
        category = Category.query.get(args['category_id'])
        if not category:
            return {'message': 'Invalid category_id'}, 400

        new_product = Product(
            name=args['name'],
            desc=args['desc'],
            category_id=args['category_id'],
            inventory=args['inventory'],
            price=args['price'],
            discount_id=args['discount_id']
        )
        db.session.add(new_product)
        db.session.commit()
        return {'message': 'Product created successfully'}, 201

    def put(self, product_id):
        product = Product.query.get(product_id)
        if not product:
            return {'message': 'Product not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        parser.add_argument('category_id', type=int, required=True)
        parser.add_argument('inventory', type=int, required=True)
        parser.add_argument('price', type=float, required=True)
        parser.add_argument('discount_id', type=int, required=True)
        args = parser.parse_args()

        category = Category.query.get(args['category_id'])
        if not category:
            return {'message': 'Invalid category_id'}, 400

        product.name = args['name']
        product.desc = args['desc']
        product.category_id = args['category_id']
        product.inventory = args['inventory']
        product.price = args['price']
        product.discount_id = args['discount_id']
        db.session.commit()
        return {'message': 'Product updated successfully'}, 200

    def delete(self, product_id):
        product = Product.query.get(product_id)
        if not product:
            return {'message': 'Product not found'}, 404
        db.session.delete(product)
        db.session.commit()
        return {'message': 'Product deleted successfully'}, 200


# api.add_resource(ProductResource, '/products', '/products/<int:product_id>')