# routes/job_routes.py
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_, desc
from datetime import datetime
from models.models import (
    db, Job, Company, User, Student, 
    SavedJob, Application, SavedCandidate
)

job_bp = Blueprint('job', __name__)

# ==================== PUBLIC JOB ROUTES ====================

@job_bp.route('', methods=['GET'])
def get_jobs():
    """
    Get all active jobs with optional filters
    Query parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 10, max: 50)
    - search: Search in title/description
    - type: Job type filter (full-time, part-time, etc.)
    - location: Location filter
    - experience: Experience level filter
    - company_id: Filter by company
    """
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = min(request.args.get('limit', 10, type=int), 50)
        search = request.args.get('search', '').strip()
        job_type = request.args.get('type')
        location = request.args.get('location')
        experience = request.args.get('experience')
        company_id = request.args.get('company_id', type=int)
        remote = request.args.get('remote', type=str)

        # Start query
        query = Job.query.filter_by(is_active=True)

        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Job.title.ilike(search_term),
                    Job.description.ilike(search_term),
                    Job.requirements.ilike(search_term)
                )
            )

        # Apply other filters
        if job_type and job_type.lower() != 'all':
            query = query.filter(Job.job_type == job_type)
        
        if location and location.lower() != 'all':
            query = query.filter(Job.location.ilike(f"%{location}%"))
        
        if experience and experience.lower() != 'all':
            query = query.filter(Job.experience_level == experience)
        
        if company_id:
            query = query.filter(Job.company_id == company_id)
        
        if remote and remote.lower() in ['true', 'yes', '1']:
            query = query.filter(
                or_(
                    Job.work_mode == 'remote',
                    Job.work_mode == 'hybrid',
                    Job.location.ilike('%remote%')
                )
            )

        # Order by creation date (newest first)
        query = query.order_by(desc(Job.created_at))

        # Paginate
        pagination = query.paginate(page=page, per_page=limit, error_out=False)

        # Get saved job IDs for current user if authenticated
        saved_job_ids = set()
        try:
            current_user_id = get_jwt_identity()
            if current_user_id:
                saved_jobs = SavedJob.query.filter_by(user_id=current_user_id).all()
                saved_job_ids = {sj.job_id for sj in saved_jobs}
        except:
            pass  # User not authenticated or token invalid

        # Build response
        jobs_list = []
        for job in pagination.items:
            company_name = 'Unknown'
            if job.company:
                company_name = job.company.company_name
            
            job_data = {
                'id': job.id,
                'title': job.title,
                'company_name': company_name,
                'company_id': job.company_id,
                'location': job.location,
                'job_type': job.job_type,
                'work_mode': getattr(job, 'work_mode', 'onsite'),
                'experience_level': getattr(job, 'experience_level', 'entry'),
                'salary_min': getattr(job, 'salary_min'),
                'salary_max': getattr(job, 'salary_max'),
                'salary_currency': getattr(job, 'salary_currency', 'USD'),
                'description': job.description[:200] + '...' if job.description and len(job.description) > 200 else job.description,
                'created_at': job.created_at.isoformat() if job.created_at else None,
                'application_deadline': job.application_deadline.isoformat() if job.application_deadline else None,
                'is_saved': job.id in saved_job_ids,
                'applications_count': job.applications.count() if hasattr(job, 'applications') else 0
            }
            jobs_list.append(job_data)

        return jsonify({
            'success': True,
            'jobs': jobs_list,
            'pagination': {
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': pagination.page,
                'per_page': pagination.per_page,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting jobs: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch jobs',
            'message': str(e)
        }), 500


@job_bp.route('/<int:job_id>', methods=['GET'])
def get_job_detail(job_id):
    """
    Get detailed information about a specific job
    """
    try:
        job = Job.query.get_or_404(job_id)
        
        if not job.is_active:
            return jsonify({
                'success': False,
                'error': 'Job not found or inactive'
            }), 404

        # Get saved status for current user
        is_saved = False
        try:
            current_user_id = get_jwt_identity()
            if current_user_id:
                is_saved = SavedJob.query.filter_by(
                    user_id=current_user_id, 
                    job_id=job_id
                ).first() is not None
        except:
            pass

        # Get company info
        company_data = None
        if job.company:
            company_data = {
                'id': job.company.id,
                'name': job.company.company_name,
                'description': job.company.description,
                'website': job.company.website,
                'logo_url': job.company.logo_url,
                'location': job.company.location,
                'industry': job.company.industry
            }

        # Get similar jobs
        similar_jobs = Job.query.filter(
            Job.id != job_id,
            Job.is_active == True,
            Job.job_type == job.job_type
        ).order_by(desc(Job.created_at)).limit(4).all()

        similar_jobs_list = []
        for similar_job in similar_jobs:
            similar_jobs_list.append({
                'id': similar_job.id,
                'title': similar_job.title,
                'company_name': similar_job.company.company_name if similar_job.company else 'Unknown',
                'location': similar_job.location,
                'job_type': similar_job.job_type,
                'salary_min': getattr(similar_job, 'salary_min'),
                'salary_max': getattr(similar_job, 'salary_max')
            })

        # Build response
        job_data = {
            'id': job.id,
            'title': job.title,
            'description': job.description,
            'requirements': job.requirements,
            'responsibilities': getattr(job, 'responsibilities', ''),
            'benefits': getattr(job, 'benefits', ''),
            'location': job.location,
            'job_type': job.job_type,
            'work_mode': getattr(job, 'work_mode', 'onsite'),
            'experience_level': getattr(job, 'experience_level', 'entry'),
            'salary_min': getattr(job, 'salary_min'),
            'salary_max': getattr(job, 'salary_max'),
            'salary_currency': getattr(job, 'salary_currency', 'USD'),
            'application_deadline': job.application_deadline.isoformat() if job.application_deadline else None,
            'positions_available': getattr(job, 'positions_available', 1),
            'created_at': job.created_at.isoformat() if job.created_at else None,
            'updated_at': job.updated_at.isoformat() if job.updated_at else None,
            'is_saved': is_saved,
            'company': company_data,
            'similar_jobs': similar_jobs_list,
            'applications_count': job.applications.count() if hasattr(job, 'applications') else 0
        }

        return jsonify({
            'success': True,
            'job': job_data
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting job {job_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch job details'
        }), 500


# ==================== AUTHENTICATED JOB ROUTES ====================

@job_bp.route('', methods=['POST'])
@jwt_required()
def create_job():
    """
    Create a new job posting (employers only)
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'employer':
            return jsonify({
                'success': False,
                'error': 'Only employers can post jobs'
            }), 403

        company = Company.query.filter_by(user_id=current_user_id).first()
        if not company:
            return jsonify({
                'success': False,
                'error': 'Company profile not found'
            }), 404

        data = request.get_json()
        
        # Required fields validation
        required_fields = ['title', 'description', 'location', 'job_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'{field.replace("_", " ").title()} is required'
                }), 400

        # Create job
        job = Job(
            title=data['title'],
            description=data['description'],
            requirements=data.get('requirements', ''),
            location=data['location'],
            job_type=data['job_type'],
            work_mode=data.get('work_mode', 'onsite'),
            experience_level=data.get('experience_level', 'entry'),
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            salary_currency=data.get('salary_currency', 'USD'),
            application_deadline=datetime.fromisoformat(data['application_deadline']) if data.get('application_deadline') else None,
            positions_available=data.get('positions_available', 1),
            company_id=company.id,
            employer_id=current_user_id,
            is_active=True
        )

        db.session.add(job)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Job created successfully',
            'job_id': job.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating job: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to create job',
            'message': str(e)
        }), 500


@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """
    Update a job posting (job owner only)
    """
    try:
        current_user_id = get_jwt_identity()
        job = Job.query.get_or_404(job_id)

        # Check permissions
        if job.employer_id != current_user_id:
            user = User.query.get(current_user_id)
            if not user or user.role != 'admin':
                return jsonify({
                    'success': False,
                    'error': 'Not authorized to update this job'
                }), 403

        data = request.get_json()
        
        # Update allowed fields
        updatable_fields = [
            'title', 'description', 'requirements', 'location',
            'job_type', 'work_mode', 'experience_level', 'salary_min',
            'salary_max', 'salary_currency', 'application_deadline',
            'positions_available', 'is_active'
        ]

        updates_made = False
        for field in updatable_fields:
            if field in data:
                if field == 'application_deadline' and data[field]:
                    setattr(job, field, datetime.fromisoformat(data[field]))
                else:
                    setattr(job, field, data[field])
                updates_made = True

        if updates_made:
            job.updated_at = datetime.utcnow()
            db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Job updated successfully',
            'job_id': job.id
        }), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating job {job_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to update job'
        }), 500


@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """
    Delete a job posting (soft delete - sets is_active to False)
    """
    try:
        current_user_id = get_jwt_identity()
        job = Job.query.get_or_404(job_id)

        # Check permissions
        if job.employer_id != current_user_id:
            user = User.query.get(current_user_id)
            if not user or user.role != 'admin':
                return jsonify({
                    'success': False,
                    'error': 'Not authorized to delete this job'
                }), 403

        # Soft delete
        job.is_active = False
        job.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Job deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting job {job_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to delete job'
        }), 500


# ==================== SAVED JOBS ROUTES ====================

@job_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    """
    Get all jobs saved by the current user
    """
    try:
        current_user_id = get_jwt_identity()
        
        page = request.args.get('page', 1, type=int)
        limit = min(request.args.get('limit', 10, type=int), 50)

        # Get saved jobs with pagination
        saved_query = SavedJob.query.filter_by(user_id=current_user_id)
        pagination = saved_query.order_by(
            desc(SavedJob.saved_at)
        ).paginate(page=page, per_page=limit, error_out=False)

        # Get job details for each saved job
        saved_jobs_list = []
        for saved_job in pagination.items:
            job = Job.query.get(saved_job.job_id)
            if job and job.is_active:
                company_name = job.company.company_name if job.company else 'Unknown'
                
                saved_jobs_list.append({
                    'id': job.id,
                    'title': job.title,
                    'company_name': company_name,
                    'location': job.location,
                    'job_type': job.job_type,
                    'salary_min': getattr(job, 'salary_min'),
                    'salary_max': getattr(job, 'salary_max'),
                    'saved_at': saved_job.saved_at.isoformat() if saved_job.saved_at else None,
                    'application_deadline': job.application_deadline.isoformat() if job.application_deadline else None
                })

        return jsonify({
            'success': True,
            'saved_jobs': saved_jobs_list,
            'pagination': {
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': pagination.page,
                'per_page': pagination.per_page
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting saved jobs: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch saved jobs'
        }), 500


@job_bp.route('/<int:job_id>/save', methods=['POST'])
@jwt_required()
def save_job(job_id):
    """
    Save a job for the current user
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Check if job exists and is active
        job = Job.query.get(job_id)
        if not job or not job.is_active:
            return jsonify({
                'success': False,
                'error': 'Job not found'
            }), 404

        # Check if already saved
        existing = SavedJob.query.filter_by(
            user_id=current_user_id,
            job_id=job_id
        ).first()

        if existing:
            return jsonify({
                'success': True,
                'message': 'Job already saved',
                'saved': True
            }), 200

        # Save the job
        saved_job = SavedJob(
            user_id=current_user_id,
            job_id=job_id,
            saved_at=datetime.utcnow()
        )

        db.session.add(saved_job)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Job saved successfully',
            'saved': True,
            'job_id': job_id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error saving job {job_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to save job'
        }), 500


@job_bp.route('/<int:job_id>/save', methods=['DELETE'])
@jwt_required()
def unsave_job(job_id):
    """
    Unsave a job for the current user
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Find saved job
        saved_job = SavedJob.query.filter_by(
            user_id=current_user_id,
            job_id=job_id
        ).first()

        if not saved_job:
            return jsonify({
                'success': True,
                'message': 'Job not in saved list',
                'saved': False
            }), 200

        # Remove from saved
        db.session.delete(saved_job)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Job unsaved successfully',
            'saved': False,
            'job_id': job_id
        }), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error unsaving job {job_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to unsave job'
        }), 500


# ==================== EMPLOYER JOB MANAGEMENT ====================

@job_bp.route('/employer/my-jobs', methods=['GET'])
@jwt_required()
def get_employer_jobs():
    """
    Get all jobs posted by the current employer
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'employer':
            return jsonify({
                'success': False,
                'error': 'Only employers can access this endpoint'
            }), 403

        page = request.args.get('page', 1, type=int)
        limit = min(request.args.get('limit', 10, type=int), 50)
        status = request.args.get('status', 'all')  # all, active, inactive

        # Build query
        query = Job.query.filter_by(employer_id=current_user_id)
        
        if status == 'active':
            query = query.filter_by(is_active=True)
        elif status == 'inactive':
            query = query.filter_by(is_active=False)

        # Paginate
        pagination = query.order_by(desc(Job.created_at)).paginate(
            page=page, per_page=limit, error_out=False
        )

        # Build response
        jobs_list = []
        for job in pagination.items:
            company_name = job.company.company_name if job.company else 'Unknown'
            applications_count = job.applications.count() if hasattr(job, 'applications') else 0
            
            jobs_list.append({
                'id': job.id,
                'title': job.title,
                'company_name': company_name,
                'location': job.location,
                'job_type': job.job_type,
                'is_active': job.is_active,
                'created_at': job.created_at.isoformat() if job.created_at else None,
                'applications_count': applications_count,
                'views_count': getattr(job, 'views_count', 0)
            })

        return jsonify({
            'success': True,
            'jobs': jobs_list,
            'pagination': {
                'total': pagination.total,
                'pages': pagination.pages,
                'current_page': pagination.page,
                'per_page': pagination.per_page
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting employer jobs: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch employer jobs'
        }), 500


# ==================== APPLICATION ROUTES ====================

@job_bp.route('/<int:job_id>/apply', methods=['POST'])
@jwt_required()
def apply_to_job(job_id):
    """
    Apply to a job (students only)
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'student':
            return jsonify({
                'success': False,
                'error': 'Only students can apply to jobs'
            }), 403

        # Check if job exists and is active
        job = Job.query.get(job_id)
        if not job or not job.is_active:
            return jsonify({
                'success': False,
                'error': 'Job not found or inactive'
            }), 404

        # Check if application deadline has passed
        if job.application_deadline and job.application_deadline < datetime.utcnow():
            return jsonify({
                'success': False,
                'error': 'Application deadline has passed'
            }), 400

        # Get student profile
        student = Student.query.filter_by(user_id=current_user_id).first()
        if not student:
            return jsonify({
                'success': False,
                'error': 'Student profile not found'
            }), 404

        # Check if already applied
        existing_application = Application.query.filter_by(
            student_id=student.id,
            job_id=job_id
        ).first()

        if existing_application:
            return jsonify({
                'success': False,
                'error': 'You have already applied to this job'
            }), 400

        data = request.get_json()
        cover_letter = data.get('cover_letter', '')
        resume_url = data.get('resume_url', student.resume_url)

        # Create application
        application = Application(
            job_id=job_id,
            student_id=student.id,
            cover_letter=cover_letter,
            resume_url=resume_url,
            status='pending',
            applied_at=datetime.utcnow()
        )

        db.session.add(application)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Application submitted successfully',
            'application_id': application.id
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error applying to job {job_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to submit application'
        }), 500


# ==================== UTILITY ROUTES ====================

@job_bp.route('/types', methods=['GET'])
def get_job_types():
    """
    Get all unique job types
    """
    try:
        job_types = db.session.query(Job.job_type).filter(
            Job.is_active == True,
            Job.job_type.isnot(None),
            Job.job_type != ''
        ).distinct().all()
        
        types_list = [job_type[0] for job_type in job_types if job_type[0]]
        
        return jsonify({
            'success': True,
            'job_types': sorted(types_list)
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting job types: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch job types'
        }), 500


@job_bp.route('/locations', methods=['GET'])
def get_job_locations():
    """
    Get all unique job locations
    """
    try:
        locations = db.session.query(Job.location).filter(
            Job.is_active == True,
            Job.location.isnot(None),
            Job.location != ''
        ).distinct().all()
        
        locations_list = [location[0] for location in locations if location[0]]
        
        return jsonify({
            'success': True,
            'locations': sorted(locations_list)
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting job locations: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch job locations'
        }), 500


@job_bp.route('/stats', methods=['GET'])
def get_job_stats():
    """
    Get job statistics
    """
    try:
        total_jobs = Job.query.filter_by(is_active=True).count()
        total_companies = Company.query.filter_by(verification_status='verified').count()
        
        # Get job counts by type
        job_types = db.session.query(
            Job.job_type, 
            db.func.count(Job.id).label('count')
        ).filter(
            Job.is_active == True,
            Job.job_type.isnot(None)
        ).group_by(Job.job_type).all()
        
        type_stats = {job_type: count for job_type, count in job_types}
        
        return jsonify({
            'success': True,
            'stats': {
                'total_jobs': total_jobs,
                'total_companies': total_companies,
                'jobs_by_type': type_stats
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting job stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch job statistics'
        }), 500