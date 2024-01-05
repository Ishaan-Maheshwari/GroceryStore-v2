from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app
from application.database import db
from application.models import Discount


class DiscountResource(Resource):
    def get(self, discount_id=None):
        if discount_id:
            discount = Discount.query.get(discount_id)
            if not discount:
                return {'message': 'Discount not found'}, 404
            return {
                'id': discount.id,
                'name': discount.name,
                'desc': discount.desc,
                'discount_percent': discount.discount_percent,
                'is_active': discount.is_active
            }, 200
        else:
            discounts = Discount.query.all()
            result = []
            for discount in discounts:
                result.append({
                    'id': discount.id,
                    'name': discount.name,
                    'desc': discount.desc,
                    'discount_percent': discount.discount_percent,
                    'is_active': discount.is_active
                })
            return result, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        parser.add_argument('discount_percent', type=float, required=True)
        parser.add_argument('is_active', type=bool, required=True)
        args = parser.parse_args()
        new_discount = Discount(
            name=args['name'],
            desc=args['desc'],
            discount_percent=args['discount_percent'],
            is_active=args['is_active']
        )
        db.session.add(new_discount)
        db.session.commit()
        return {'message': 'Discount created successfully'}, 201

    def put(self, discount_id):
        discount = Discount.query.get(discount_id)
        if not discount:
            return {'message': 'Discount not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        parser.add_argument('discount_percent', type=float, required=True)
        parser.add_argument('is_active', type=bool, required=True)
        args = parser.parse_args()
        discount.name = args['name']
        discount.desc = args['desc']
        discount.discount_percent = args['discount_percent']
        discount.is_active = args['is_active']
        db.session.commit()
        return {'message': 'Discount updated successfully'}, 200

    def delete(self, discount_id):
        discount = Discount.query.get(discount_id)
        if not discount:
            return {'message': 'Discount not found'}, 404
        db.session.delete(discount)
        db.session.commit()
        return {'message': 'Discount deleted successfully'}, 200


# api.add_resource(DiscountResource, '/discounts', '/discounts/<int:discount_id>')