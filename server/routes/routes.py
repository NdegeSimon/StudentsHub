from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity,
    create_refresh_token, get_jwt, JWTManager
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import re

from models import db, User, Student, Company, Job, Application

# Create JWT manager instance
jwt = JWTManager()

bp = Blueprint('auth', __name__)

# Helper function to validate email
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Auth Routes
@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ['email', 'password', 'first_name', 'last_name', 'role']):
        return jsonify({"error": "Missing required fields"}), 400
    
    if not is_valid_email(data['email']):
        return jsonify({"error": "Invalid email format"}), 400
    
    if len(data['password']) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    if data['role'] not in ['student', 'company']:
        return jsonify({"error": "Invalid role"}), 400
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    try:
        # Create user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.flush()  # Get the user ID
        
        # Create profile based on role
        if data['role'] == 'student':
            student = Student(user_id=user.id)
            db.session.add(student)
        elif data['role'] == 'company':
            if 'company_name' not in data:
                return jsonify({"error": "Company name is required"}), 400
            company = Company(user_id=user.id, company_name=data['company_name'])
            db.session.add(company)
        
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    if not user.is_active:
        return jsonify({"error": "Account is deactivated"}), 403
    
    # Create tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }), 200

@bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_token}), 200

@bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

# Profile Routes
@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    profile_data = user.to_dict()
    
    # Add role-specific profile data
    if user.role == 'student' and user.student_profile:
        student = user.student_profile
        profile_data.update({
            'phone': student.phone,
            'address': student.address,
            'education': student.education,
            'skills': student.skills,
            'resume_url': student.resume_url,
            'profile_picture': student.profile_picture
        })
    elif user.role == 'company' and user.company_profile:
        company = user.company_profile
        profile_data.update({
            'company_name': company.company_name,
            'description': company.description,
            'website': company.website,
            'phone': company.phone,
            'address': company.address,
            'logo_url': company.logo_url
        })
    
    return jsonify(profile_data), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    
    try:
        # Update user fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        
        # Update password if provided
        if 'current_password' in data and 'new_password' in data:
            if not user.check_password(data['current_password']):
                return jsonify({"error": "Current password is incorrect"}), 400
            user.set_password(data['new_password'])
        
        # Update role-specific profile
        if user.role == 'student' and user.student_profile:
            student = user.student_profile
            student.phone = data.get('phone', student.phone)
            student.address = data.get('address', student.address)
            student.education = data.get('education', student.education)
            student.skills = data.get('skills', student.skills)
            student.resume_url = data.get('resume_url', student.resume_url)
            student.profile_picture = data.get('profile_picture', student.profile_picture)
        
        elif user.role == 'company' and user.company_profile:
            company = user.company_profile
            company.company_name = data.get('company_name', company.company_name)
            company.description = data.get('description', company.description)
            company.website = data.get('website', company.website)
            company.phone = data.get('phone', company.phone)
            company.address = data.get('address', company.address)
            company.logo_url = data.get('logo_url', company.logo_url)
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({"message": "Profile updated successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update profile", "details": str(e)}), 500

# Job Routes
@bp.route('/jobs', methods=['GET'])
def get_jobs():
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)
        search = request.args.get('search', '')
        job_type = request.args.get('type')
        location = request.args.get('location')
        
        # Build query
        query = Job.query.filter_by(is_active=True)
        
        if search:
            search = f"%{search}%"
            query = query.filter(
                (Job.title.ilike(search)) | 
                (Job.description.ilike(search)) |
                (Job.requirements.ilike(search))
            )
            
        if job_type:
            query = query.filter(Job.job_type == job_type)
            
        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))
        
        # Execute query with pagination
        jobs = query.order_by(Job.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False)
        
        # Prepare response
        jobs_list = []
        for job in jobs.items:
            job_data = {
                'id': job.id,
                'title': job.title,
                'company_name': job.company.company_name if job.company else 'Unknown',
                'location': job.location,
                'job_type': job.job_type,
                'salary': job.salary,
                'created_at': job.created_at.isoformat()
            }
            jobs_list.append(job_data)
        
        return jsonify({
            'jobs': jobs_list,
            'total': jobs.total,
            'pages': jobs.pages,
            'current_page': jobs.page
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch jobs", "details": str(e)}), 500

@bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = Job.query.get_or_404(job_id)
        
        if not job.is_active:
            return jsonify({"error": "Job not found"}), 404
        
        job_data = {
            'id': job.id,
            'title': job.title,
            'description': job.description,
            'requirements': job.requirements,
            'location': job.location,
            'job_type': job.job_type,
            'salary': job.salary,
            'company': {
                'id': job.company.id,
                'name': job.company.company_name,
                'description': job.company.description,
                'website': job.company.website,
                'logo_url': job.company.logo_url
            },
            'created_at': job.created_at.isoformat(),
            'updated_at': job.updated_at.isoformat()
        }
        
        return jsonify(job_data), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch job details", "details": str(e)}), 500

# Application Routes
@bp.route('/applications', methods=['POST'])
@jwt_required()
def create_application():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'student':
        return jsonify({"error": "Only students can apply for jobs"}), 403
    
    data = request.get_json()
    
    if 'job_id' not in data:
        return jsonify({"error": "Job ID is required"}), 400
    
    try:
        job = Job.query.get(data['job_id'])
        if not job or not job.is_active:
            return jsonify({"error": "Job not found or inactive"}), 404
        
        # Check if already applied
        existing_application = Application.query.filter_by(
            job_id=job.id, student_id=user.student_profile.id).first()
        if existing_application:
            return jsonify({"error": "You have already applied to this job"}), 400
        
        # Create application
        application = Application(
            job_id=job.id,
            student_id=user.student_profile.id,
            cover_letter=data.get('cover_letter', '')
        )
        
        db.session.add(application)
        db.session.commit()
        
        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to submit application", "details": str(e)}), 500

@bp.route('/applications/me', methods=['GET'])
@jwt_required()
def get_my_applications():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'student':
        return jsonify({"error": "Only students can view applications"}), 403
    
    try:
        applications = Application.query.filter_by(
            student_id=user.student_profile.id).order_by(Application.created_at.desc()).all()
        
        applications_list = []
        for app in applications:
            applications_list.append({
                'id': app.id,
                'job_id': app.job_id,
                'job_title': app.job.title,
                'company_name': app.job.company.company_name if app.job.company else 'Unknown',
                'status': app.status,
                'applied_date': app.created_at.isoformat()
            })
        
        return jsonify(applications_list), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch applications", "details": str(e)}), 500

# File Upload Route (example - needs proper file handling)
@bp.route('/upload/<file_type>', methods=['POST'])
@jwt_required()
def upload_file(file_type):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # In a real app, you would save the file to a storage service (e.g., AWS S3)
    # and return the URL. This is just a basic example.
    
    # Example: Save to local filesystem (not recommended for production)
    import os
    from werkzeug.utils import secure_filename
    
    upload_folder = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    filename = secure_filename(f"{file_type}_{datetime.utcnow().timestamp()}_{file.filename}")
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    
    # In a real app, you would return the public URL of the file
    file_url = f"/uploads/{filename}"
    
    return jsonify({
        "message": "File uploaded successfully",
        "url": file_url,
        "filename": filename
    }), 200

# JWT Error Handlers
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({"error": "Missing or invalid token"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": "Invalid token"}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has been revoked"}), 401
