from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from extensions import db

from models.models import User, Student, Company, Government
import re

bp = Blueprint('auth', __name__)

# Email validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')

def validate_email(email):
    """Validate email format"""
    return EMAIL_REGEX.match(email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    if not re.search(r'[^A-Za-z0-9]', password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

@bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    """Register a new user"""
    
    # Handle OPTIONS preflight request
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'role']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Extract and validate data
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        role = data.get('role', '').strip().lower()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, password_message = validate_password(password)
        if not is_valid:
            return jsonify({'error': password_message}), 400
        
        # Validate role
        valid_roles = ['student', 'employer', 'company', 'government', 'admin']
        if role not in valid_roles:
            return jsonify({
                'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'
            }), 400
        
        # Map 'employer' to 'company' for consistency
        if role == 'employer':
            role = 'company'
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        new_user = User(
            email=email,
            password_hash=generate_password_hash(password),  # Use password_hash field
            first_name=first_name,
            last_name=last_name,
            role=role,
            is_active=True
        )
        
        # Add user to session
        db.session.add(new_user)
        db.session.flush()  # Flush to get user.id before creating related records
        
        # Create role-specific profile
        try:
            if role == 'student':
                student_profile = Student(
                    user_id=new_user.id,
                    skills=[]  # Initialize empty skills array
                )
                db.session.add(student_profile)
                
            elif role == 'company':
                company_profile = Company(
                    user_id=new_user.id,
                    company_name=data.get('company_name', f"{first_name}'s Company")
                )
                db.session.add(company_profile)
                
            elif role == 'government':
                government_profile = Government(
                    user_id=new_user.id,
                    department=data.get('department', 'General')
                )
                db.session.add(government_profile)
        
        except Exception as profile_error:
            db.session.rollback()
            return jsonify({
                'error': f'Failed to create user profile: {str(profile_error)}'
            }), 500
        
        # Commit the transaction
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=new_user.id)
        
        # Return success response
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name,
                'role': new_user.role,
                'created_at': new_user.created_at.isoformat()
            }
        }), 201
        
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': 'Database integrity error. Email may already be registered.'
        }), 409
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")  # Log for debugging
        return jsonify({
            'error': 'An unexpected error occurred during registration',
            'details': str(e)
        }), 500


@bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """Login user"""
    
    # Handle OPTIONS preflight request
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check if user is active
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 403
        
        # Verify password
        if not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.update_last_login()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'error': 'An error occurred during login',
            'details': str(e)
        }), 500


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Build response with role-specific data
        user_data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'phone': user.phone,
            'profile_image': user.profile_image,
            'created_at': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None
        }
        
        # Add role-specific data
        if user.role == 'student' and user.student:
            user_data['student_profile'] = {
                'bio': user.student.bio,
                'institution': user.student.institution,
                'field_of_study': user.student.field_of_study,
                'skills': user.student.skills or []
            }
        elif user.role == 'company' and user.company:
            user_data['company_profile'] = {
                'company_name': user.company.company_name,
                'industry': user.company.industry,
                'website': user.company.website
            }
        
        return jsonify(user_data), 200
        
    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({'error': 'Failed to fetch user data'}), 500


@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)"""
    return jsonify({'message': 'Logout successful'}), 200


@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        old_password = data.get('old_password', '')
        new_password = data.get('new_password', '')
        
        if not old_password or not new_password:
            return jsonify({'error': 'Both old and new passwords are required'}), 400
        
        # Verify old password
        if not check_password_hash(user.password_hash, old_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        is_valid, password_message = validate_password(new_password)
        if not is_valid:
            return jsonify({'error': password_message}), 400
        
        # Update password
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Change password error: {str(e)}")
        return jsonify({'error': 'Failed to change password'}), 500


@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Test protected route"""
    current_user_id = get_jwt_identity()
    return jsonify({
        'message': 'Access granted',
        'user_id': current_user_id
    }), 200