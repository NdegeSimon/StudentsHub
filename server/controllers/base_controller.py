from flask import jsonify, request
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from models.models import db, User

class BaseController:
    """Base controller with common functionality for all controllers"""
    
    @staticmethod
    def success_response(data=None, message="Success", status_code=200):
        """Return a successful JSON response"""
        response = {
            'status': 'success',
            'message': message,
            'data': data
        }
        return jsonify(response), status_code
    
    @staticmethod
    def error_response(message="An error occurred", status_code=400, errors=None):
        """Return an error JSON response"""
        response = {
            'status': 'error',
            'message': message,
            'errors': errors or {}
        }
        return jsonify(response), status_code
    
    @classmethod
    def get_current_user(cls):
        """Get the current authenticated user"""
        user_id = get_jwt_identity()
        if not user_id:
            return None
        return User.query.get(user_id)
    
    @classmethod
    def admin_required(cls, f):
        """Decorator to ensure the user is an admin"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user = cls.get_current_user()
            if not current_user or current_user.role != 'admin':
                return cls.error_response("Admin access required", 403)
            return f(*args, **kwargs)
        return decorated_function
    
    @classmethod
    def company_required(cls, f):
        """Decorator to ensure the user is a company"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user = cls.get_current_user()
            if not current_user or current_user.role != 'company':
                return cls.error_response("Company access required", 403)
            return f(*args, **kwargs)
        return decorated_function
    
    @classmethod
    def student_required(cls, f):
        """Decorator to ensure the user is a student"""
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user = cls.get_current_user()
            if not current_user or current_user.role != 'student':
                return cls.error_response("Student access required", 403)
            return f(*args, **kwargs)
        return decorated_function
