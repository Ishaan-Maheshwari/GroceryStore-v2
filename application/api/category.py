import json
from flask import Flask
from flask_login import current_user
from flask_restful import Api, Resource, reqparse
from flask_security import auth_required, roles_accepted, roles_required
from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app
from application.database import db
from application.models import Category, Requests


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

    @auth_required('token')
    @roles_accepted('admin','manager')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        args = parser.parse_args()
        new_category = Category(
            name=args['name'],
            desc=args['desc']
        )
        if current_user.has_role('admin'):
            db.session.add(new_category)
            db.session.commit()
            return {'message': 'Category created successfully'}, 201
        else:
            new_request = Requests(
                requester_id = current_user.id,
                action = 'add_category',
                details = json.dumps({
                    'name': args['name'],
                    'desc': args['desc']
                }),
                status = 'pending'
            )
            db.session.add(new_request)
            db.session.commit()
            return {'message': 'Request for new Category has been transfered to admin. Wait for admin pproval to see changes.'}, 201

    @auth_required('token')
    @roles_accepted('admin','manager')
    def put(self, category_id):
        category = Category.query.get(category_id)
        if not category:
            return {'message': 'Category not found'}, 404
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('desc', type=str, required=True)
        args = parser.parse_args()
        if(category.name == None or category.name == ''):
            return {'message': 'Category name cannot be empty'}, 400
        if current_user.has_role('admin'):
            category.name = args['name']
            category.desc = args['desc']
            db.session.commit()
            return {'message': 'Category updated successfully'}, 200
        else:
            new_request = Requests(
                requester_id = current_user.id,
                action = 'edit_category',
                details = json.dumps({
                    'id': category_id,
                    'name': args['name'],
                    'desc': args['desc']
                }),
                status = 'pending'
            )
            db.session.add(new_request)
            db.session.commit()
            return {'message': 'Request for updating Category has been transfered to admin. Wait for admin pproval to see changes.'}, 201

    @auth_required('token')
    @roles_accepted('admin','manager')
    def delete(self, category_id):
        category = Category.query.get(category_id)
        if not category:
            return {'message': 'Category not found'}, 404
        if current_user.has_role('admin'):
            db.session.delete(category)
            db.session.commit()
            return {'message': 'Category deleted successfully'}, 200
        else:
            new_request = Requests(
                requester_id = current_user.id,
                action = 'delete_category',
                details = json.dumps({
                    'id': category_id
                }),
                status = 'pending'
            )
            db.session.add(new_request)
            db.session.commit()
            return {'message': 'Request for deleting Category has been transfered to admin. Wait for admin pproval to see changes.'}, 201


# api.add_resource(CategoryResource, '/categories', '/categories/<int:category_id>')