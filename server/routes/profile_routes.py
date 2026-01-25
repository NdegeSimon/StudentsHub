from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Student, User, Company
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

def get_current_student():
    """Helper function to get the current student profile"""
    current_user = get_jwt_identity()
    user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
    
    student = Student.query.filter_by(user_id=user_id).first()
    if not student:
        # Create a basic student profile if it doesn't exist
        student = Student(user_id=user_id)
        db.session.add(student)
        db.session.commit()
    
    return student

# @profile_bp.route('/me', methods=['GET'])
# @jwt_required()
# def get_my_profile():
#     """Get the current user's profile"""
#     try:
#         current_user = get_jwt_identity()
#         user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        
#         user = User.query.get(user_id)
#         if not user:
#             return jsonify({"status": "error", "message": "User not found"}), 404
        
#         profile_data = user.to_dict()
        
#         # Add student-specific data if user is a student
#         if user.role == 'student' and user.student_profile:
#             student_data = user.student_profile.__dict__.copy()
#             # Remove SQLAlchemy instance state
#             student_data.pop('_sa_instance_state', None)
#             profile_data.update(student_data)
#         # Add company-specific data if user is an employer
#         elif user.role == 'employer' and user.company_profile:
#             company_data = user.company_profile.__dict__.copy()
#             company_data.pop('_sa_instance_state', None)
#             profile_data.update(company_data)
        
#         return jsonify({
#             "status": "success",
#             "data": profile_data
#         }), 200
        
#     except Exception as e:
#         logger.error(f"Error fetching profile: {str(e)}")
#         return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/basic', methods=['PUT'])

