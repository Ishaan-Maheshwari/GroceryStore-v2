from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app
from application.database import db
from application.models import Category


class CategoryResource(Resource):
    def get(self, category_id=None):
        if category_id:
            category = Category.query.get(category_id)
            if not category:
                return {'message': 'Category not found'}, 404
            return {
                'id': category.id,
                'name': category.name,
                'desc': category.desc
            }, 200
        else:
            categories = Category.query.all()
            result = []
            for category in categories:
                result.append({
                    'id': category.id,
                    'name': category.name,
                    'desc': category.desc
                })
            return result, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        args = parser.parse_args()
        new_category = Category(
            name=args['name'],
            desc=args['desc']
        )
        db.session.add(new_category)
        db.session.commit()
        return {'message': 'Category created successfully'}, 201

    def put(self, category_id):
        category = Category.query.get(category_id)
        if not category:
            return {'message': 'Category not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        args = parser.parse_args()
        category.name = args['name']
        category.desc = args['desc']
        db.session.commit()
        return {'message': 'Category updated successfully'}, 200

    def delete(self, category_id):
        category = Category.query.get(category_id)
        if not category:
            return {'message': 'Category not found'}, 404
        db.session.delete(category)
        db.session.commit()
        return {'message': 'Category deleted successfully'}, 200


# api.add_resource(CategoryResource, '/categories', '/categories/<int:category_id>')