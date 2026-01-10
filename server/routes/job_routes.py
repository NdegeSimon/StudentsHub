from flask import Blueprint, jsonify, request
from models.job import Job  # Assuming you have a Job model
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

job_bp = Blueprint('job', __name__)

@job_bp.route('/', methods=['GET'])
def get_jobs():
    """
    Get all jobs
    """
    try:
        jobs = Job.query.all()
        return jsonify([job.to_dict() for job in jobs]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@job_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """
    Get a specific job by ID
    """
    try:
        job = Job.query.get_or_404(job_id)
        return jsonify(job.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@job_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    """
    Create a new job
    """
    try:
        data = request.get_json()
        # Add validation as needed
        job = Job(**data)
        db.session.add(job)
        db.session.commit()
        return jsonify(job.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    """
    Update an existing job
    """
    try:
        job = Job.query.get_or_404(job_id)
        data = request.get_json()
        
        # Update job fields
        for key, value in data.items():
            if hasattr(job, key):
                setattr(job, key, value)
                
        db.session.commit()
        return jsonify(job.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    """
    Delete a job
    """
    try:
        job = Job.query.get_or_404(job_id)
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "Job deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
