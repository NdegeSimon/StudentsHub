from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, User, Job, Application, Company, Student
from datetime import datetime, timedelta
from sqlalchemy import func, desc
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    try:
        # Verify admin user
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        # Get total counts
        total_users = User.query.count()
        total_students = Student.query.count()
        total_companies = Company.query.count()
        total_jobs = Job.query.count()
        total_applications = Application.query.count()

        # Get today's counts
        today = datetime.utcnow().date()
        today_users = User.query.filter(func.date(User.created_at) == today).count()
        today_jobs = Job.query.filter(func.date(Job.created_at) == today).count()
        today_applications = Application.query.filter(func.date(Application.created_at) == today).count()

        # Get weekly growth
        week_ago = today - timedelta(days=7)
        last_week_users = User.query.filter(User.created_at.between(week_ago, today)).count()
        last_week_jobs = Job.query.filter(Job.created_at.between(week_ago, today)).count()
        last_week_applications = Application.query.filter(Application.created_at.between(week_ago, today)).count()

        stats = {
            "totalUsers": total_users,
            "totalStudents": total_students,
            "totalCompanies": total_companies,
            "totalJobs": total_jobs,
            "totalApplications": total_applications,
            "todayStats": {
                "newUsers": today_users,
                "newJobs": today_jobs,
                "newApplications": today_applications
            },
            "weeklyStats": {
                "newUsers": last_week_users,
                "newJobs": last_week_jobs,
                "newApplications": last_week_applications
            }
        }

        return jsonify(stats), 200

    except Exception as e:
        logger.error(f"Error fetching admin stats: {str(e)}")
        return jsonify({"error": "Failed to fetch admin stats"}), 500

@admin_bp.route('/jobs/recent', methods=['GET'])
@jwt_required()
def get_recent_jobs():
    try:
        # Verify admin user
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        limit = request.args.get('limit', 10, type=int)
        recent_jobs = Job.query.order_by(Job.created_at.desc()).limit(limit).all()

        jobs_data = [{
            "id": job.id,
            "title": job.title,
            "company": job.company.company_name if job.company else "Unknown Company",
            "status": "active" if job.is_active else "inactive",
            "applicants": Application.query.filter_by(job_id=job.id).count(),
            "created_at": job.created_at.isoformat()
        } for job in recent_jobs]

        return jsonify(jobs_data), 200

    except Exception as e:
        logger.error(f"Error fetching recent jobs: {str(e)}")
        return jsonify({"error": "Failed to fetch recent jobs"}), 500

@admin_bp.route('/users/recent', methods=['GET'])
@jwt_required()
def get_recent_users():
    try:
        # Verify admin user
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        limit = request.args.get('limit', 10, type=int)
        recent_users = User.query.order_by(User.created_at.desc()).limit(limit).all()

        users_data = []
        for user in recent_users:
            user_data = {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "status": "active" if user.is_active else "inactive",
                "created_at": user.created_at.isoformat(),
                "last_login": user.last_login.isoformat() if user.last_login else None
            }
            
            # Add profile info based on user role
            if user.role == 'student':
                student = Student.query.filter_by(user_id=user.id).first()
                if student:
                    user_data.update({
                        "first_name": student.first_name,
                        "last_name": student.last_name,
                        "full_name": f"{student.first_name} {student.last_name}"
                    })
            elif user.role == 'employer':
                company = Company.query.filter_by(user_id=user.id).first()
                if company:
                    user_data.update({
                        "company_name": company.company_name,
                        "full_name": company.contact_person
                    })
            
            users_data.append(user_data)

        return jsonify(users_data), 200

    except Exception as e:
        logger.error(f"Error fetching recent users: {str(e)}")
        return jsonify({"error": "Failed to fetch recent users"}), 500

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        # Verify admin user
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        # Get user distribution by role
        user_distribution = db.session.query(
            User.role,
            func.count(User.id).label('count')
        ).group_by(User.role).all()

        # Get job statistics
        total_jobs = Job.query.count()
        active_jobs = Job.query.filter_by(is_active=True).count()
        job_distribution = db.session.query(
            Job.job_type,
            func.count(Job.id).label('count')
        ).group_by(Job.job_type).all()

        # Get application status distribution
        app_status = db.session.query(
            Application.status,
            func.count(Application.id).label('count')
        ).group_by(Application.status).all()

        # Get monthly signups for the last 6 months
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        monthly_signups = db.session.query(
            func.date_trunc('month', User.created_at).label('month'),
            func.count(User.id).label('count')
        ).filter(User.created_at >= six_months_ago
        ).group_by('month').order_by('month').all()

        analytics = {
            "userDistribution": [{"role": role, "count": count} for role, count in user_distribution],
            "jobStats": {
                "total": total_jobs,
                "active": active_jobs,
                "byType": [{"type": job_type, "count": count} for job_type, count in job_distribution]
            },
            "applicationStats": [{"status": status, "count": count} for status, count in app_status],
            "monthlySignups": [{"month": month.strftime('%Y-%m'), "count": count} for month, count in monthly_signups]
        }

        return jsonify(analytics), 200

    except Exception as e:
        logger.error(f"Error fetching analytics: {str(e)}")
        return jsonify({"error": "Failed to fetch analytics"}), 500