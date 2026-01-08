# routes/routes.py

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re
import os
from werkzeug.utils import secure_filename

# Import models and extensions
from models import User
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
    from models import db, User, Student, Company
    from sqlalchemy.exc import SQLAlchemyError

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

        # Create user WITHOUT explicit transaction management
        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            first_name=first_name,
            last_name=last_name,
            role=role
        )
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

        # Generate tokens
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
        current_app.logger.error(f"Database error during registration: {str(e)}")
        return jsonify({"error": "Database error during registration"}), 500
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Unexpected error in registration: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

        
@bp.route('/auth/login', methods=['POST'])
def login():
    from models import User

    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password required"}), 400

        email = data['email'].strip().lower()
        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({"error": "Invalid email or password"}), 401

        if getattr(user, 'is_active', True) is False:
            return jsonify({"error": "Account deactivated"}), 403

        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        refresh_token = create_refresh_token(identity={"id": user.id, "role": user.role})

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict() if hasattr(user, 'to_dict') else {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500


@bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_identity = get_jwt_identity()
    new_token = create_access_token(identity=current_user_identity)
    return jsonify({"access_token": new_token}), 200


@bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    from models import User
    
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify(user.to_dict() if hasattr(user, 'to_dict') else {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Get me error: {str(e)}")
        return jsonify({"error": "Failed to fetch user"}), 500


# ==================== PROFILE ROUTES ====================

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's profile"""
    from models import User
    
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        profile = user.to_dict() if hasattr(user, 'to_dict') else {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role
        }

        if user.role == 'student' and hasattr(user, 'student_profile') and user.student_profile:
            s = user.student_profile
            profile.update({
                "phone": s.phone,
                "address": s.address,
                "education": s.education,
                "skills": s.skills,
                "resume_url": s.resume_url,
                "profile_picture": s.profile_picture
            })
        elif user.role == 'employer' and hasattr(user, 'company_profile') and user.company_profile:
            c = user.company_profile
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
    return get_profile()


@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    from models import db, User
    
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
        if user.role == 'student' and hasattr(user, 'student_profile') and user.student_profile:
            s = user.student_profile
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
        elif user.role == 'employer' and hasattr(user, 'company_profile') and user.company_profile:
            c = user.company_profile
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
    from models import Job
    
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
    from models import Job
    
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
    from models import db, User, Job, Application

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

        if Application.query.filter_by(job_id=job.id, student_id=user.student_profile.id).first():
            return jsonify({"error": "Already applied"}), 400

        app = Application(
            job_id=job.id,
            student_id=user.student_profile.id,
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
    from models import User, Application

    try:
        user_identity = get_jwt_identity()
        user_id = user_identity.get('id') if isinstance(user_identity, dict) else user_identity
        
        user = User.query.get(user_id)
        if not user or user.role != 'student':
            return jsonify({"error": "Only students can view applications"}), 403

        apps = Application.query.filter_by(student_id=user.student_profile.id)\
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

# Note: Saved jobs routes have been moved to saved_jobs_routes.py
# Import and register the saved_jobs_bp in app.py

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


