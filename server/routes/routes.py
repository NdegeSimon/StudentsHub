# routes/routes.py - CORRECTED VERSION

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
# REMOVE THIS LINE: from middleware.auth_middleware import auth_middleware

from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import re
import os
import secrets
import json
import traceback
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func

# Import ALL models and extensions at the top
from models import db, User, Student, Company, Job, Application, Notification, JobAnalytics
from extensions import jwt

# Blueprint
bp = Blueprint('auth', __name__)

# Email validation helper
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


# ==================== AUTH ROUTES ====================

@bp.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required = ['email', 'password', 'first_name', 'role']
        if not all(field in data for field in required):
            return jsonify({"error": f"Missing required fields. Required: {', '.join(required)}"}), 400

        email = data['email'].strip().lower()
        password = data['password']
        first_name = data['first_name'].strip()
        last_name = data.get('last_name', '').strip() or None
        role = data['role'].lower()

        # Validate email format
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Validate password length
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400

        # Validate role
        if role not in ['student', 'employer']:
            return jsonify({"error": "Role must be 'student' or 'employer'"}), 400

        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        # Create user with proper password hashing
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        user.set_password(password)  # This will properly hash the password
        db.session.add(user)
        db.session.flush()  # Get the user ID without committing

        # Create profile based on role
        if role == 'student':
            student = Student(user_id=user.id)
            db.session.add(student)
        else:  # employer
            company_name = data.get('company_name', '').strip() or f"{first_name}'s Company"
            company = Company(user_id=user.id, company_name=company_name)
            db.session.add(company)

        # Commit everything at once
        db.session.commit()

        # Generate tokens using Flask-JWT-Extended
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        refresh_token = create_refresh_token(identity={"id": user.id, "role": user.role})

        return jsonify({
            "message": "Account created successfully!",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        error_msg = f"Database error during registration: {str(e)}"
        current_app.logger.error(error_msg)
        return jsonify({
            "error": "Database error during registration",
            "details": str(e)
        }), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        current_app.logger.error(f"Unexpected error in registration: {str(e)}\n{error_trace}")
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e),
            "trace": error_trace if current_app.config.get('DEBUG') else None
        }), 500

        
@bp.route('/auth/login', methods=['POST'])
def login():
    try:
        current_app.logger.info("=== Login attempt ===")
        data = request.get_json()
        
        if not data:
            current_app.logger.error("No data provided in login request")
            return jsonify({"error": "Request data is required"}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        current_app.logger.info(f"Login attempt for email: {email}")
        
        if not email or not password:
            current_app.logger.error("Email and password are required")
            return jsonify({"error": "Email and password are required"}), 400

        email = email.strip().lower()
        current_app.logger.debug(f"Looking up user with email: {email}")
        
        try:
            user = User.query.filter_by(email=email).first()
        except Exception as db_error:
            current_app.logger.error(f"Database error during user lookup: {str(db_error)}")
            current_app.logger.error(traceback.format_exc())
            return jsonify({"error": "Database error during login"}), 500

        if not user:
            current_app.logger.warning(f"No user found with email: {email}")
            return jsonify({"error": "Invalid email or password"}), 401
            
        current_app.logger.debug(f"User found: ID {user.id}, Role: {user.role}")

        # Verify password
        try:
            if not user.check_password(password):
                current_app.logger.warning(f"Invalid password for user: {email}")
                return jsonify({"error": "Invalid email or password"}), 401
        except Exception as pwd_error:
            current_app.logger.error(f"Password verification failed: {str(pwd_error)}")
            current_app.logger.error(traceback.format_exc())
            return jsonify({"error": "Error during password verification"}), 500

        # Check if account is active
        if getattr(user, 'is_active', True) is False:
            current_app.logger.warning(f"Login attempt for deactivated account: {email}")
            return jsonify({"error": "Account deactivated"}), 403

        # Create tokens
        try:
            token_data = {"id": user.id, "role": user.role}
            current_app.logger.debug(f"Creating tokens for user ID: {user.id}")
            
            access_token = create_access_token(identity=token_data)
            refresh_token = create_refresh_token(identity=token_data)
            
            user_data = {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name or "",
                "role": user.role
            }
            
            current_app.logger.info(f"Successful login for user ID: {user.id}")
            
            return jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user_data
            }), 200
            
        except Exception as token_error:
            current_app.logger.error(f"Token creation failed: {str(token_error)}")
            current_app.logger.error(traceback.format_exc())
            return jsonify({"error": "Error creating authentication tokens"}), 500

    except Exception as e:
        current_app.logger.error(f"Unexpected error in login: {str(e)}")
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "An unexpected error occurred during login"}), 500


@bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_identity = get_jwt_identity()
    new_token = create_access_token(identity=current_user_identity)
    return jsonify({"access_token": new_token}), 200


@bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    try:
        # Get the identity from the JWT token
        current_app.logger.info("=== /auth/me endpoint called ===")
        
        # Get the raw JWT token for debugging
        jwt_data = get_jwt()
        current_app.logger.info(f"JWT data: {jwt_data}")
        
        user_identity = get_jwt_identity()
        current_app.logger.info(f"JWT Identity: {user_identity}")
        
        # Handle different identity formats
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
            if not user_id:
                error_msg = "JWT identity is missing 'id' field"
                current_app.logger.error(error_msg)
                return jsonify({"error": error_msg}), 401
        else:
            user_id = user_identity
            
        current_app.logger.info(f"Extracted user_id: {user_id}")
        
        # Verify user_id is not None or empty
        if not user_id:
            error_msg = "No user ID found in JWT token"
            current_app.logger.error(error_msg)
            return jsonify({"error": error_msg}), 401
            
        # Get user from database
        user = User.query.get(user_id)
        if not user:
            current_app.logger.error(f"User not found with ID: {user_id}")
            return jsonify({"error": "User not found"}), 404
            
        # Return user data
        user_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name or '',
            "role": user.role,
            "is_active": user.is_active
        }
        
        # Add profile data based on role
        if hasattr(user, 'student_profile') and user.student_profile:
            user_data['profile_complete'] = bool(user.student_profile.skills)
        elif hasattr(user, 'company_profile') and user.company_profile:
            user_data['profile_complete'] = bool(user.company_profile.description)
            
        return jsonify(user_data), 200
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        current_app.logger.error(f"Error in /auth/me: {str(e)}\n{error_trace}")
        return jsonify({
            "error": "Failed to fetch user data",
            "details": str(e),
            "trace": error_trace if current_app.config.get('DEBUG') else None
        }), 500


# ==================== PROFILE ROUTES ====================

# FIXED: Changed from incorrect @bp.route("/profile", authMiddleware, getProfile)
# to proper decorator syntax:

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's profile"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        }

        if user.role == 'student' and hasattr(user, 'student') and user.student:
            s = user.student
            profile.update({
                "phone": s.phone,
                "address": s.address,
                "education": s.education,
                "skills": s.skills,
                "resume_url": s.resume_url,
                "profile_picture": s.profile_picture
            })
        elif user.role == 'employer' and hasattr(user, 'company') and user.company:
            c = user.company
            profile.update({
                "company_name": c.company_name,
                "description": c.description,
                "website": c.website,
                "phone": c.phone,
                "address": c.address,
                "logo_url": c.logo_url
            })

        return jsonify(profile), 200
        
    except Exception as e:
        current_app.logger.error(f"Get profile error: {str(e)}")
        return jsonify({"error": "Failed to fetch profile"}), 500


