# routes/saved_jobs.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, SavedJob, Job, Company, Student, Application
from datetime import datetime, timedelta
from sqlalchemy import desc, func

saved_jobs_bp = Blueprint('saved_jobs', __name__)

@saved_jobs_bp.route('/api/saved-jobs', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    """
    Get all jobs saved by the current user
    Query Parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 20)
    - sort: Sort by 'date', 'match', or 'deadline' (default: 'date')
    """
    try:
        user_id = get_jwt_identity()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        offset = (page - 1) * limit
        
        # Get sort parameter
        sort_by = request.args.get('sort', 'date')
        
        # Base query
        query = db.session.query(
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
            SavedJob.student_id == student.id,
            Job.is_active == True
        )
        
        # Apply sorting
        if sort_by == 'date':
            query = query.order_by(desc(SavedJob.saved_at))
        elif sort_by == 'match':
            # This would require match scores in database
            # For now, sort by job posted date
            query = query.order_by(desc(Job.posted_date))
        elif sort_by == 'deadline':
            query = query.order_by(Job.application_deadline.asc())
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        results = query.offset(offset).limit(limit).all()

        saved_jobs = []
        for saved_job, job, company_name, company_logo in results:
            # Check if already applied
            has_applied = Application.query.filter_by(
                student_id=student.id,
                job_id=job.id
            ).first() is not None
            
            # Calculate match percentage (simplified)
            match_percentage = calculate_match_percentage(student, job)
            
            # Calculate days until deadline if exists
            days_left = None
            if job.application_deadline:
                today = datetime.utcnow().date()
                deadline_date = job.application_deadline.date() if hasattr(job.application_deadline, 'date') else job.application_deadline
                days_left = (deadline_date - today).days
            
            saved_jobs.append({
                "id": saved_job.id,
                "job_id": job.id,
                "title": job.title,
                "company": company_name,
                "location": job.location,
                "job_type": job.job_type,
                "salary": format_salary(job),
                "description": job.description[:200] + "..." if len(job.description) > 200 else job.description,
                "deadline": job.application_deadline.isoformat() if job.application_deadline else None,
                "days_left": days_left,
                "has_applied": has_applied,
                "match_percentage": match_percentage,
                "company_logo": company_logo,
                "saved_at": saved_job.saved_at.isoformat(),
                "notes": saved_job.notes,
                "is_urgent": days_left is not None and days_left <= 3
            })

        return jsonify({
            "success": True,
            "saved_jobs": saved_jobs,
            "total": total,
            "page": page,
            "limit": limit,
            "has_more": (page * limit) < total
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_deadlines():
    """
    Get saved jobs with upcoming deadlines (within next 7 days)
    """
    try:
        user_id = get_jwt_identity()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404
        
        # Calculate date range for upcoming deadlines (next 7 days)
        today = datetime.utcnow().date()
        seven_days_later = today + timedelta(days=7)
        
        # Query saved jobs with upcoming deadlines
        upcoming_jobs = db.session.query(
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
            SavedJob.student_id == student.id,
            Job.application_deadline.isnot(None),
            Job.application_deadline >= today,
            Job.application_deadline <= seven_days_later,
            Job.is_active == True
        ).order_by(
            Job.application_deadline.asc()
        ).all()
        
        result = []
        for saved_job, job, company_name, company_logo in upcoming_jobs:
            # Calculate days left
            deadline_date = job.application_deadline.date() if hasattr(job.application_deadline, 'date') else job.application_deadline
            days_left = (deadline_date - today).days
            
            # Check if already applied
            has_applied = Application.query.filter_by(
                student_id=student.id,
                job_id=job.id
            ).first() is not None
            
            result.append({
                "id": saved_job.id,
                "job_id": job.id,
                "title": job.title,
                "company": company_name,
                "location": job.location,
                "job_type": job.job_type,
                "salary": format_salary(job),
                "deadline": job.application_deadline.isoformat(),
                "days_left": days_left,
                "has_applied": has_applied,
                "company_logo": company_logo,
                "is_urgent": days_left <= 3,
                "saved_at": saved_job.saved_at.isoformat()
            })
        
        return jsonify({
            "success": True,
            "upcoming_deadlines": result,
            "count": len(result)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs/stats', methods=['GET'])
@jwt_required()
def get_saved_jobs_stats():
    """
    Get statistics for saved jobs
    """
    try:
        user_id = get_jwt_identity()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404
        
        # Count total saved jobs
        total_saved = SavedJob.query.filter_by(student_id=student.id).count()
        
        # Count saved jobs with upcoming deadlines (next 7 days)
        today = datetime.utcnow().date()
        seven_days_later = today + timedelta(days=7)
        upcoming_count = db.session.query(SavedJob).join(Job).filter(
            SavedJob.student_id == student.id,
            Job.application_deadline.isnot(None),
            Job.application_deadline >= today,
            Job.application_deadline <= seven_days_later,
            Job.is_active == True
        ).count()
        
        # Count saved jobs that have been applied to
        applied_count = db.session.query(SavedJob).filter(
            SavedJob.student_id == student.id,
            SavedJob.job_id.in_(
                db.session.query(Application.job_id).filter(
                    Application.student_id == student.id
                )
            )
        ).count()
        
        # Get expired saved jobs
        expired_count = db.session.query(SavedJob).join(Job).filter(
            SavedJob.student_id == student.id,
            Job.application_deadline.isnot(None),
            Job.application_deadline < today,
            Job.is_active == True
        ).count()
        
        # Calculate average match score (simplified)
        avg_match_rate = 85  # Placeholder - would need to calculate from match data
        
        return jsonify({
            "success": True,
            "stats": {
                "total_saved": total_saved,
                "upcoming_deadlines": upcoming_count,
                "applied_count": applied_count,
                "expired_count": expired_count,
                "avg_match_rate": avg_match_rate,
                "application_rate": round((applied_count / total_saved * 100) if total_saved > 0 else 0, 1)
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs', methods=['POST'])
@jwt_required()
def save_job():
    """
    Save a job for the current user
    """
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
            return jsonify({
                "success": True,
                "message": "Job already saved",
                "id": existing.id,
                "is_saved": True
            }), 200

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
            "success": True,
            "message": "Job saved successfully",
            "id": saved_job.id,
            "job_id": job_id,
            "title": job.title,
            "company": job.company,
            "saved_at": saved_job.saved_at.isoformat(),
            "is_saved": True
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs/<int:saved_job_id>', methods=['DELETE'])
@jwt_required()
def remove_saved_job(saved_job_id):
    """
    Remove a saved job
    """
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

        job_id = saved_job.job_id
        db.session.delete(saved_job)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Job removed from saved list",
            "job_id": job_id,
            "is_saved": False
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs/check/<int:job_id>', methods=['GET'])
@jwt_required()
def check_saved_job(job_id):
    """
    Check if a job is saved by the current user
    """
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
            "success": True,
            "is_saved": saved_job is not None,
            "saved_job_id": saved_job.id if saved_job else None
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs/bulk', methods=['DELETE'])
@jwt_required()
def bulk_remove_saved_jobs():
    """
    Remove multiple saved jobs at once
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get the student associated with the current user
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404

        saved_job_ids = data.get('saved_job_ids', [])
        if not saved_job_ids:
            return jsonify({"error": "No saved job IDs provided"}), 400

        # Delete the saved jobs
        deleted_count = SavedJob.query.filter(
            SavedJob.id.in_(saved_job_ids),
            SavedJob.student_id == student.id
        ).delete(synchronize_session=False)
        
        db.session.commit()

        return jsonify({
            "success": True,
            "message": f"Removed {deleted_count} jobs from saved list",
            "deleted_count": deleted_count
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@saved_jobs_bp.route('/api/saved-jobs/<int:saved_job_id>/notes', methods=['PUT'])
@jwt_required()
def update_saved_job_notes(saved_job_id):
    """
    Update notes for a saved job
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
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

        notes = data.get('notes', '')
        saved_job.notes = notes
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Notes updated successfully",
            "notes": notes
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Helper functions
def calculate_match_percentage(student, job):
    """
    Calculate match percentage between student and job
    """
    match = 0
    
    if student and job:
        # Skill match (40%)
        if student.skills and job.description:
            skills = student.skills.split(',') if isinstance(student.skills, str) else student.skills
            skill_matches = sum(1 for skill in skills[:5] 
                              if skill.strip().lower() in job.description.lower())
            if skills:
                match += (skill_matches / len(skills[:5])) * 40
        
        # Location match (30%)
        if student.location and job.location:
            if job.location.lower() == 'remote':
                match += 30
            elif student.location.lower() in job.location.lower():
                match += 30
        
        # Job type match (20%)
        if student.preferred_job_type and job.job_type:
            if student.preferred_job_type.lower() == job.job_type.lower():
                match += 20
        
        # Experience match (10%)
        if student.experience_level and job.experience_level:
            if student.experience_level.lower() == job.experience_level.lower():
                match += 10
    
    # Add random variance
    import random
    match += random.uniform(-5, 5)
    
    return min(100, max(0, int(match)))


def format_salary(job):
    """
    Format salary for display
    """
    if job.salary_min and job.salary_max:
        currency = job.salary_currency or ''
        return f"{currency}{job.salary_min:,} - {currency}{job.salary_max:,}"
    elif job.salary:
        return job.salary
    else:
        return "Not specified"