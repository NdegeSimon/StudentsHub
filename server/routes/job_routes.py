from flask import Blueprint, jsonify, request
from sqlalchemy import or_, and_
from models.models import Job, db, SavedJob, User
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

job_bp = Blueprint('job', __name__)

@job_bp.route('/', methods=['GET'])
def get_jobs():
    """
    Get all jobs with optional search and filters
    Query Parameters:
    - search: Search term (searches in title, company, and description)
    - job_type: Filter by job type (e.g., 'Full-time', 'Part-time')
    - location: Filter by location
    - experience: Filter by experience level
    - page: Page number for pagination (default: 1)
    - per_page: Items per page (default: 10)
    """
    try:
        # Get query parameters
        search = request.args.get('search', '')
        job_type = request.args.get('type')
        location = request.args.get('location')
        experience = request.args.get('experience')
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 10)), 50)  # Max 50 items per page

        # Start building the query
        query = Job.query

        # Apply search filter
        if search:
            search = f"%{search}%"
            query = query.filter(
                or_(
                    Job.title.ilike(search),
                    Job.company.ilike(search),
                    Job.description.ilike(search)
                )
            )

        # Apply filters
        if job_type and job_type.lower() != 'all':
            query = query.filter(Job.job_type == job_type)
        
        if location and location.lower() != 'all':
            query = query.filter(Job.location == location)
        
        if experience and experience.lower() != 'all':
            query = query.filter(Job.experience_level == experience)

        # Only show active jobs
        query = query.filter(Job.is_active == True)

        # Order by most recent first
        query = query.order_by(Job.posted_date.desc())

        # Paginate the results
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Get the current user's saved job IDs if authenticated
        current_user_id = get_jwt_identity()
        saved_job_ids = set()
        if current_user_id:
            saved_jobs = SavedJob.query.filter_by(user_id=current_user_id).all()
            saved_job_ids = {sj.job_id for sj in saved_jobs}

        # Prepare response
        jobs = []
        for job in pagination.items:
            job_data = job.to_dict()
            job_data['is_saved'] = job.id in saved_job_ids
            jobs.append(job_data)

        return jsonify({
            'jobs': jobs,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """
    Get a specific job by ID with additional details
    """
    try:
        job = Job.query.get_or_404(job_id)
        
        # Get current user ID if authenticated
        current_user_id = get_jwt_identity()
        
        # Check if job is saved by the user
        is_saved = False
        if current_user_id:
            is_saved = SavedJob.query.filter_by(
                user_id=current_user_id, 
                job_id=job_id
            ).first() is not None
        
        # Get similar jobs (for the "You may also like" section)
        similar_jobs = Job.query.filter(
            Job.id != job_id,
            Job.job_type == job.job_type,
            Job.is_active == True
        ).limit(3).all()
        
        # Prepare response
        job_data = job.to_dict()
        job_data['is_saved'] = is_saved
        job_data['similar_jobs'] = [{
            'id': j.id,
            'title': j.title,
            'company': j.company,
            'location': j.location,
            'job_type': j.job_type,
            'salary': j.salary,
            'posted_date': j.posted_date.isoformat() if j.posted_date else None
        } for j in similar_jobs]
        
        return jsonify(job_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@job_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    """
    Create a new job posting
    Required fields: title, company, description, location, job_type, salary
    Optional fields: experience_level, skills_required, application_deadline
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Required fields validation
        required_fields = ['title', 'company', 'description', 'location', 'job_type', 'salary']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"{field.replace('_', ' ').title()} is required"}), 400
        
        # Create job with posted_by set to current user
        job_data = {
            'title': data['title'],
            'company': data['company'],
            'description': data['description'],
            'location': data['location'],
            'job_type': data['job_type'],
            'salary': data['salary'],
            'posted_by': current_user_id,
            'is_active': True,
            'posted_date': datetime.utcnow()
        }
        
        # Optional fields
        optional_fields = [
            'experience_level', 'skills_required', 'application_deadline',
            'job_requirements', 'responsibilities', 'benefits'
        ]
        for field in optional_fields:
            if field in data:
                job_data[field] = data[field]
        
        job = Job(**job_data)
        db.session.add(job)
        db.session.commit()
        
        return jsonify(job.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@job_bp.route('/<int:job_id>/save', methods=['POST'])
@jwt_required()
def save_job(job_id):
    """
    Save a job for the current user
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists
        job = Job.query.get_or_404(job_id)
        
        # Check if job is already saved
        existing = SavedJob.query.filter_by(
            user_id=current_user_id,
            job_id=job_id
        ).first()
        
        if existing:
            return jsonify({"message": "Job already saved"}), 200
            
        # Save the job
        saved_job = SavedJob(
            user_id=current_user_id,
            job_id=job_id,
            saved_at=datetime.utcnow()
        )
        
        db.session.add(saved_job)
        db.session.commit()
        
        return jsonify({
            "message": "Job saved successfully",
            "saved": True,
            "job_id": job_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@job_bp.route('/<int:job_id>/unsave', methods=['DELETE'])
@jwt_required()
def unsave_job(job_id):
    """
    Unsave a job for the current user
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Find and delete the saved job
        saved_job = SavedJob.query.filter_by(
            user_id=current_user_id,
            job_id=job_id
        ).first()
        
        if not saved_job:
            return jsonify({"message": "Job not found in saved jobs"}), 404
            
        db.session.delete(saved_job)
        db.session.commit()
        
        return jsonify({
            "message": "Job unsaved successfully",
            "saved": False,
            "job_id": job_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@job_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    """
    Get all jobs saved by the current user
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 10)), 50)
        
        # Query saved jobs with pagination
        saved_jobs = SavedJob.query.filter_by(user_id=current_user_id)\
            .order_by(SavedJob.saved_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        # Get job details
        jobs = []
        for saved_job in saved_jobs.items:
            job = Job.query.get(saved_job.job_id)
            if job and job.is_active:
                job_data = job.to_dict()
                job_data['saved_at'] = saved_job.saved_at.isoformat()
                jobs.append(job_data)
        
        return jsonify({
            'jobs': jobs,
            'total': saved_jobs.total,
            'pages': saved_jobs.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """
    Update a job
    """
    try:
        job = Job.query.get_or_404(job_id)
        data = request.get_json()
        
        # Check if current user is the owner of the job or an admin
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if job.posted_by != current_user_id and not current_user.is_admin:
            return jsonify({"error": "Unauthorized"}), 403
            
        # Update job fields
        updatable_fields = [
            'title', 'company', 'description', 'location', 'job_type',
            'salary', 'experience_level', 'skills_required', 'application_deadline',
            'job_requirements', 'responsibilities', 'benefits', 'is_active'
        ]
        
        updates = {}
        for key, value in data.items():
            if key in updatable_fields and hasattr(job, key):
                updates[key] = value
        
        if not updates:
            return jsonify({"message": "No valid fields to update"}), 400
            
        # Update the job
        for key, value in updates.items():
            setattr(job, key, value)
            
        job.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(job.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """
    Delete a job (soft delete by setting is_active to False)
    Only the job poster or an admin can delete a job
    """
    try:
        job = Job.query.get_or_404(job_id)
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        # Check if current user is the owner of the job or an admin
        if job.posted_by != current_user_id and not (current_user and current_user.is_admin):
            return jsonify({"error": "Unauthorized"}), 403
            
        # Soft delete by setting is_active to False
        job.is_active = False
        job.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "message": "Job deleted successfully",
            "job_id": job_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
# routes/jobs.py or similar
@job_bp.route('/api/jobs/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'student':
        return jsonify({"error": "Only students can apply to jobs"}), 403
    
    student = Student.query.filter_by(user_id=user_id).first()
    job = Job.query.get(job_id)
    
    if not student:
        return jsonify({"error": "Student profile not found"}), 404
    
    if not job:
        return jsonify({"error": "Job not found"}), 404
    
    data = request.get_json()
    cover_letter = data.get('cover_letter', '')
    resume_url = data.get('resume_url')
    
    application, message = job.apply(student, cover_letter, resume_url)
    
    if application:
        return jsonify({
            "success": True,
            "message": message,
            "application_id": application.id
        }), 201
    else:
        return jsonify({"error": message}), 400

@job_bp.route('/api/jobs/<int:job_id>/save', methods=['POST'])
@jwt_required()
def save_job(job_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'student':
        return jsonify({"error": "Only students can save jobs"}), 403
    
    student = Student.query.filter_by(user_id=user_id).first()
    job = Job.query.get(job_id)
    
    if not student:
        return jsonify({"error": "Student profile not found"}), 404
    
    if not job:
        return jsonify({"error": "Job not found"}), 404
    
    success, message = student.save_job(job)
    
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"error": message}), 400

@job_bp.route('/api/students/<int:student_id>/save', methods=['POST'])
@jwt_required()
def save_candidate(student_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'company':
        return jsonify({"error": "Only companies can save candidates"}), 403
    
    company = Company.query.filter_by(user_id=user_id).first()
    student = Student.query.get(student_id)
    
    if not company:
        return jsonify({"error": "Company profile not found"}), 404
    
    if not student:
        return jsonify({"error": "Student not found"}), 404
    
    success, message = company.save_candidate(student)
    
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"error": message}), 400