@bp.route('/auth/profile', methods=['GET'])
@jwt_required()
def get_auth_profile():
    """Alias for /profile to maintain API consistency"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        }

        if user.role == 'student' and hasattr(user, 'student') and user.student:
            s = user.student
            profile.update({
                "phone": s.phone,
                "address": s.address,
                "education": s.education,
                "skills": s.skills,
                "resume_url": s.resume_url,
                "profile_picture": s.profile_picture
            })
        elif user.role == 'employer' and hasattr(user, 'company') and user.company:
            c = user.company
            profile.update({
                "company_name": c.company_name,
                "description": c.description,
                "website": c.website,
                "phone": c.phone,
                "address": c.address,
                "logo_url": c.logo_url
            })

        return jsonify(profile), 200
        
    except Exception as e:
        current_app.logger.error(f"Get auth profile error: {str(e)}")
        return jsonify({"error": "Failed to fetch profile"}), 500


@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']

        if 'current_password' in data and 'new_password' in data:
            if not check_password_hash(user.password_hash, data['current_password']):
                return jsonify({"error": "Current password incorrect"}), 400
            user.password_hash = generate_password_hash(data['new_password'])

        # Student profile
        if user.role == 'student' and hasattr(user, 'student') and user.student:
            s = user.student
            if 'phone' in data:
                s.phone = data['phone']
            if 'address' in data:
                s.address = data['address']
            if 'education' in data:
                s.education = data['education']
            if 'skills' in data:
                s.skills = data['skills']
            if 'resume_url' in data:
                s.resume_url = data['resume_url']
            if 'profile_picture' in data:
                s.profile_picture = data['profile_picture']

        # Employer profile
        elif user.role == 'employer' and hasattr(user, 'company') and user.company:
            c = user.company
            if 'company_name' in data:
                c.company_name = data['company_name']
            if 'description' in data:
                c.description = data['description']
            if 'website' in data:
                c.website = data['website']
            if 'phone' in data:
                c.phone = data['phone']
            if 'address' in data:
                c.address = data['address']
            if 'logo_url' in data:
                c.logo_url = data['logo_url']

        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update profile error: {str(e)}")
        return jsonify({"error": "Update failed"}), 500


# ==================== JOB & APPLICATION ROUTES ====================

@bp.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)
        search = request.args.get('search', '')
        job_type = request.args.get('type')
        location = request.args.get('location')

        query = Job.query.filter_by(is_active=True)

        if search:
            search_like = f"%{search}%"
            query = query.filter(
                Job.title.ilike(search_like) |
                Job.description.ilike(search_like) |
                Job.requirements.ilike(search_like)
            )
        if job_type:
            query = query.filter(Job.job_type == job_type)
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))

        pagination = query.order_by(Job.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        jobs_list = []
        for job in pagination.items:
            jobs_list.append({
                "id": job.id,
                "title": job.title,
                "company_name": job.company.company_name if job.company else "Unknown",
                "location": job.location,
                "job_type": job.job_type,
                "salary": job.salary,
                "created_at": job.created_at.isoformat()
            })

        return jsonify({
            "jobs": jobs_list,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get jobs error: {str(e)}")
        return jsonify({"error": "Failed to fetch jobs"}), 500


@bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = Job.query.get_or_404(job_id)
        if not job.is_active:
            return jsonify({"error": "Job not found"}), 404

        return jsonify({
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements,
            "location": job.location,
            "job_type": job.job_type,
            "salary": job.salary,
            "company": {
                "id": job.company.id,
                "name": job.company.company_name,
                "description": job.company.description,
                "website": job.company.website,
                "logo_url": job.company.logo_url
            } if job.company else {},
            "created_at": job.created_at.isoformat(),
            "updated_at": job.updated_at.isoformat()
        }), 200

    except Exception as e:
        current_app.logger.error(f"Get job error: {str(e)}")
        return jsonify({"error": "Failed to fetch job"}), 500


@bp.route('/applications', methods=['POST'])
@jwt_required()
def create_application():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({"error": "Only students can apply"}), 403

        data = request.get_json()
        if 'job_id' not in data:
            return jsonify({"error": "job_id required"}), 400

        job = Job.query.get(data['job_id'])
        if not job or not job.is_active:
            return jsonify({"error": "Job not found or inactive"}), 404

        # Get student profile
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        if Application.query.filter_by(job_id=job.id, student_id=student.id).first():
            return jsonify({"error": "Already applied"}), 400

        app = Application(
            job_id=job.id,
            student_id=student.id,
            cover_letter=data.get('cover_letter', '')
        )
        db.session.add(app)
        db.session.commit()
        
        return jsonify({"message": "Applied successfully", "application_id": app.id}), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create application error: {str(e)}")
        return jsonify({"error": "Apply failed"}), 500


@bp.route('/applications/me', methods=['GET'])
@jwt_required()
def get_my_applications():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({"error": "Only students can view applications"}), 403

        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        apps = Application.query.filter_by(student_id=student.id)\
            .order_by(Application.created_at.desc()).all()

        result = []
        for a in apps:
            result.append({
                "id": a.id,
                "job_id": a.job_id,
                "job_title": a.job.title,
                "company_name": a.job.company.company_name if a.job.company else "Unknown",
                "status": a.status,
                "applied_date": a.created_at.isoformat()
            })

        return jsonify(result), 200
        
    except Exception as e:
        current_app.logger.error(f"Get applications error: {str(e)}")
        return jsonify({"error": "Failed to fetch applications"}), 500


@bp.route('/applications/upcoming-deadlines', methods=['GET'])
@jwt_required()
def get_upcoming_deadlines():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({"error": "Only students can view upcoming deadlines"}), 403
        
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404
        
        # Get applications with deadlines in the next 30 days
        thirty_days_later = datetime.utcnow() + timedelta(days=30)
        
        upcoming = db.session.query(
            Application, Job
        ).join(
            Job, Application.job_id == Job.id
        ).filter(
            Application.student_id == student.id,
            Job.deadline >= datetime.utcnow(),
            Job.deadline <= thirty_days_later
        ).order_by(
            Job.deadline.asc()
        ).all()
        
        result = []
        for app, job in upcoming:
            result.append({
                "id": app.id,
                "job_id": job.id,
                "job_title": job.title,
                "company_name": job.company.company_name if job.company else "Unknown",
                "deadline": job.deadline.isoformat(),
                "days_remaining": (job.deadline - datetime.utcnow()).days,
                "status": app.status
            })
            
        return jsonify(result), 200
        
    except Exception as e:
        current_app.logger.error(f"Get upcoming deadlines error: {str(e)}")
        return jsonify({"error": "Failed to fetch upcoming deadlines"}), 500


# ==================== FILE UPLOAD ====================

@bp.route('/upload/<file_type>', methods=['POST'])
@jwt_required()
def upload_file(file_type):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        upload_folder = os.path.join(os.path.dirname(__file__), '..', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        filename = secure_filename(f"{file_type}_{datetime.utcnow().timestamp()}_{file.filename}")
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        file_url = f"/uploads/{filename}"

        return jsonify({
            "message": "File uploaded",
            "url": file_url,
            "filename": filename
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"File upload error: {str(e)}")
        return jsonify({"error": "File upload failed"}), 500


# ==================== ADMIN ROUTES ====================

@bp.route('/admin/users', methods=['GET'])
@jwt_required()
def admin_get_users():
    """Admin: Get all users (admin only)"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        # Check if user is admin
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 20, type=int)
        role = request.args.get('role')
        
        query = User.query
        
        if role:
            query = query.filter(User.role == role)
        
        pagination = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        users_list = []
        for user in pagination.items:
            users_list.append({
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "is_active": getattr(user, 'is_active', True),
                "created_at": user.created_at.isoformat() if user.created_at else None
            })
        
        return jsonify({
            "users": users_list,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Admin get users error: {str(e)}")
        return jsonify({"error": "Failed to fetch users"}), 500


@bp.route('/admin/users/<int:user_id>/toggle', methods=['PUT'])
@jwt_required()
def admin_toggle_user(user_id):
    """Admin: Toggle user active status"""
    try:
        admin_identity = get_jwt_identity()
        admin_id = admin_identity.get('id') if isinstance(admin_identity, dict) else admin_identity
        
        # Check if admin
        admin = User.query.get(admin_id)
        if not admin or admin.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Cannot deactivate yourself
        if user.id == admin.id:
            return jsonify({"error": "Cannot deactivate yourself"}), 400
        
        user.is_active = not user.is_active
        db.session.commit()
        
        return jsonify({
            "message": f"User {'activated' if user.is_active else 'deactivated'}",
            "user": {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Admin toggle user error: {str(e)}")
        return jsonify({"error": "Failed to toggle user status"}), 500


# ==================== COMPANY-SPECIFIC ROUTES ====================

@bp.route('/companies', methods=['GET'])
def get_companies():
    """Get all companies (public)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)
        search = request.args.get('search', '')
        industry = request.args.get('industry')
        
        query = Company.query
        
        if search:
            search_like = f"%{search}%"
            query = query.filter(
                Company.company_name.ilike(search_like) |
                Company.description.ilike(search_like) |
                Company.industry.ilike(search_like)
            )
        
        if industry:
            query = query.filter(Company.industry == industry)
        
        # Only show verified companies by default
        verification_filter = request.args.get('verification', 'verified')
        if verification_filter == 'verified':
            query = query.filter(Company.verification_status == 'verified')
        elif verification_filter == 'all':
            pass  # Show all
        
        pagination = query.order_by(Company.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        companies_list = []
        for company in pagination.items:
            companies_list.append({
                "id": company.id,
                "company_name": company.company_name,
                "description": company.description[:200] if company.description else "",
                "industry": company.industry,
                "location": company.location,
                "logo_url": company.logo_url,
                "verification_status": company.verification_status,
                "jobs_count": len([job for job in company.jobs if job.is_active]),
                "created_at": company.created_at.isoformat()
            })
        
        return jsonify({
            "companies": companies_list,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get companies error: {str(e)}")
        return jsonify({"error": "Failed to fetch companies"}), 500


@bp.route('/companies/<int:company_id>', methods=['GET'])
def get_company(company_id):
    """Get company details by ID"""
    try:
        company = Company.query.get_or_404(company_id)
        
        # Count active jobs
        active_jobs = [job for job in company.jobs if job.is_active]
        active_jobs_count = len(active_jobs)
        
        # Get recent jobs
        recent_jobs = []
        for job in sorted(active_jobs, key=lambda x: x.created_at, reverse=True)[:5]:
            recent_jobs.append({
                "id": job.id,
                "title": job.title,
                "job_type": job.job_type,
                "location": job.location,
                "created_at": job.created_at.isoformat()
            })
        
        company_data = {
            "id": company.id,
            "company_name": company.company_name,
            "description": company.description,
            "industry": company.industry,
            "company_size": company.company_size,
            "founded_year": company.founded_year,
            "website": company.website,
            "phone": company.phone,
            "location": company.location,
            "address": company.address,
            "logo_url": company.logo_url,
            "cover_image_url": company.cover_image_url,
            "linkedin_url": company.linkedin_url,
            "twitter_url": company.twitter_url,
            "verification_status": company.verification_status,
            "benefits": company.benefits or [],
            "culture_values": company.culture_values or [],
            "active_jobs_count": active_jobs_count,
            "recent_jobs": recent_jobs,
            "created_at": company.created_at.isoformat()
        }
        
        return jsonify(company_data), 200
        
    except Exception as e:
        current_app.logger.error(f"Get company error: {str(e)}")
        return jsonify({"error": "Failed to fetch company"}), 500


@bp.route('/companies/<int:company_id>/jobs', methods=['GET'])
def get_company_jobs(company_id):
    """Get all jobs for a specific company"""
    try:
        company = Company.query.get_or_404(company_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)
        job_type = request.args.get('type')
        
        query = [job for job in company.jobs if job.is_active]
        
        if job_type:
            query = [job for job in query if job.job_type == job_type]
        
        # Manual pagination
        total = len(query)
        pages = (total + per_page - 1) // per_page
        start = (page - 1) * per_page
        end = start + per_page
        paginated_jobs = query[start:end]
        
        jobs_list = []
        for job in paginated_jobs:
            jobs_list.append({
                "id": job.id,
                "title": job.title,
                "description": job.description[:200] if job.description else "",
                "location": job.location,
                "job_type": job.job_type,
                "work_mode": job.work_mode,
                "experience_level": job.experience_level,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "created_at": job.created_at.isoformat(),
                "applicants_count": len(job.applications)
            })
        
        return jsonify({
            "company": {
                "id": company.id,
                "name": company.company_name,
                "logo_url": company.logo_url
            },
            "jobs": jobs_list,
            "total": total,
            "pages": pages,
            "current_page": page
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get company jobs error: {str(e)}")
        return jsonify({"error": "Failed to fetch company jobs"}), 500


# ==================== EMPLOYER DASHBOARD ROUTES ====================

@bp.route('/employer/dashboard', methods=['GET'])
@jwt_required()
def employer_dashboard():
    """Get employer dashboard statistics"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'employer':
            return jsonify({"error": "Employer access required"}), 403
        
        company = Company.query.filter_by(user_id=user_id).first()
        if not company:
            return jsonify({"error": "Company profile not found"}), 404
        
        # Basic stats
        active_jobs = len([job for job in company.jobs if job.is_active])
        
        # Get all applications for company's jobs
        all_applications = []
        for job in company.jobs:
            all_applications.extend(job.applications)
        total_applications = len(all_applications)
        
        # Recent applications (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_applications = len([app for app in all_applications 
                                  if app.created_at >= thirty_days_ago])
        
        # Job with most applications
        popular_job = None
        max_applications = 0
        for job in company.jobs:
            if job.is_active:
                app_count = len(job.applications)
                if app_count > max_applications:
                    max_applications = app_count
                    popular_job = job
        
        # Recent job postings
        recent_jobs = []
        for job in sorted(company.jobs, key=lambda x: x.created_at, reverse=True)[:5]:
            if job.is_active:
                recent_jobs.append({
                    "id": job.id,
                    "title": job.title,
                    "created_at": job.created_at.isoformat(),
                    "applications": len(job.applications)
                })
        
        dashboard_data = {
            "company": {
                "id": company.id,
                "name": company.company_name,
                "logo_url": company.logo_url
            },
            "stats": {
                "active_jobs": active_jobs,
                "total_applications": total_applications,
                "recent_applications": recent_applications
            },
            "popular_job": {
                "id": popular_job.id if popular_job else None,
                "title": popular_job.title if popular_job else None,
                "applications": max_applications
            } if popular_job else None,
            "recent_jobs": recent_jobs
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        current_app.logger.error(f"Employer dashboard error: {str(e)}")
        return jsonify({"error": "Failed to load dashboard"}), 500


@bp.route('/employer/applications', methods=['GET'])
@jwt_required()
def employer_get_applications():
    """Get applications for employer's jobs"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'employer':
            return jsonify({"error": "Employer access required"}), 403
        
        company = Company.query.filter_by(user_id=user_id).first()
        if not company:
            return jsonify({"error": "Company profile not found"}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)
        job_id = request.args.get('job_id')
        status = request.args.get('status')
        
        # Get all applications for company's jobs
        all_applications = []
        for job in company.jobs:
            for app in job.applications:
                # Filter by job_id if specified
                if job_id and str(job.id) != str(job_id):
                    continue
                # Filter by status if specified
                if status and app.status != status:
                    continue
                
                student = Student.query.get(app.student_id)
                student_user = User.query.get(student.user_id) if student else None
                
                all_applications.append({
                    "app": app,
                    "job": job,
                    "student": student,
                    "student_user": student_user
                })
        
        # Sort by creation date
        all_applications.sort(key=lambda x: x["app"].created_at, reverse=True)
        
        # Pagination
        total = len(all_applications)
        pages = (total + per_page - 1) // per_page
        start = (page - 1) * per_page
        end = start + per_page
        paginated_apps = all_applications[start:end]
        
        applications_list = []
        for item in paginated_apps:
            app = item["app"]
            job = item["job"]
            student = item["student"]
            student_user = item["student_user"]
            
            applications_list.append({
                "id": app.id,
                "job": {
                    "id": job.id,
                    "title": job.title
                },
                "student": {
                    "id": student.id if student else None,
                    "name": f"{student_user.first_name} {student_user.last_name or ''}".strip() if student_user else "Unknown",
                    "email": student_user.email if student_user else None,
                    "phone": student.phone if student else None,
                    "resume_url": student.resume_url if student else None,
                    "profile_picture": student.profile_picture if student else None
                },
                "cover_letter": app.cover_letter,
                "status": app.status,
                "applied_at": app.created_at.isoformat(),
                "match_percentage": getattr(app, 'match_percentage', 0)
            })
        
        return jsonify({
            "applications": applications_list,
            "total": total,
            "pages": pages,
            "current_page": page
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Employer get applications error: {str(e)}")
        return jsonify({"error": "Failed to fetch applications"}), 500


@bp.route('/employer/applications/<int:application_id>', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """Update application status (employer only)"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'employer':
            return jsonify({"error": "Employer access required"}), 403
        
        company = Company.query.filter_by(user_id=user_id).first()
        if not company:
            return jsonify({"error": "Company profile not found"}), 404
        
        application = Application.query.get_or_404(application_id)
        
        # Check if application belongs to employer's company
        job = Job.query.get(application.job_id)
        if not job or job.company_id != company.id:
            return jsonify({"error": "Application not found"}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        notes = data.get('notes')
        rejection_reason = data.get('rejection_reason')
        
        if not new_status:
            return jsonify({"error": "Status is required"}), 400
        
        valid_statuses = ['new', 'under_review', 'interview_scheduled', 'rejected', 'hired']
        if new_status not in valid_statuses:
            return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400
        
        application.status = new_status
        application.reviewed_at = datetime.utcnow()
        
        if notes:
            application.employer_notes = notes
        if rejection_reason and new_status == 'rejected':
            application.rejection_reason = rejection_reason
        
        db.session.commit()
        
        return jsonify({
            "message": "Application status updated",
            "application": {
                "id": application.id,
                "status": application.status,
                "job_title": job.title,
                "student_name": f"{application.student.user.first_name} {application.student.user.last_name or ''}".strip() if application.student and application.student.user else "Unknown"
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Update application status error: {str(e)}")
        return jsonify({"error": "Failed to update application status"}), 500


# ==================== STUDENT DASHBOARD ROUTES ====================

@bp.route('/student/dashboard', methods=['GET'])
@jwt_required()
def student_dashboard():
    """Get student dashboard statistics"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({"error": "Student access required"}), 403
        
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404
        
        # Basic stats
        total_applications = len(student.applications)
        
        # Status breakdown
        status_counts = {}
        for app in student.applications:
            status = app.status
            status_counts[status] = status_counts.get(status, 0) + 1
        
        # Recent applications (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_applications = len([app for app in student.applications 
                                  if app.created_at >= thirty_days_ago])
        
        # Recent application activity
        recent_activity = []
        for app in sorted(student.applications, key=lambda x: x.created_at, reverse=True)[:5]:
            recent_activity.append({
                "job_title": app.job.title,
                "company_name": app.job.company.company_name if app.job.company else "Unknown",
                "status": app.status,
                "applied_at": app.created_at.isoformat()
            })
        
        dashboard_data = {
            "student": {
                "id": student.id,
                "name": f"{user.first_name} {user.last_name or ''}".strip(),
                "profile_picture": student.profile_picture
            },
            "stats": {
                "total_applications": total_applications,
                "recent_applications": recent_applications,
                "status_breakdown": status_counts
            },
            "recent_activity": recent_activity
        }
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        current_app.logger.error(f"Student dashboard error: {str(e)}")
        return jsonify({"error": "Failed to load dashboard"}), 500


# ==================== NOTIFICATION ROUTES ====================

@bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get user notifications"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 20, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        query = Notification.query.filter_by(user_id=user_id)
        
        if unread_only:
            query = query.filter_by(is_read=False)
        
        pagination = query.order_by(
            Notification.created_at.desc()
        ).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        notifications_list = []
        for notification in pagination.items:
            notifications_list.append({
                "id": notification.id,
                "type": notification.notification_type,
                "title": notification.title,
                "message": notification.message,
                "link_url": notification.link_url,
                "is_read": notification.is_read,
                "metadata": notification.notification_metadata,
                "created_at": notification.created_at.isoformat()
            })
        
        # Get unread count
        unread_count = Notification.query.filter_by(user_id=user_id, is_read=False).count()
        
        return jsonify({
            "notifications": notifications_list,
            "unread_count": unread_count,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get notifications error: {str(e)}")
        return jsonify({"error": "Failed to fetch notifications"}), 500


@bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        notification = Notification.query.get_or_404(notification_id)
        
        # Check if notification belongs to user
        if notification.user_id != user_id:
            return jsonify({"error": "Notification not found"}), 404
        
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            db.session.commit()
        
        return jsonify({
            "message": "Notification marked as read",
            "notification": {
                "id": notification.id,
                "is_read": notification.is_read
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Mark notification read error: {str(e)}")
        return jsonify({"error": "Failed to mark notification as read"}), 500


@bp.route('/notifications/read-all', methods=['PUT'])
@jwt_required()
def mark_all_notifications_read():
    """Mark all notifications as read"""
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        # Update all unread notifications for user
        notifications = Notification.query.filter_by(user_id=user_id, is_read=False).all()
        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "message": f"Marked {len(notifications)} notifications as read"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Mark all notifications read error: {str(e)}")
        return jsonify({"error": "Failed to mark notifications as read"}), 500


# ==================== ANALYTICS ROUTES ====================

@bp.route('/analytics/job-views/<int:job_id>', methods=['POST'])
def track_job_view(job_id):
    """Track a job view (for analytics)"""
    try:
        job = Job.query.get(job_id)
        if not job or not job.is_active:
            return jsonify({"error": "Job not found"}), 404
        
        # Increment job views
        if hasattr(job, 'views_count'):
            job.views_count += 1
        else:
            job.views_count = 1
        
        # Update or create daily analytics
        today = datetime.utcnow().date()
        analytics = JobAnalytics.query.filter_by(
            job_id=job_id,
            date=today
        ).first()
        
        if analytics:
            analytics.views += 1
        else:
            analytics = JobAnalytics(
                job_id=job_id,
                date=today,
                views=1,
                applications=0,
                clicks=0,
                unique_visitors=1
            )
            db.session.add(analytics)
        
        db.session.commit()
        
        return jsonify({
            "message": "View tracked",
            "job": {
                "id": job.id,
                "title": job.title,
                "views_count": job.views_count
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Track job view error: {str(e)}")
        return jsonify({"error": "Failed to track view"}), 500


# ==================== UTILITY ROUTES ====================

@bp.route('/industries', methods=['GET'])
def get_industries():
    """Get list of unique industries"""
    try:
        companies = Company.query.filter(
            Company.industry.isnot(None),
            Company.industry != '',
            Company.verification_status == 'verified'
        ).all()
        
        industries = set()
        for company in companies:
            if company.industry:
                industries.add(company.industry)
        
        industry_list = sorted(list(industries))
        
        return jsonify({
            "industries": industry_list,
            "count": len(industry_list)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get industries error: {str(e)}")
        return jsonify({"error": "Failed to fetch industries"}), 500


@bp.route('/locations', methods=['GET'])
def get_locations():
    """Get list of unique locations"""
    try:
        all_locations = set()
        
        # Get company locations
        companies = Company.query.filter(
            Company.location.isnot(None),
            Company.location != '',
            Company.verification_status == 'verified'
        ).all()
        
        for company in companies:
            if company.location:
                all_locations.add(company.location)
        
        # Get job locations
        jobs = Job.query.filter(
            Job.location.isnot(None),
            Job.location != '',
            Job.is_active == True
        ).all()
        
        for job in jobs:
            if job.location:
                all_locations.add(job.location)
        
        location_list = sorted(list(all_locations))
        
        return jsonify({
            "locations": location_list,
            "count": len(location_list)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get locations error: {str(e)}")
        return jsonify({"error": "Failed to fetch locations"}), 500


@bp.route('/skills', methods=['GET'])
def get_skills():
    """Get list of unique skills from jobs and students"""
    try:
        all_skills = set()
        
        # Get skills from jobs
        jobs = Job.query.filter(
            Job.is_active == True
        ).all()
        
        for job in jobs:
            if job.required_skills:
                try:
                    skills = json.loads(job.required_skills) if isinstance(job.required_skills, str) else job.required_skills
                    if isinstance(skills, list):
                        all_skills.update(skills)
                except:
                    pass
            
            if job.preferred_skills:
                try:
                    skills = json.loads(job.preferred_skills) if isinstance(job.preferred_skills, str) else job.preferred_skills
                    if isinstance(skills, list):
                        all_skills.update(skills)
                except:
                    pass
        
        # Get skills from students
        students = Student.query.filter(
            Student.skills.isnot(None)
        ).all()
        
        for student in students:
            if student.skills:
                try:
                    skills = json.loads(student.skills) if isinstance(student.skills, str) else student.skills
                    if isinstance(skills, list):
                        all_skills.update(skills)
                except:
                    pass
        
        skill_list = sorted(list(all_skills))
        
        return jsonify({
            "skills": skill_list,
            "count": len(skill_list)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get skills error: {str(e)}")
        return jsonify({"error": "Failed to fetch skills"}), 500


# ==================== SEARCH ROUTES ====================

@bp.route('/search/global', methods=['GET'])
def global_search():
    """Global search across jobs, companies, and students"""
    try:
        query = request.args.get('q', '')
        if not query or len(query.strip()) < 2:
            return jsonify({
                "jobs": [],
                "companies": [],
                "students": [],
                "total": 0
            }), 200
        
        search_term = f"%{query.strip()}%"
        
        # Search jobs
        jobs = Job.query.filter(
            Job.is_active == True,
            (Job.title.ilike(search_term) | 
             Job.description.ilike(search_term) |
             Job.requirements.ilike(search_term))
        ).order_by(Job.created_at.desc()).limit(10).all()
        
        # Search companies
        companies = Company.query.filter(
            Company.verification_status == 'verified',
            (Company.company_name.ilike(search_term) |
             Company.description.ilike(search_term) |
             Company.industry.ilike(search_term))
        ).order_by(Company.created_at.desc()).limit(10).all()
        
        # Search students
        students = []
        all_students = Student.query.join(User).filter(
            Student.is_profile_public == True
        ).all()
        
        for student in all_students:
            user = student.user
            if (user.first_name and search_term[2:-2].lower() in user.first_name.lower() or
                user.last_name and search_term[2:-2].lower() in user.last_name.lower() or
                student.bio and search_term[2:-2].lower() in student.bio.lower() or
                student.location and search_term[2:-2].lower() in student.location.lower()):
                students.append(student)
        
        jobs_list = []
        for job in jobs:
            jobs_list.append({
                "id": job.id,
                "title": job.title,
                "company_name": job.company.company_name if job.company else "Unknown",
                "location": job.location,
                "job_type": job.job_type
            })
        
        companies_list = []
        for company in companies:
            companies_list.append({
                "id": company.id,
                "name": company.company_name,
                "industry": company.industry,
                "location": company.location,
                "logo_url": company.logo_url
            })
        
        students_list = []
        for student in students[:10]:  # Limit to 10
            user = student.user
            students_list.append({
                "id": student.id,
                "name": f"{user.first_name} {user.last_name or ''}".strip(),
                "bio": student.bio[:100] if student.bio else "",
                "location": student.location,
                "profile_picture": student.profile_picture,
                "skills": student.skills[:3] if student.skills else []
            })
        
        return jsonify({
            "jobs": jobs_list,
            "companies": companies_list,
            "students": students_list,
            "total": len(jobs_list) + len(companies_list) + len(students_list)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Global search error: {str(e)}")
        return jsonify({"error": "Search failed"}), 500


# ==================== PASSWORD RESET ROUTES ====================

@bp.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            # Don't reveal if user exists or not
            return jsonify({
                "message": "If an account exists with this email, a reset link has been sent"
            }), 200
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        
        db.session.commit()
        
        # In a real app, send email here
        reset_link = f"{request.host_url}reset-password?token={reset_token}"
        
        # For development, return the link
        return jsonify({
            "message": "Password reset requested",
            "reset_token": reset_token,  # Remove in production
            "reset_link": reset_link     # Remove in production
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Forgot password error: {str(e)}")
        return jsonify({"error": "Password reset request failed"}), 500


@bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('password')
        
        if not token or not new_password:
            return jsonify({"error": "Token and password are required"}), 400
        
        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400
        
        user = User.query.filter_by(reset_token=token).first()
        if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
            return jsonify({"error": "Invalid or expired reset token"}), 400
        
        # Update password
        user.password_hash = generate_password_hash(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        
        db.session.commit()
        
        return jsonify({
            "message": "Password reset successful"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Reset password error: {str(e)}")
        return jsonify({"error": "Password reset failed"}), 500


# ==================== LOGOUT ROUTE ====================

@bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token invalidation)"""
    try:
        # In a real app, you might want to add token to a blacklist
        # For JWT, tokens are stateless, so client should delete them
        
        return jsonify({
            "message": "Logged out successfully"
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Logout error: {str(e)}")
        return jsonify({"error": "Logout failed"}), 500


# ==================== SYSTEM STATUS ====================

@bp.route('/system/status', methods=['GET'])
def system_status():
    """Get system status and statistics"""
    try:
        total_users = User.query.count()
        total_jobs = len([job for job in Job.query.all() if job.is_active])
        total_companies = Company.query.filter_by(verification_status='verified').count()
        total_applications = Application.query.count()
        
        # Recent activity (last 24 hours)
        twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
        
        recent_users = User.query.filter(User.created_at >= twenty_four_hours_ago).count()
        recent_jobs = len([job for job in Job.query.filter(Job.created_at >= twenty_four_hours_ago).all() 
                          if job.is_active])
        recent_applications = Application.query.filter(
            Application.created_at >= twenty_four_hours_ago
        ).count()
        
        return jsonify({
            "status": "online",
            "timestamp": datetime.utcnow().isoformat(),
            "statistics": {
                "total_users": total_users,
                "total_jobs": total_jobs,
                "total_companies": total_companies,
                "total_applications": total_applications
            },
            "recent_activity": {
                "users_registered": recent_users,
                "jobs_posted": recent_jobs,
                "applications_submitted": recent_applications
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"System status error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to get system status"
        }), 500


# ==================== JWT ERROR HANDLERS ====================

@jwt.unauthorized_loader
def unauthorized_callback(_):
    return jsonify({"error": "Missing or invalid token"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(_):
    return jsonify({"error": "Invalid token"}), 401

@jwt.expired_token_loader
def expired_token_callback(_, __):
    return jsonify({"error": "Token expired"}), 401

@jwt.revoked_token_loader
def revoked_token_callback(_, __):
    return jsonify({"error": "Token revoked"}), 401