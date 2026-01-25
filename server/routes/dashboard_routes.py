from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, User, Student, Company, Job, Application, SavedJob, Interview, Notification
from datetime import datetime, timedelta
import logging
from sqlalchemy import func, and_, or_

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__)

# REMOVE "/api/dashboard" from all routes since it's already in the url_prefix

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        current_user = get_jwt_identity()
        # Handle case where current_user might be a dict (from JWT) or an ID
        user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        stats = {}
        
        # Get user role and set stats based on role
        if user.role == 'student':
            student = Student.query.filter_by(user_id=user_id).first()
            if not student:
                return jsonify({"error": "Student profile not found"}), 404
                
            # Get application stats
            applications = Application.query.filter_by(student_id=student.id).all()
            
            # Get application status counts
            status_counts = {}
            for app in applications:
                status = app.status.lower() if app.status else 'pending'
                status_counts[status] = status_counts.get(status, 0) + 1
            
            # Get interview stats
            upcoming_interviews = Interview.query.join(
                Application, 
                Application.id == Interview.application_id
            ).filter(
                Application.student_id == student.id,
                Interview.scheduled_at > datetime.utcnow(),
                Interview.status.in_(['scheduled', 'rescheduled'])
            ).count()
            
            # Get saved jobs count
            saved_jobs = SavedJob.query.filter_by(student_id=student.id).count()
            
            # Get profile view count (placeholder - would come from analytics)
            profile_views = 0  # TODO: Implement profile view tracking
            
            stats = {
                "applications": len(applications),
                "applications_change": 0,  # TODO: Calculate change from previous period
                "upcoming_interviews": upcoming_interviews,
                "interview_change": 0,  # TODO: Calculate change from previous period
                "saved_jobs": saved_jobs,
                "saved_jobs_change": 0,  # TODO: Calculate change from previous period
                "profile_views": profile_views,
                "profile_views_change": 0,  # TODO: Calculate change from previous period
                "application_status": status_counts
            }
            
        elif user.role == 'employer':
            company = Company.query.filter_by(user_id=current_user_id).first()
            if not company:
                return jsonify({"error": "Company profile not found"}), 404
                
            # Get job stats
            jobs = Job.query.filter_by(company_id=company.id).all()
            active_jobs = len([job for job in jobs if job.is_active])
            
            # Get application stats
            applications = Application.query.join(
                Job, Job.id == Application.job_id
            ).filter(
                Job.company_id == company.id
            ).all()
            
            # Get application status counts
            status_counts = {}
            for app in applications:
                status = app.status.lower() if app.status else 'pending'
                status_counts[status] = status_counts.get(status, 0) + 1
            
            # Get interview stats
            upcoming_interviews = Interview.query.join(
                Application, 
                Application.id == Interview.application_id
            ).join(
                Job, Job.id == Application.job_id
            ).filter(
                Job.company_id == company.id,
                Interview.scheduled_at > datetime.utcnow(),
                Interview.status.in_(['scheduled', 'rescheduled'])
            ).count()
            
            # Get saved candidates count - FIXED: Changed from SavedCandidate to SavedJob
            # If you don't have SavedCandidate model, comment this out or use:
            saved_candidates = 0  # Placeholder
            
            stats = {
                "active_jobs": active_jobs,
                "jobs_change": 0,  # TODO: Calculate change from previous period
                "total_applications": len(applications),
                "applications_change": 0,  # TODO: Calculate change from previous period
                "upcoming_interviews": upcoming_interviews,
                "interview_change": 0,  # TODO: Calculate change from previous period
                "saved_candidates": saved_candidates,
                "saved_candidates_change": 0,  # TODO: Calculate change from previous period
                "application_status": status_counts
            }
        else:
            stats = {
                "message": "Admin dashboard not implemented"
            }
        
        return jsonify(stats), 200
        
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to fetch dashboard stats", "details": str(e)}), 500

