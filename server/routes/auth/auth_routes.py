from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    set_access_cookies,
    unset_jwt_cookies
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
import re
import uuid

from models import db, User, Student, Company, TokenBlocklist
from extensions import bcrypt, mail
from flask_mail import Message
from sqlalchemy import or_

# Blueprint for auth routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Email validation helper
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Password validation helper
def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    return True, ""

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400

        # Required fields
        required = ['email', 'password', 'first_name', 'role']
        if not all(field in data for field in required):
            return jsonify({
                "status": "error",
                "message": f"Missing required fields. Required: {', '.join(required)}"
            }), 400

        email = data['email'].strip().lower()
        password = data['password']
        first_name = data['first_name'].strip()
        last_name = data.get('last_name', '').strip()
        role = data['role'].lower()

        # Validate email
        if not is_valid_email(email):
            return jsonify({"status": "error", "message": "Invalid email format"}), 400

        # Validate password
        is_valid, pwd_msg = validate_password(password)
        if not is_valid:
            return jsonify({"status": "error", "message": pwd_msg}), 400

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({
                "status": "error",
                "message": "Email already registered"
            }), 409

        # Validate role
        if role not in ['student', 'employer']:
            return jsonify({
                "status": "error",
                "message": "Invalid role. Must be 'student' or 'employer'"
            }), 400

        # Create user
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            is_active=True,
            is_verified=False,
            verification_token=str(uuid.uuid4())
        )
        user.set_password(password)

        db.session.add(user)
        db.session.flush()  # Get the user ID

        # Create profile based on role
        if role == 'student':
            student = Student(user_id=user.id)
            db.session.add(student)
        else:  # employer
            company = Company(user_id=user.id, company_name=f"{first_name}'s Company")
            db.session.add(company)

        db.session.commit()

        # Generate tokens with user ID only
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        # Send verification email
        try:
            send_verification_email(user)
        except Exception as e:
            print(f"Failed to send verification email: {str(e)}")

        return jsonify({
            "status": "success",
            "message": "Registration successful. Please check your email to verify your account.",
            "data": {
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                    "is_verified": user.is_verified
                },
                "tokens": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "expires_in": 3600 * 24 * 7  # 7 days
                }
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Registration failed: {str(e)}"
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({
                "status": "error",
                "message": "Email and password are required"
            }), 400

        email = data['email'].strip().lower()
        password = data['password']

        # Find user
        user = User.query.filter_by(email=email).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({
                "status": "error",
                "message": "Invalid email or password"
            }), 401

        # Check if account is active
        if not user.is_active:
            return jsonify({
                "status": "error",
                "message": "Account is deactivated. Please contact support."
            }), 403

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Create tokens with user ID only
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        # Get user data
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "is_verified": user.is_verified,
            "has_profile": bool(user.student_profile if user.role == 'student' else user.company_profile)
        }

        # Add profile data based on role
        if user.role == 'student' and user.student_profile:
            user_data["profile"] = user.student_profile.to_dict()
        elif user.role == 'employer' and user.company_profile:
            user_data["profile"] = user.company_profile.to_dict()

        response = jsonify({
            "status": "success",
            "message": "Login successful",
            "data": {
                "user": user_data,
                "tokens": {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "expires_in": 3600 * 24 * 7  # 7 days
                }
            }
        })

        # Set HTTP-only cookies for tokens
        set_access_cookies(response, access_token)
        
        return response, 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Login failed: {str(e)}"
        }), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        # Extract user ID from current_user (handling both dict and direct ID cases)
        user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        new_token = create_access_token(identity=user_id)
        
        return jsonify({
            "status": "success",
            "data": {
                "access_token": new_token
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Token refresh failed: {str(e)}"
        }), 401

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(days=7)  # Match token expiration
        
        # Add token to blocklist
        db.session.add(TokenBlocklist(
            jti=jti,
            token_type="access",
            user_id=get_jwt_identity().id,
            expires_at=expires_at
        ))
        db.session.commit()
        
        response = jsonify({
            "status": "success",
            "message": "Successfully logged out"
        })
        
        # Clear cookies
        unset_jwt_cookies(response)
        return response, 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": f"Logout failed: {str(e)}"
        }), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user.id)
        
        if not user:
            return jsonify({
                "status": "error",
                "message": "User not found"
            }), 404
            
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "is_verified": user.is_verified,
            "has_profile": bool(user.student_profile if user.role == 'student' else user.company_profile)
        }

        # Add profile data based on role
        if user.role == 'student' and user.student_profile:
            user_data["profile"] = user.student_profile.to_dict()
        elif user.role == 'employer' and user.company_profile:
            user_data["profile"] = user.company_profile.to_dict()
            
        return jsonify({
            "status": "success",
            "data": user_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to fetch user data: {str(e)}"
        }), 500

def send_verification_email(user):
    """Send verification email to user"""
    # In a real app, you would generate a verification link with a token
    # and send it to the user's email
    pass  # Implementation depends on your email service

def send_password_reset_email(user):
    """Send password reset email to user"""
    # In a real app, you would generate a password reset link with a token
    # and send it to the user's email
    pass  # Implementation depends on your email service
