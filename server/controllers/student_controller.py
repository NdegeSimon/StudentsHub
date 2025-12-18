from flask import request
from models.models import db, Student, User, Application, EducationLevel
from .base_controller import BaseController

class StudentController(BaseController):
    """Controller for student related operations"""
    
    @classmethod
    def get_students(cls):
        """Get all students (admin and companies)"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role not in ['admin', 'company']:
            return cls.error_response('Unauthorized', 403)
            
        students = Student.query.all()
        return cls.success_response(
            data={'students': [{
                'id': s.id,
                'user_id': s.user_id,
                'name': f"{s.user.first_name} {s.user.last_name}",
                'email': s.user.email,
                'institution': s.institution,
                'field_of_study': s.field_of_study,
                'graduation_year': s.graduation_year,
                'skills': s.skills or []
            } for s in students]},
            message='Students retrieved successfully'
        )
    
    @classmethod
    def get_student_profile(cls, student_id=None):
        """Get a student's profile"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
            
        # If no student_id provided, get the current user's student profile
        if student_id is None:
            if current_user.role != 'student':
                return cls.error_response('Student access required', 403)
            student = Student.query.filter_by(user_id=current_user.id).first()
        else:
            # Check if the current user is an admin or the student themselves
            if current_user.role != 'admin' and str(current_user.id) != str(student_id):
                return cls.error_response('Unauthorized', 403)
            student = Student.query.get(student_id)
            
        if not student:
            return cls.error_response('Student profile not found', 404)
            
        return cls.success_response(
            data=student.to_dict(),
            message='Student profile retrieved successfully'
        )
    
    @classmethod
    def create_or_update_student_profile(cls):
        """Create or update a student profile"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role != 'student':
            return cls.error_response('Student access required', 403)
            
        data = request.get_json()
        
        # Get or create student profile
        student = Student.query.filter_by(user_id=current_user.id).first()
        is_new = student is None
        
        if is_new:
            # Create new student profile
            student = Student(user_id=current_user.id)
            db.session.add(student)
        
        # Update fields
        update_fields = [
            'date_of_birth', 'gender', 'address', 'city', 'country', 'bio',
            'education_level', 'institution', 'field_of_study', 'graduation_year',
            'skills', 'resume_url', 'linkedin_url', 'github_url', 'phone'
        ]
        
        for field in update_fields:
            if field in data:
                # Handle special cases
                if field == 'education_level' and data[field]:
                    setattr(student, field, EducationLevel(data[field]))
                else:
                    setattr(student, field, data[field])
        
        try:
            db.session.commit()
            return cls.success_response(
                data=student.to_dict(),
                message=f'Student profile {"created" if is_new else "updated"} successfully',
                status_code=201 if is_new else 200
            )
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(str(e), 500)
    
    @classmethod
    def get_student_applications(cls, student_id=None):
        """Get a student's job applications"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
            
        # If no student_id provided, use the current user's ID
        if student_id is None:
            if current_user.role != 'student':
                return cls.error_response('Student access required', 403)
            student = Student.query.filter_by(user_id=current_user.id).first()
        else:
            # Check if the current user is an admin or the student themselves
            if current_user.role != 'admin' and str(current_user.id) != str(student_id):
                return cls.error_response('Unauthorized', 403)
            student = Student.query.get(student_id)
            
        if not student:
            return cls.error_response('Student not found', 404)
            
        applications = Application.query.filter_by(student_id=student.id).all()
        
        return cls.success_response(
            data={'applications': [{
                'id': app.id,
                'job_id': app.job_id,
                'job_title': app.job.title,
                'company_name': app.job.company.company_name,
                'status': app.status.value,
                'applied_at': app.applied_at.isoformat(),
                'updated_at': app.updated_at.isoformat() if app.updated_at else None
            } for app in applications]},
            message='Applications retrieved successfully'
        )
    
    @classmethod
    def upload_resume(cls):
        """Handle resume upload for student"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role != 'student':
            return cls.error_response('Student access required', 403)
            
        if 'resume' not in request.files:
            return cls.error_response('No file part', 400)
            
        file = request.files['resume']
        if file.filename == '':
            return cls.error_response('No selected file', 400)
            
        # Here you would typically save the file to your storage solution
        # and return the URL. For example:
        try:
            # This is a placeholder - replace with your actual file handling logic
            # For example, using AWS S3, Google Cloud Storage, or local storage
            # file_url = save_file(file, 'resumes')
            
            # For now, we'll just return a dummy URL
            file_url = f'/uploads/resumes/{current_user.id}_{file.filename}'
            
            # Update student's resume URL
            student = Student.query.filter_by(user_id=current_user.id).first()
            if not student:
                return cls.error_response('Student profile not found', 404)
                
            student.resume_url = file_url
            db.session.commit()
            
            return cls.success_response(
                data={'resume_url': file_url},
                message='Resume uploaded successfully'
            )
            
        except Exception as e:
            db.session.rollback()
            return cls.error_response(f'Error uploading file: {str(e)}', 500)
