from flask import Blueprint, jsonify, request
from models.application import Application  # Assuming you have an Application model
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

application_bp = Blueprint('application', __name__)

@application_bp.route('/', methods=['GET'])
@jwt_required()
def get_applications():
    """
    Get all applications (filtered by current user if not admin)
    """
    try:
        current_user = get_jwt_identity()
        # Add logic to filter by current user if not admin
        applications = Application.query.all()
        return jsonify([app.to_dict() for app in applications]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@application_bp.route('/<int:application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    """
    Get a specific application by ID
    """
    try:
        application = Application.query.get_or_404(application_id)
        # Add authorization check here
        return jsonify(application.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@application_bp.route('/', methods=['POST'])
@jwt_required()
def create_application():
    """
    Create a new application
    """
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        # Add current user as the applicant
        data['student_id'] = current_user['id']  # Adjust based on your JWT claims
        
        application = Application(**data)
        db.session.add(application)
        db.session.commit()
        return jsonify(application.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@application_bp.route('/<int:application_id>', methods=['PUT'])
@jwt_required()
def update_application(application_id):
    """
    Update an existing application
    """
    try:
        application = Application.query.get_or_404(application_id)
        # Add authorization check here
        
        data = request.get_json()
        
        # Update application fields
        for key, value in data.items():
            if hasattr(application, key):
                setattr(application, key, value)
                
        db.session.commit()
        return jsonify(application.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@application_bp.route('/<int:application_id>', methods=['DELETE'])
@jwt_required()
def delete_application(application_id):
    """
    Delete an application
    """
    try:
        application = Application.query.get_or_404(application_id)
        # Add authorization check here
        
        db.session.delete(application)
        db.session.commit()
        return jsonify({"message": "Application deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
