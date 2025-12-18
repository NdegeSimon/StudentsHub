from flask import request
from models.models import db, Application, Job, Student, User, ApplicationStatus
from .base_controller import BaseController
from datetime import datetime

class ApplicationController(BaseController):
    """Controller for application related operations"""
    
    @classmethod
    def apply_for_job(cls, job_id):
        """Apply for a job"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role != 'student':
            return cls.error_response('Student access required', 403)
            
        data = request.get_json()
        
        # Check if job exists and is active
        job = Job.query.filter_by(id=job_id, is_active=True).first()
        if not job:
            return cls.error_response('Job not found or inactive', 404)
            
        # Check if student has already applied
        student = Student.query.filter_by(user_id=current_user.id).first()
        if not student:
            return cls.error_response('Student profile not found', 404)
            
        existing_application = Application.query.filter_by(
            student_id=student.id,
            job_id=job_id
        ).first()
        
        if existing_application:
            return cls.error_response('You have already applied for this job', 400)
        
        # Create new application
        application = Application(
            student_id=student.id,
            job_id=job_id,
            cover_letter=data.get('cover_letter', ''),
            status=ApplicationStatus.PENDING
        )
        
        try:
            db.session.add(application)
            db.session.commit()
            
            return cls.success_response(
                data=application.to_dict(),
                message='Application submitted successfully',
                status_code=201
            )
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
    
    @classmethod
    def get_my_applications(cls):
        """Get current user's applications"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
            
        if current_user.role == 'student':
            student = Student.query.filter_by(user_id=current_user.id).first()
            if not student:
                return cls.error_response('Student profile not found', 404)
                
            applications = Application.query.filter_by(student_id=student.id).all()
            
        elif current_user.role == 'company':
            company = Company.query.filter_by(user_id=current_user.id).first()
            if not company:
                return cls.error_response('Company profile not found', 404)
                
            applications = Application.query.join(Job).filter(
                Job.company_id == company.id
            ).all()
            
        else:
            return cls.error_response('Unauthorized', 403)
        
        return cls.success_response(
            data={'applications': [app.to_dict() for app in applications]},
            message='Applications retrieved successfully'
        )
    
    @classmethod
    def get_application(cls, application_id):
        """Get application by ID"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
            
        application = Application.query.get(application_id)
        if not application:
            return cls.error_response('Application not found', 404)
            
        # Check permissions
        if current_user.role == 'student':
            student = Student.query.filter_by(user_id=current_user.id).first()
            if not student or student.id != application.student_id:
                return cls.error_response('Unauthorized', 403)
                
        elif current_user.role == 'company':
            company = Company.query.filter_by(user_id=current_user.id).first()
            if not company or application.job.company_id != company.id:
                return cls.error_response('Unauthorized', 403)
                
        return cls.success_response(
            data=application.to_dict(),
            message='Application retrieved successfully'
        )
    
    @classmethod
    def update_application_status(cls, application_id):
        """Update application status (company only)"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role != 'company':
            return cls.error_response('Company access required', 403)
            
        data = request.get_json()
        status = data.get('status')
        notes = data.get('notes', '')
        
        if not status or status not in [s.value for s in ApplicationStatus]:
            return cls.error_response('Invalid status', 400)
            
        application = Application.query.get(application_id)
        if not application:
            return cls.error_response('Application not found', 404)
            
        # Check if the job belongs to the company
        company = Company.query.filter_by(user_id=current_user.id).first()
        if not company or application.job.company_id != company.id:
            return cls.error_response('Unauthorized', 403)
            
        try:
            application.status = ApplicationStatus(status)
            application.notes = notes
            application.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return cls.success_response(
                data=application.to_dict(),
                message='Application status updated successfully'
            )
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