@dashboard_bp.route('/upcoming-deadlines', methods=['GET'])  # Changed from '/api/dashboard/upcoming-deadlines'
@jwt_required()
def get_upcoming_deadlines():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        deadlines = []
        now = datetime.utcnow()
        thirty_days_later = now + timedelta(days=30)
        
        if user.role == 'student':
            student = Student.query.filter_by(user_id=current_user_id).first()
            if not student:
                return jsonify({"error": "Student profile not found"}), 404
                
            # Get application deadlines
            applications = Application.query.filter_by(
                student_id=student.id
            ).join(
                Job, Job.id == Application.job_id
            ).filter(
                Job.application_deadline.between(now, thirty_days_later)
            ).all()
            
            for app in applications:
                if app.job and app.job.application_deadline:
                    deadlines.append({
                        'id': f"app_{app.id}",
                        'type': 'application',
                        'title': f"Application for {app.job.title}",
                        'deadline': app.job.application_deadline.isoformat(),
                        'job_id': app.job.id,
                        'company': app.job.company.company_name if app.job.company else 'Unknown Company',
                        'status': app.status or 'pending'
                    })
            
            # Get interview deadlines
            interviews = Interview.query.join(
                Application, Application.id == Interview.application_id
            ).filter(
                Application.student_id == student.id,
                Interview.scheduled_at.between(now, thirty_days_later)
            ).all()
            
            for interview in interviews:
                if interview.application and interview.application.job:
                    deadlines.append({
                        'id': f"int_{interview.id}",
                        'type': 'interview',
                        'title': f"Interview for {interview.application.job.title}",
                        'deadline': interview.scheduled_at.isoformat(),
                        'job_id': interview.application.job_id,
                        'company': interview.application.job.company.company_name if interview.application.job.company else 'Unknown Company',
                        'status': interview.status or 'scheduled',
                        'location_or_link': interview.location_or_link or '',
                        'interviewer_name': interview.interviewer_name or ''
                    })
                    
        elif user.role == 'employer':
            company = Company.query.filter_by(user_id=current_user_id).first()
            if not company:
                return jsonify({"error": "Company profile not found"}), 404
                
            # Get job application deadlines
            jobs = Job.query.filter(
                Job.company_id == company.id,
                Job.is_active == True
            ).all()
            
            for job in jobs:
                if job.application_deadline and job.application_deadline.between(now, thirty_days_later):
                    deadlines.append({
                        'id': f"job_{job.id}",
                        'type': 'job_deadline',
                        'title': f"Application deadline: {job.title}",
                        'deadline': job.application_deadline.isoformat(),
                        'job_id': job.id,
                        'applications_count': job.applications.count()
                    })
            
            # Get scheduled interviews
            interviews = Interview.query.join(
                Application, Application.id == Interview.application_id
            ).join(
                Job, Job.id == Application.job_id
            ).filter(
                Job.company_id == company.id,
                Interview.scheduled_at.between(now, thirty_days_later)
            ).all()
            
            for interview in interviews:
                deadlines.append({
                    'id': f"int_{interview.id}",
                    'type': 'interview',
                    'title': f"Interview for {interview.application.job.title}",
                    'deadline': interview.scheduled_at.isoformat(),
                    'job_id': interview.application.job_id,
                    'candidate_name': f"{interview.application.student.user.first_name} {interview.application.student.user.last_name}",
                    'status': interview.status or 'scheduled',
                    'location_or_link': interview.location_or_link or ''
                })
        
        # Sort deadlines by date
        deadlines.sort(key=lambda x: x.get('deadline', ''))
        
        return jsonify(deadlines), 200
        
    except Exception as e:
        logger.error(f"Error fetching upcoming deadlines: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to fetch upcoming deadlines", "details": str(e)}), 500

@dashboard_bp.route('/recent-activity', methods=['GET'])  # Changed from '/api/dashboard/recent-activity'
@jwt_required()
def get_recent_activity():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        activities = []
        
        # Get recent notifications
        notifications = Notification.query.filter_by(
            user_id=current_user_id
        ).order_by(
            Notification.created_at.desc()
        ).limit(10).all()
        
        for note in notifications:
            activities.append({
                'id': f"notif_{note.id}",
                'type': 'notification',
                'title': note.title or '',
                'message': note.message or '',
                'created_at': note.created_at.isoformat() if note.created_at else datetime.utcnow().isoformat(),
                'is_read': note.is_read or False,
                'link_url': note.link_url or ''
            })
        
        # Get recent applications (for students) or received applications (for employers)
        if user.role == 'student':
            student = Student.query.filter_by(user_id=current_user_id).first()
            if student:
                recent_apps = Application.query.filter_by(
                    student_id=student.id
                ).order_by(
                    Application.applied_at.desc() if hasattr(Application, 'applied_at') else Application.created_at.desc()
                ).limit(5).all()
                
                for app in recent_apps:
                    activities.append({
                        'id': f"app_{app.id}",
                        'type': 'application',
                        'title': f"Application submitted for {app.job.title if app.job else 'a job'}",
                        'message': f"Status: {app.status.capitalize() if app.status else 'Pending'}",
                        'created_at': app.applied_at.isoformat() if hasattr(app, 'applied_at') and app.applied_at else app.created_at.isoformat(),
                        'status': app.status or 'pending',
                        'job_id': app.job_id,
                        'company': app.job.company.company_name if app.job and app.job.company else 'Unknown Company'
                    })
                    
        elif user.role == 'employer':
            company = Company.query.filter_by(user_id=current_user_id).first()
            if company:
                recent_apps = Application.query.join(
                    Job, Job.id == Application.job_id
                ).filter(
                    Job.company_id == company.id
                ).order_by(
                    Application.applied_at.desc() if hasattr(Application, 'applied_at') else Application.created_at.desc()
                ).limit(5).all()
                
                for app in recent_apps:
                    activities.append({
                        'id': f"app_{app.id}",
                        'type': 'application_received',
                        'title': f"New application for {app.job.title if app.job else 'a job'}",
                        'message': f"From: {app.student.user.first_name} {app.student.user.last_name}",
                        'created_at': app.applied_at.isoformat() if hasattr(app, 'applied_at') and app.applied_at else app.created_at.isoformat(),
                        'status': app.status or 'pending',
                        'job_id': app.job_id,
                        'student_id': app.student_id
                    })
        
        # Sort all activities by date (newest first)
        activities.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return jsonify(activities[:10]), 200  # Return only the 10 most recent activities
        
    except Exception as e:
        logger.error(f"Error fetching recent activity: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to fetch recent activity", "details": str(e)}), 500

# Add a test endpoint
@dashboard_bp.route('/test', methods=['GET'])
def test_dashboard():
    return jsonify({"message": "Dashboard routes are working!", "timestamp": datetime.utcnow().isoformat()}), 200