@jwt_required()
def update_basic_info():
    """Update basic user information"""
    try:
        current_user = get_jwt_identity()
        user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        
        data = request.get_json()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        # Update basic user info
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data and user.role == 'student' and user.student_profile:
            user.student_profile.phone = data['phone']
        if 'location' in data and user.role == 'student' and user.student_profile:
            user.student_profile.location = data['location']
        if 'bio' in data and user.role == 'student' and user.student_profile:
            user.student_profile.bio = data['bio']
            
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Profile updated successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating basic info: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# Education endpoints
@profile_bp.route('/education', methods=['GET'])
@jwt_required()
def get_education():
    """Get education history"""
    try:
        student = get_current_student()
        education = student.education or []
        
        return jsonify({
            "status": "success",
            "data": education
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching education: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/education', methods=['POST'])
@jwt_required()
def add_education():
    """Add new education entry"""
    try:
        student = get_current_student()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['institution', 'degree', 'field_of_study', 'start_date']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400
        
        # Create new education entry
        new_edu = {
            'id': len(student.education or []) + 1,
            'institution': data['institution'],
            'degree': data['degree'],
            'field_of_study': data['field_of_study'],
            'start_date': data['start_date'],
            'end_date': data.get('end_date'),
            'is_current': data.get('is_current', False),
            'description': data.get('description', ''),
            'grade': data.get('grade'),
            'activities': data.get('activities', []),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Update education array
        current_edu = student.education or []
        current_edu.append(new_edu)
        student.education = current_edu
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "data": new_edu,
            "message": "Education added successfully"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding education: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/education/<int:edu_id>', methods=['PUT'])
@jwt_required()
def update_education(edu_id):
    """Update an education entry"""
    try:
        student = get_current_student()
        data = request.get_json()
        
        if not student.education:
            return jsonify({
                "status": "error",
                "message": "No education entries found"
            }), 404
        
        # Find and update the education entry
        updated = False
        for edu in student.education:
            if edu.get('id') == edu_id:
                # Update fields that are present in the request
                for key, value in data.items():
                    if key in edu and key != 'id':  # Don't allow updating the ID
                        edu[key] = value
                edu['updated_at'] = datetime.utcnow().isoformat()
                updated = True
                break
        
        if not updated:
            return jsonify({
                "status": "error",
                "message": "Education entry not found"
            }), 404
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Education updated successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating education: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/education/<int:edu_id>', methods=['DELETE'])
@jwt_required()
def delete_education(edu_id):
    """Delete an education entry"""
    try:
        student = get_current_student()
        
        if not student.education:
            return jsonify({
                "status": "error",
                "message": "No education entries found"
            }), 404
        
        # Remove the education entry
        original_length = len(student.education)
        student.education = [edu for edu in student.education if edu.get('id') != edu_id]
        
        if len(student.education) == original_length:
            return jsonify({
                "status": "error",
                "message": "Education entry not found"
            }), 404
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Education deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting education: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# Experience endpoints (similar structure to education)
@profile_bp.route('/experience', methods=['GET'])
@jwt_required()
def get_experience():
    """Get work experience history"""
    try:
        student = get_current_student()
        experience = student.work_experience or []
        
        return jsonify({
            "status": "success",
            "data": experience
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching experience: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/experience', methods=['POST'])
@jwt_required()
def add_experience():
    """Add new work experience"""
    try:
        student = get_current_student()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'company', 'start_date']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400
        
        # Create new experience entry
        new_exp = {
            'id': len(student.work_experience or []) + 1,
            'title': data['title'],
            'company': data['company'],
            'location': data.get('location'),
            'start_date': data['start_date'],
            'end_date': data.get('end_date'),
            'is_current': data.get('is_current', False),
            'description': data.get('description', ''),
            'employment_type': data.get('employment_type'),
            'skills': data.get('skills', []),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Update experience array
        current_exp = student.work_experience or []
        current_exp.append(new_exp)
        student.work_experience = current_exp
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "data": new_exp,
            "message": "Experience added successfully"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding experience: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/experience/<int:exp_id>', methods=['PUT'])
@jwt_required()
def update_experience(exp_id):
    """Update a work experience entry"""
    try:
        student = get_current_student()
        data = request.get_json()
        
        if not student.work_experience:
            return jsonify({
                "status": "error",
                "message": "No experience entries found"
            }), 404
        
        # Find and update the experience entry
        updated = False
        for exp in student.work_experience:
            if exp.get('id') == exp_id:
                # Update fields that are present in the request
                for key, value in data.items():
                    if key in exp and key != 'id':  # Don't allow updating the ID
                        exp[key] = value
                exp['updated_at'] = datetime.utcnow().isoformat()
                updated = True
                break
        
        if not updated:
            return jsonify({
                "status": "error",
                "message": "Experience entry not found"
            }), 404
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Experience updated successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating experience: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/experience/<int:exp_id>', methods=['DELETE'])
@jwt_required()
def delete_experience(exp_id):
    """Delete a work experience entry"""
    try:
        student = get_current_student()
        
        if not student.work_experience:
            return jsonify({
                "status": "error",
                "message": "No experience entries found"
            }), 404
        
        # Remove the experience entry
        original_length = len(student.work_experience)
        student.work_experience = [exp for exp in student.work_experience if exp.get('id') != exp_id]
        
        if len(student.work_experience) == original_length:
            return jsonify({
                "status": "error",
                "message": "Experience entry not found"
            }), 404
        
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Experience deleted successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting experience: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# Skills endpoints
@profile_bp.route('/skills', methods=['GET'])
@jwt_required()
def get_skills():
    """Get user skills"""
    try:
        student = get_current_student()
        skills = student.skills or []
        
        return jsonify({
            "status": "success",
            "data": skills
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching skills: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/skills', methods=['PUT'])
@jwt_required()
def update_skills():
    """Update user skills"""
    try:
        student = get_current_student()
        data = request.get_json()
        
        if 'skills' not in data:
            return jsonify({
                "status": "error",
                "message": "Skills array is required"
            }), 400
        
        student.skills = data['skills']
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Skills updated successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating skills: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@profile_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    """Get the current user's profile with frontend-friendly structure"""
    try:
        current_user = get_jwt_identity()
        user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        # Create a response that matches what frontend expects
        profile_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        
        # Add student profile data if exists
        if user.role == 'student' and user.student_profile:
            student = user.student_profile
            profile_data.update({
                "phone": student.phone,
                "location": student.location,
                "bio": student.bio,
                "skills": student.skills or [],
                "work_experience": student.work_experience or [],
                "education": student.education or [],
                "portfolio_url": student.portfolio_url,
                "github_url": student.github_url,
                "linkedin_url": student.linkedin_url,
                "resume_url": student.resume_url,
                "profile_picture": student.profile_picture,
                "years_of_experience": student.years_of_experience,
                "availability": student.availability,
                "preferred_job_types": student.preferred_job_types or []
            })
        
        return jsonify({
            "status": "success",
            "data": profile_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500