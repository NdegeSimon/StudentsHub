from flask import request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.models import db, User
from .base_controller import BaseController
import re

class AuthController(BaseController):
    """Controller for authentication related operations"""
    
    EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    @classmethod
    def register(cls):
        """Handle user registration"""
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ['email', 'password', 'first_name', 'last_name', 'role']):
            return cls.error_response('Missing required fields', 400)
            
        if not re.match(cls.EMAIL_REGEX, data['email']):
            return cls.error_response('Invalid email format', 400)
            
        if len(data['password']) < 8:
            return cls.error_response('Password must be at least 8 characters', 400)
            
        if data['role'] not in ['student', 'company', 'government']:
            return cls.error_response('Invalid role', 400)
            
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return cls.error_response('Email already registered', 409)
            
        try:
            # Create new user
            user = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=data['role']
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            # Generate access token
            access_token = create_access_token(identity=user.id, expires_delta=cls.get_token_expiry())
            
            return cls.success_response(
                data={
                    'user': user.to_dict(),
                    'access_token': access_token
                },
                message='User registered successfully',
                status_code=201
            )
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
    
    @classmethod
    def login(cls):
        """Handle user login"""
        data = request.get_json()
        
        if not all(k in data for k in ['email', 'password']):
            return cls.error_response('Email and password are required', 400)
            
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return cls.error_response('Invalid email or password', 401)
            
        if not user.is_active:
            return cls.error_response('Account is deactivated', 403)
            
        # Update last login
        user.update_last_login()
        
        # Generate access token
        access_token = create_access_token(identity=user.id, expires_delta=cls.get_token_expiry())
        
        return cls.success_response(
            data={
                'user': user.to_dict(),
                'access_token': access_token
            },
            message='Login successful'
        )
    
    @classmethod
    def get_current_user(cls):
        """Get current authenticated user's profile"""
        current_user = super().get_current_user()
        if not current_user:
            return cls.error_response('Not authenticated', 401)
            
        return cls.success_response(
            data=current_user.to_dict(),
            message='User profile retrieved successfully'
        )
    
    @classmethod
    def update_password(cls):
        """Update user's password"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Not authenticated', 401)
            
        data = request.get_json()
        
        if not all(k in data for k in ['current_password', 'new_password']):
            return cls.error_response('Current and new password are required', 400)
            
        if not current_user.check_password(data['current_password']):
            return cls.error_response('Current password is incorrect', 401)
            
        if len(data['new_password']) < 8:
            return cls.error_response('New password must be at least 8 characters', 400)
            
        try:
            current_user.set_password(data['new_password'])
            db.session.commit()
            return cls.success_response(message='Password updated successfully')
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
    
    @staticmethod
    def get_token_expiry():
        """Get token expiry time (7 days)"""
        from datetime import timedelta
        return timedelta(days=7)
