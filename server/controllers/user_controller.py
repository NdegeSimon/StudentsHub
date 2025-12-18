from flask import request
from models.models import db, User
from .base_controller import BaseController

class UserController(BaseController):
    """Controller for user related operations"""
    
    @classmethod
    def get_users(cls):
        """Get all users (admin only)"""
        if not cls.get_current_user() or cls.get_current_user().role != 'admin':
            return cls.error_response('Admin access required', 403)
            
        users = User.query.all()
        return cls.success_response(
            data={'users': [user.to_dict() for user in users]},
            message='Users retrieved successfully'
        )
    
    @classmethod
    def get_user(cls, user_id):
        """Get a specific user by ID"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
            
        # Users can only view their own profile unless they're an admin
        if str(current_user.id) != str(user_id) and current_user.role != 'admin':
            return cls.error_response('Unauthorized', 403)
            
        user = User.query.get(user_id)
        if not user:
            return cls.error_response('User not found', 404)
            
        return cls.success_response(
            data=user.to_dict(),
            message='User retrieved successfully'
        )
    
    @classmethod
    def update_user(cls, user_id):
        """Update a user's profile"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
            
        # Users can only update their own profile unless they're an admin
        if str(current_user.id) != str(user_id) and current_user.role != 'admin':
            return cls.error_response('Unauthorized', 403)
            
        user = User.query.get(user_id)
        if not user:
            return cls.error_response('User not found', 404)
            
        data = request.get_json()
        
        # Prevent role changes unless admin
        if 'role' in data and current_user.role != 'admin':
            return cls.error_response('Only admins can change user roles', 403)
            
        # Update fields
        update_fields = ['first_name', 'last_name', 'phone', 'profile_image', 'is_active']
        if current_user.role == 'admin':
            update_fields.append('role')
            
        for field in update_fields:
            if field in data:
                setattr(user, field, data[field])
                
        try:
            db.session.commit()
            return cls.success_response(
                data=user.to_dict(),
                message='User updated successfully'
            )
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
    
    @classmethod
    def delete_user(cls, user_id):
        """Delete a user (admin only)"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role != 'admin':
            return cls.error_response('Admin access required', 403)
            
        # Prevent deleting yourself
        if str(current_user.id) == str(user_id):
            return cls.error_response('Cannot delete your own account', 400)
            
        user = User.query.get(user_id)
        if not user:
            return cls.error_response('User not found', 404)
            
        try:
            db.session.delete(user)
            db.session.commit()
            return cls.success_response(message='User deleted successfully')
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
