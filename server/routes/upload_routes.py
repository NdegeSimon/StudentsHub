import os
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'}

upload_bp = Blueprint('upload', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/resume', methods=['POST'])
@jwt_required()
def upload_resume():
    """
    Upload a resume file
    """
    try:
        current_user = get_jwt_identity()
        
        # Check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        
        # If user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file and allowed_file(file.filename):
            # Create uploads directory if it doesn't exist
            upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'resumes')
            os.makedirs(upload_folder, exist_ok=True)
            
            # Create a secure filename
            filename = secure_filename(file.filename)
            # Add timestamp to make filename unique
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            filename = f"{current_user['id']}_{timestamp}_{filename}"
            
            # Save the file
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            
            # Here you would typically save the file path to the user's profile or application
            # For example:
            # user = User.query.get(current_user['id'])
            # user.resume_path = file_path
            # db.session.commit()
            
            return jsonify({
                "message": "File uploaded successfully",
                "filename": filename,
                "file_path": file_path
            }), 201
            
        return jsonify({"error": "File type not allowed"}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@upload_bp.route('/profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    """
    Upload a profile picture
    """
    try:
        current_user = get_jwt_identity()
        
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'profile_pictures')
            os.makedirs(upload_folder, exist_ok=True)
            
            # Create a secure filename
            filename = secure_filename(file.filename)
            # Add timestamp to make filename unique
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            filename = f"{current_user['id']}_{timestamp}_{filename}"
            
            # Save the file
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            
            # Here you would typically update the user's profile picture path
            # For example:
            # user = User.query.get(current_user['id'])
            # user.profile_picture = file_path
            # db.session.commit()
            
            return jsonify({
                "message": "Profile picture uploaded successfully",
                "filename": filename,
                "file_path": file_path
            }), 201
            
        return jsonify({"error": "Only image files (PNG, JPG, JPEG) are allowed"}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
