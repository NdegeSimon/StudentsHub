# routes/recommended_jobs.py
from flask import Blueprint, jsonify, request
from sqlalchemy import or_, desc
from models.models import Job, Student, User, SavedJob, Application
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import random

recommended_bp = Blueprint('recommended', __name__)

@recommended_bp.route('/api/jobs/recommended', methods=['GET'])
@jwt_required()
def get_recommended_jobs():
    """
    Get recommended jobs for the current user based on their profile and saved jobs
    """
    try:
        user_id = get_jwt_identity()
        
        # Get current user
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Get student profile
        student = Student.query.filter_by(user_id=user_id).first()
        
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        offset = (page - 1) * limit
        
        # Start building the query
        query = Job.query.filter(Job.is_active == True)
        
        # If user is a student and has skills, use them for recommendations
        if student and student.skills:
            skills = student.skills.split(',') if isinstance(student.skills, str) else student.skills
            
            # Create a query to find jobs that match skills
            skill_queries = []
            for skill in skills[:5]:  # Limit to top 5 skills
                skill = skill.strip()
                if skill:
                    skill_queries.append(Job.description.ilike(f'%{skill}%'))
                    skill_queries.append(Job.title.ilike(f'%{skill}%'))
            
            if skill_queries:
                # Prioritize jobs that match skills
                query = query.filter(or_(*skill_queries))
        
        # Get user's saved jobs to avoid recommending them
        saved_job_ids = []
        if student:
            saved_jobs = SavedJob.query.filter_by(student_id=student.id).all()
            saved_job_ids = [sj.job_id for sj in saved_jobs]
        
        # Exclude saved jobs
        if saved_job_ids:
            query = query.filter(Job.id.notin_(saved_job_ids))
        
        # Get jobs the user has already applied to
        applied_job_ids = []
        if student:
            applied_jobs = Application.query.filter_by(student_id=student.id).all()
            applied_job_ids = [app.job_id for app in applied_jobs]
            if applied_job_ids:
                query = query.filter(Job.id.notin_(applied_job_ids))
        
        # Get location preference
        location_pref = request.args.get('location')
        if location_pref:
            query = query.filter(
                or_(
                    Job.location.ilike(f'%{location_pref}%'),
                    Job.location == 'Remote',
                    Job.location.ilike('%Remote%')
                )
            )
        
        # Filter by job type if specified
        job_type = request.args.get('job_type')
        if job_type and job_type.lower() != 'all':
            query = query.filter(Job.job_type == job_type)
        
        # Get total count
        total_jobs = query.count()
        
        # Order by: featured first, then recent, then salary
        jobs = query.order_by(
            desc(Job.is_featured),
            desc(Job.posted_date),
            desc(Job.salary_max)
        ).offset(offset).limit(limit).all()
        
        # Calculate match percentage for each job
        jobs_with_match = []
        for job in jobs:
            job_data = job.to_dict()
            
            # Calculate match percentage
            match_percentage = 0
            
            # Skill match (40 points max)
            if student and student.skills and job.description:
                skills = student.skills.split(',') if isinstance(student.skills, str) else student.skills
                skill_matches = 0
                for skill in skills[:10]:  # Check first 10 skills
                    skill = skill.strip().lower()
                    if skill and (skill in job.description.lower() or skill in job.title.lower()):
                        skill_matches += 1
                if skills:
                    skill_score = min(40, (skill_matches / len(skills)) * 40)
                    match_percentage += skill_score
            
            # Location match (30 points)
            if student and student.location and job.location:
                if job.location.lower() == 'remote':
                    match_percentage += 30
                elif student.location.lower() in job.location.lower():
                    match_percentage += 30
                else:
                    # Partial match
                    match_percentage += 10
            
            # Job type match (20 points)
            if student and student.preferred_job_type and job.job_type:
                if student.preferred_job_type.lower() == job.job_type.lower():
                    match_percentage += 20
            
            # Freshness bonus (10 points for recent jobs)
            if job.posted_date:
                days_old = (datetime.utcnow() - job.posted_date).days
                if days_old <= 7:
                    match_percentage += 10
                elif days_old <= 30:
                    match_percentage += 5
            
            # Add some randomness to avoid same results
            match_percentage += random.uniform(0, 10)
            match_percentage = min(100, max(0, int(match_percentage)))
            
            job_data['match_percentage'] = match_percentage
            job_data['is_saved'] = job.id in saved_job_ids
            
            # Check if user has applied
            has_applied = job.id in applied_job_ids
            job_data['has_applied'] = has_applied
            
            jobs_with_match.append(job_data)
        
        # Sort by match percentage
        jobs_with_match.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        return jsonify({
            'success': True,
            'jobs': jobs_with_match,
            'total': total_jobs,
            'page': page,
            'limit': limit,
            'has_more': (page * limit) < total_jobs
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@recommended_bp.route('/api/jobs/<int:job_id>/match-percentage', methods=['GET'])
@jwt_required()
def get_job_match_percentage(job_id):
    """
    Get match percentage for a specific job for the current user
    """
    try:
        user_id = get_jwt_identity()
        
        # Get job
        job = Job.query.get_or_404(job_id)
        
        # Get student profile
        student = Student.query.filter_by(user_id=user_id).first()
        
        # Check if job is saved
        is_saved = False
        if student:
            is_saved = SavedJob.query.filter_by(
                student_id=student.id,
                job_id=job_id
            ).first() is not None
        
        # Check if applied
        has_applied = False
        if student:
            has_applied = Application.query.filter_by(
                student_id=student.id,
                job_id=job_id
            ).first() is not None
        
        # Calculate match percentage
        match_percentage = 0
        
        if student:
            # Skill match (40 points max)
            if student.skills and job.description:
                skills = student.skills.split(',') if isinstance(student.skills, str) else student.skills
                skill_matches = 0
                for skill in skills:
                    skill = skill.strip().lower()
                    if skill and (skill in job.description.lower() or skill in job.title.lower()):
                        skill_matches += 1
                if skills:
                    skill_score = min(40, (skill_matches / len(skills)) * 40)
                    match_percentage += skill_score
            
            # Location match (30 points)
            if student.location and job.location:
                if job.location.lower() == 'remote':
                    match_percentage += 30
                elif student.location.lower() in job.location.lower():
                    match_percentage += 30
                else:
                    match_percentage += 10
            
            # Job type match (20 points)
            if student.preferred_job_type and job.job_type:
                if student.preferred_job_type.lower() == job.job_type.lower():
                    match_percentage += 20
            
            # Experience level match (10 points)
            if student.experience_level and job.experience_level:
                if student.experience_level.lower() == job.experience_level.lower():
                    match_percentage += 10
        
        # Add some base percentage
        match_percentage += random.uniform(10, 20)
        match_percentage = min(100, max(0, int(match_percentage)))
        
        return jsonify({
            'success': True,
            'job_id': job_id,
            'title': job.title,
            'company': job.company,
            'match_percentage': match_percentage,
            'is_saved': is_saved,
            'has_applied': has_applied
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@recommended_bp.route('/api/jobs/personalized', methods=['GET'])
@jwt_required()
def get_personalized_jobs():
    """
    Get highly personalized job recommendations based on user behavior
    """
    try:
        user_id = get_jwt_identity()
        
        # Get student profile
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({"error": "Student profile not found"}), 404
        
        # Get user's saved jobs categories
        saved_categories = set()
        saved_jobs = SavedJob.query.filter_by(student_id=student.id).join(Job).all()
        for saved_job in saved_jobs:
            if saved_job.job.job_type:
                saved_categories.add(saved_job.job.job_type)
        
        # Get applied jobs categories
        applied_categories = set()
        applied_jobs = Application.query.filter_by(student_id=student.id).join(Job).all()
        for app in applied_jobs:
            if app.job.job_type:
                applied_categories.add(app.job.job_type)
        
        # Combine categories user has shown interest in
        preferred_categories = list(saved_categories.union(applied_categories))
        
        # Query jobs from preferred categories
        jobs = []
        if preferred_categories:
            jobs = Job.query.filter(
                Job.is_active == True,
                Job.job_type.in_(preferred_categories)
            ).order_by(desc(Job.posted_date)).limit(20).all()
        
        # If no preferred categories or not enough jobs, get general recommendations
        if len(jobs) < 10:
            remaining = 10 - len(jobs)
            general_jobs = Job.query.filter(
                Job.is_active == True,
                Job.id.notin_([j.id for j in jobs])
            ).order_by(desc(Job.posted_date)).limit(remaining).all()
            jobs.extend(general_jobs)
        
        # Calculate match scores
        result = []
        for job in jobs:
            job_data = job.to_dict()
            
            # Check if saved
            is_saved = any(sj.job_id == job.id for sj in saved_jobs)
            
            # Check if applied
            has_applied = any(app.job_id == job.id for app in applied_jobs)
            
            # Calculate personalized score
            score = 0
            
            # Category preference boost (50 points)
            if job.job_type in preferred_categories:
                score += 50
            
            # Skill match (30 points)
            if student.skills and job.description:
                skills = student.skills.split(',') if isinstance(student.skills, str) else student.skills
                for skill in skills[:5]:
                    if skill.strip().lower() in job.description.lower():
                        score += 6
            
            # Location match (20 points)
            if student.location and job.location:
                if job.location.lower() == 'remote' or student.location.lower() in job.location.lower():
                    score += 20
            
            # Normalize score
            score = min(100, score)
            
            job_data['personalized_score'] = score
            job_data['is_saved'] = is_saved
            job_data['has_applied'] = has_applied
            job_data['reason'] = "Based on your saved and applied jobs" if job.job_type in preferred_categories else "Recommended for you"
            
            result.append(job_data)
        
        # Sort by score
        result.sort(key=lambda x: x['personalized_score'], reverse=True)
        
        return jsonify({
            'success': True,
            'jobs': result[:10],  # Return top 10
            'count': len(result)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500