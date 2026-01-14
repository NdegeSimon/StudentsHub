from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from models.models import Application, Job, Student, db
from extensions import db
from utils.email_service import send_email_notification

application_bp = Blueprint('application', __name__)

@application_bp.route('/', methods=['GET'])
@jwt_required()
def get_applications():
    """
    Get all applications for the current user
    Query params:
    - status: Filter by status (pending, reviewing, shortlisted, rejected, hired)
    - limit: Number of results per page
    - page: Page number
    """
    try:
        current_user_id = get_jwt_identity()
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('limit', 10))
        
        # Base query
        query = Application.query.filter_by(student_id=current_user_id)
        
        # Apply status filter if provided
        if status:
            query = query.filter(Application.status == status)
            
        # Pagination
        paginated_applications = query.order_by(
            Application.updated_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        # Prepare response
        response = {
            'applications': [app.to_dict() for app in paginated_applications.items],
            'total': paginated_applications.total,
            'pages': paginated_applications.pages,
            'current_page': page
        }
        
        return jsonify(response), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching applications: {str(e)}")
        return jsonify({"error": "Failed to fetch applications"}), 500

@application_bp.route('/<application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    """
    Get a specific application by ID with detailed information
    """
    try:
        current_user_id = get_jwt_identity()
        application = Application.query.get_or_404(application_id)
        
        # Authorization check
        if str(application.student_id) != str(current_user_id):
            return jsonify({"error": "Unauthorized access to application"}), 403
            
        # Get detailed job and company info
        application_data = application.to_dict()
        job = Job.query.get(application.job_id)
        if job:
            application_data['job'] = job.to_dict()
            
        return jsonify(application_data), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching application {application_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch application"}), 500

@application_bp.route('/', methods=['POST'])
@jwt_required()
def create_application():
    """
    Submit a new job application
    Required fields: job_id, cover_letter
    Optional fields: resume_url, portfolio_url
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['job_id', 'cover_letter']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"{field.replace('_', ' ').title()} is required"}), 400
        
        # Check if job exists and is active
        job = Job.query.filter_by(id=data['job_id'], is_active=True).first()
        if not job:
            return jsonify({"error": "Job not found or not available"}), 404
            
        # Check if application deadline has passed
        if job.application_deadline and job.application_deadline < datetime.utcnow():
            return jsonify({"error": "Application deadline has passed"}), 400
            
        # Check for existing application
        existing_application = Application.query.filter_by(
            student_id=current_user_id,
            job_id=data['job_id']
        ).first()
        
        if existing_application:
            return jsonify({
                "error": "You have already applied to this job",
                "application_id": existing_application.id
            }), 409
            
        # Get student profile for resume if not provided
        student = Student.query.filter_by(user_id=current_user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404
            
        # Create application
        application = Application(
            job_id=data['job_id'],
            student_id=student.id,
            cover_letter=data['cover_letter'],
            resume_url=data.get('resume_url') or student.resume_url,
            portfolio_url=data.get('portfolio_url') or student.portfolio_url,
            status='pending'
        )
        
        db.session.add(application)
        
        # Update job application count
        job.application_count = (job.application_count or 0) + 1
        
        db.session.commit()
        
        # Send notification to employer
        try:
            send_email_notification(
                to=job.posted_by.email if hasattr(job, 'posted_by') else None,
                subject=f"New Application for {job.title}",
                template='new_application.html',
                student=student,
                job=job,
                application=application
            )
        except Exception as e:
            current_app.logger.error(f"Failed to send notification: {str(e)}")
        
        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application.id
        }), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating application: {str(e)}")
        return jsonify({"error": "Failed to submit application"}), 500

@application_bp.route('/<application_id>', methods=['PUT'])
@jwt_required()
def update_application(application_id):
    """
    Update an application (for status changes, interview scheduling, etc.)
    Only certain fields can be updated based on user role
    """
    try:
        current_user_id = get_jwt_identity()
        application = Application.query.get_or_404(application_id)
        data = request.get_json()
        
        # Check if user is the applicant or has admin/employer access
        is_applicant = str(application.student_id) == str(current_user_id)
        # Add logic to check if user is employer/admin
        
        if not is_applicant:  # and not is_employer and not is_admin
            return jsonify({"error": "Unauthorized to update this application"}), 403
            
        # Only allow certain fields to be updated
        allowed_fields = ['status', 'cover_letter', 'resume_url', 'portfolio_url', 
                         'interview_scheduled', 'interview_date', 'interview_notes']
        
        updates = {}
        for key, value in data.items():
            if key in allowed_fields and hasattr(application, key):
                # Additional validation for status changes
                if key == 'status' and value not in ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']:
                    return jsonify({"error": "Invalid status value"}), 400
                updates[key] = value
        
        if not updates:
            return jsonify({"error": "No valid fields to update"}), 400
            
        # Update the application
        for key, value in updates.items():
            setattr(application, key, value)
            
        application.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            "message": "Application updated successfully",
            "application": application.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating application {application_id}: {str(e)}")
        return jsonify({"error": "Failed to update application"}), 500

@application_bp.route('/<application_id>', methods=['DELETE'])
@jwt_required()
def delete_application(application_id):
    """
    Withdraw an application
    Only the applicant can withdraw their own application
    """
    try:
        current_user_id = get_jwt_identity()
        application = Application.query.get_or_404(application_id)
        
        # Only allow the applicant to withdraw their own application
        if str(application.student_id) != str(current_user_id):
            return jsonify({"error": "You can only withdraw your own applications"}), 403
            
        # Don't allow withdrawal if already in final state
        if application.status in ['hired', 'rejected']:
            return jsonify({"error": f"Cannot withdraw application in {application.status} state"}), 400
            
        # Soft delete by changing status
        application.status = 'withdrawn'
        application.updated_at = datetime.utcnow()
        
        # Decrement application count on job
        job = Job.query.get(application.job_id)
        if job and job.application_count > 0:
            job.application_count -= 1
        
        db.session.commit()
        
        return jsonify({
            "message": "Application withdrawn successfully",
            "application_id": application_id
        }), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error withdrawing application {application_id}: {str(e)}")
        return jsonify({"error": "Failed to withdraw application"}), 500
