from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, SavedJob, Job, Company, Student
from datetime import datetime

saved_jobs_bp = Blueprint('saved_jobs', __name__)

# Get all saved jobs for the current student
@saved_jobs_bp.route('/api/saved-jobs', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    try:
        user_id = get_jwt_identity()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        saved_jobs = db.session.query(
            SavedJob, 
            Job, 
            Company.company_name,
            Company.logo_url
        ).join(
            Job, 
            SavedJob.job_id == Job.id
        ).join(
            Company,
            Job.company_id == Company.id
        ).filter(
            SavedJob.student_id == student.id
        ).all()

        result = []
        for saved_job, job, company_name, company_logo in saved_jobs:
            result.append({
                "id": saved_job.id,
                "job_id": job.id,
                "job_title": job.title,
                "company_name": company_name,
                "location": job.location,
                "job_type": job.job_type,
                "salary_min": job.salary_min,
                "salary_max": job.salary_max,
                "salary_currency": job.salary_currency,
                "is_active": job.is_active,
                "created_at": job.created_at.isoformat(),
                "saved_at": saved_job.saved_at.isoformat(),
                "company_logo": company_logo,
                "notes": saved_job.notes
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Save a job
@saved_jobs_bp.route('/api/saved-jobs', methods=['POST'])
@jwt_required()
def save_job():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        job_id = data.get('job_id')
        if not job_id:
            return jsonify({"error": "Job ID is required"}), 400

        # Check if job exists
        job = Job.query.get(job_id)
        if not job:
            return jsonify({"error": "Job not found"}), 404

        # Check if already saved
        existing = SavedJob.query.filter_by(
            student_id=student.id,
            job_id=job_id
        ).first()

        if existing:
            return jsonify({"message": "Job already saved", "id": existing.id}), 200

        # Save the job
        saved_job = SavedJob(
            student_id=student.id,
            job_id=job_id,
            notes=data.get('notes'),
            saved_at=datetime.utcnow()
        )
        
        db.session.add(saved_job)
        db.session.commit()

        return jsonify({
            "message": "Job saved successfully",
            "id": saved_job.id,
            "saved_at": saved_job.saved_at.isoformat()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Remove a saved job
@saved_jobs_bp.route('/api/saved-jobs/<int:saved_job_id>', methods=['DELETE'])
@jwt_required()
def remove_saved_job(saved_job_id):
    try:
        user_id = get_jwt_identity()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        saved_job = SavedJob.query.filter_by(
            id=saved_job_id,
            student_id=student.id
        ).first()

        if not saved_job:
            return jsonify({"error": "Saved job not found"}), 404

        db.session.delete(saved_job)
        db.session.commit()

        return jsonify({"message": "Job removed from saved list"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Check if a job is saved
@saved_jobs_bp.route('/api/saved-jobs/check/<int:job_id>', methods=['GET'])
@jwt_required()
def check_saved_job(job_id):
    try:
        user_id = get_jwt_identity()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        saved_job = SavedJob.query.filter_by(
            student_id=student.id,
            job_id=job_id
        ).first()

        return jsonify({
            "is_saved": saved_job is not None,
            "saved_job_id": saved_job.id if saved_job else None
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
