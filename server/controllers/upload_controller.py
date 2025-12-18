import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app, request
from .base_controller import BaseController
from models.models import db, Student, Company, User

class UploadController(BaseController):
    """Controller for handling file uploads"""
    
    ALLOWED_EXTENSIONS = {
        'image': {'jpg', 'jpeg', 'png', 'gif'},
        'document': {'pdf', 'doc', 'docx'},
        'resume': {'pdf', 'doc', 'docx'}
    }
    
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    @classmethod
    def allowed_file(cls, filename, file_type='image'):
        """Check if the file type is allowed"""
        if '.' not in filename:
            return False
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in cls.ALLOWED_EXTENSIONS.get(file_type, set())
    
    @classmethod
    def upload_file(cls, file_type='image'):
        """Handle file upload"""
        current_user = cls.get_current_user()
        if not current_user:
            return cls.error_response('Authentication required', 401)
        
        if 'file' not in request.files:
            return cls.error_response('No file part', 400)
            
        file = request.files['file']
        
        if file.filename == '':
            return cls.error_response('No selected file', 400)
            
        if not file or not cls.allowed_file(file.filename, file_type):
            return cls.error_response('File type not allowed', 400)
            
        try:
            # Create upload directory if it doesn't exist
            upload_folder = os.path.join(
                current_app.config['UPLOAD_FOLDER'],
                file_type + 's'  # e.g., 'images', 'documents', 'resumes'
            )
            os.makedirs(upload_folder, exist_ok=True)
            
            # Generate a unique filename
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{uuid.uuid4()}.{ext}"
            filepath = os.path.join(upload_folder, filename)
            
            # Save the file
            file.save(filepath)
            
            # Generate the URL to access the file
            file_url = f"/uploads/{file_type}s/{filename}"
            
            # Update user profile with the file URL if needed
            if file_type == 'resume' and current_user.role == 'student':
                student = Student.query.filter_by(user_id=current_user.id).first()
                if student:
                    student.resume_url = file_url
                    db.session.commit()
            elif file_type == 'image':
                # Update user profile image
                current_user.profile_image = file_url
                db.session.commit()
            
            return cls.success_response(
                data={'url': file_url},
                message='File uploaded successfully'
            )
            
        except Exception as e:
            return cls.error_response(f'Error uploading file: {str(e)}', 500)
    
    @classmethod
    def upload_resume(cls):
        """Handle resume upload specifically"""
        return cls.upload_file(file_type='resume')
    
    @classmethod
    def upload_profile_image(cls):
        """Handle profile image upload"""
        return cls.upload_file(file_type='image')
    
    @classmethod
    def upload_company_logo(cls):
        """Handle company logo upload"""
        current_user = cls.get_current_user()
        if not current_user or current_user.role != 'company':
            return cls.error_response('Company access required', 403)
            
        result = cls.upload_file(file_type='image')
        
        # If upload was successful, update company logo
        if result[1] == 200:
            try:
                company = Company.query.filter_by(user_id=current_user.id).first()
                if company:
                    company.logo_url = result[0].get_json()['data']['url']
                    db.session.commit()
            except Exception as e:
                db.session.rollback()
                return cls.error_response(f'Error updating company logo: {str(e)}', 500)
        
        return result
