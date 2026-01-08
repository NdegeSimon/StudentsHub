# models.py

from datetime import datetime
from extensions import db  # Import db from extensions
from werkzeug.security import generate_password_hash, check_password_hash
import json


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=True)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'employer'
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), nullable=True)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student_profile = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    company_profile = db.relationship('Company', backref='user', uselist=False, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name or '',
            'role': self.role,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat()
        }


class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    location = db.Column(db.String(200))
    address = db.Column(db.String(200))
    bio = db.Column(db.Text)
    education = db.Column(db.JSON)  # Changed to JSON for structured data
    work_experience = db.Column(db.JSON)  # Changed to JSON
    skills = db.Column(db.JSON)  # Changed to JSON for array of skills
    years_of_experience = db.Column(db.Integer, default=0)
    resume_url = db.Column(db.String(255))
    profile_picture = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))
    portfolio_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    preferred_job_types = db.Column(db.JSON)  # Array of preferred job types
    expected_salary_min = db.Column(db.Integer)
    expected_salary_max = db.Column(db.Integer)
    availability = db.Column(db.String(50))  # immediate, 2weeks, 1month, etc.
    is_profile_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    applications = db.relationship('Application', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    saved_jobs = db.relationship('SavedJob', backref='student', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'education': self.education,
            'work_experience': self.work_experience,
            'skills': self.skills,
            'years_of_experience': self.years_of_experience,
            'resume_url': self.resume_url,
            'profile_picture': self.profile_picture,
            'linkedin_url': self.linkedin_url,
            'portfolio_url': self.portfolio_url,
            'github_url': self.github_url,
            'preferred_job_types': self.preferred_job_types,
            'availability': self.availability
        }


class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    industry = db.Column(db.String(100))
    company_size = db.Column(db.String(50))  # 1-10, 11-50, 51-200, 201-500, 500+
    founded_year = db.Column(db.Integer)
    website = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(200))
    address = db.Column(db.String(200))
    logo_url = db.Column(db.String(255))
    cover_image_url = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))
    twitter_url = db.Column(db.String(255))
    verification_status = db.Column(db.String(20), default='unverified')  # verified, unverified, pending
    benefits = db.Column(db.JSON)  # Array of company benefits
    culture_values = db.Column(db.JSON)  # Array of culture values
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    jobs = db.relationship('Job', backref='company', lazy='dynamic', cascade='all, delete-orphan')
    saved_candidates = db.relationship('SavedCandidate', backref='company', lazy='dynamic', cascade='all, delete-orphan')
    reviews = db.relationship('CompanyReview', backref='company', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'description': self.description,
            'industry': self.industry,
            'company_size': self.company_size,
            'founded_year': self.founded_year,
            'website': self.website,
            'phone': self.phone,
            'location': self.location,
            'logo_url': self.logo_url,
            'cover_image_url': self.cover_image_url,
            'verification_status': self.verification_status,
            'benefits': self.benefits,
            'culture_values': self.culture_values
        }


class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    responsibilities = db.Column(db.Text)
    location = db.Column(db.String(100))
    job_type = db.Column(db.String(50))  # Full-time, Part-time, Internship, Contract
    work_mode = db.Column(db.String(50))  # Remote, Hybrid, On-site
    department = db.Column(db.String(100))
    experience_level = db.Column(db.String(50))  # Entry, Mid, Senior, Lead
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    salary_currency = db.Column(db.String(10), default='USD')
    required_skills = db.Column(db.JSON)  # Array of required skills
    preferred_skills = db.Column(db.JSON)  # Array of preferred skills
    benefits = db.Column(db.JSON)  # Array of job-specific benefits
    application_deadline = db.Column(db.DateTime)
    positions_available = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    views_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    applications = db.relationship('Application', backref='job', lazy='dynamic', cascade='all, delete-orphan')
    saved_by = db.relationship('SavedJob', backref='job', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_company=True):
        data = {
            'id': self.id,
            'company_id': self.company_id,
            'title': self.title,
            'description': self.description,
            'requirements': self.requirements,
            'responsibilities': self.responsibilities,
            'location': self.location,
            'job_type': self.job_type,
            'work_mode': self.work_mode,
            'department': self.department,
            'experience_level': self.experience_level,
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'salary_currency': self.salary_currency,
            'required_skills': self.required_skills,
            'preferred_skills': self.preferred_skills,
            'benefits': self.benefits,
            'application_deadline': self.application_deadline.isoformat() if self.application_deadline else None,
            'positions_available': self.positions_available,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'views_count': self.views_count,
            'applicants_count': self.applications.count(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_company and self.company:
            data['company'] = {
                'id': self.company.id,
                'name': self.company.company_name,
                'logo_url': self.company.logo_url,
                'location': self.company.location
            }
        
        return data


class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.String(255))  # Can be different from profile resume
    status = db.Column(db.String(50), default='new', index=True)  # new, under_review, interview_scheduled, rejected, hired
    match_percentage = db.Column(db.Integer)  # Algorithm-calculated match score
    employer_notes = db.Column(db.Text)  # Private notes from employer
    rejection_reason = db.Column(db.Text)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    reviewed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    interviews = db.relationship('Interview', backref='application', lazy='dynamic', cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='application', lazy='dynamic', cascade='all, delete-orphan')

    # Ensure unique application per student per job
    __table_args__ = (
        db.UniqueConstraint('job_id', 'student_id', name='unique_job_student_application'),
    )

    def to_dict(self, include_student=True, include_job=True):
        data = {
            'id': self.id,
            'job_id': self.job_id,
            'student_id': self.student_id,
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'status': self.status,
            'match_percentage': self.match_percentage,
            'employer_notes': self.employer_notes,
            'applied_at': self.applied_at.isoformat(),
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'created_at': self.created_at.isoformat()
        }
        
        if include_student and self.student:
            data['student'] = {
                'id': self.student.id,
                'name': f"{self.student.user.first_name} {self.student.user.last_name or ''}".strip(),
                'email': self.student.user.email,
                'phone': self.student.phone,
                'location': self.student.location,
                'profile_picture': self.student.profile_picture,
                'years_of_experience': self.student.years_of_experience,
                'skills': self.student.skills
            }
        
        if include_job and self.job:
            data['job'] = {
                'id': self.job.id,
                'title': self.job.title,
                'company_name': self.job.company.company_name,
                'location': self.job.location
            }
        
        return data


class Interview(db.Model):
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    interview_type = db.Column(db.String(50))  # phone, video, in-person
    scheduled_at = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, default=60)
    location_or_link = db.Column(db.String(500))  # Physical location or video call link
    interviewer_name = db.Column(db.String(100))
    interviewer_email = db.Column(db.String(120))
    status = db.Column(db.String(50), default='scheduled')  # scheduled, completed, cancelled, rescheduled
    notes = db.Column(db.Text)  # Post-interview notes
    feedback = db.Column(db.Text)  # Structured feedback
    rating = db.Column(db.Integer)  # 1-5 rating
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'interview_type': self.interview_type,
            'scheduled_at': self.scheduled_at.isoformat(),
            'duration_minutes': self.duration_minutes,
            'location_or_link': self.location_or_link,
            'interviewer_name': self.interviewer_name,
            'status': self.status,
            'notes': self.notes,
            'rating': self.rating
        }


class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sender_type = db.Column(db.String(20), nullable=False)  # 'student' or 'employer'
    subject = db.Column(db.String(200))
    message_body = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False, index=True)
    attachments = db.Column(db.JSON)  # Array of attachment URLs
    sent_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    read_at = db.Column(db.DateTime)

    # Relationships
    sender = db.relationship('User', foreign_keys=[sender_id])

    def to_dict(self):
        return {
            'id': self.id,
            'application_id': self.application_id,
            'sender_id': self.sender_id,
            'sender_type': self.sender_type,
            'sender_name': f"{self.sender.first_name} {self.sender.last_name or ''}".strip(),
            'subject': self.subject,
            'message_body': self.message_body,
            'is_read': self.is_read,
            'attachments': self.attachments,
            'sent_at': self.sent_at.isoformat(),
            'read_at': self.read_at.isoformat() if self.read_at else None
        }


class SavedJob(db.Model):
    __tablename__ = 'saved_jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    notes = db.Column(db.Text)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Ensure unique saved job per student
    __table_args__ = (
        db.UniqueConstraint('student_id', 'job_id', name='unique_saved_job'),
    )


class SavedCandidate(db.Model):
    __tablename__ = 'saved_candidates'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    notes = db.Column(db.Text)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    student = db.relationship('Student', backref='saved_by_companies')

    # Ensure unique saved candidate per company
    __table_args__ = (
        db.UniqueConstraint('company_id', 'student_id', name='unique_saved_candidate'),
    )


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)  # new_application, interview_scheduled, message_received, etc.
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text)
    link_url = db.Column(db.String(500))  # Where to redirect when clicked
    is_read = db.Column(db.Boolean, default=False, index=True)
    notification_metadata = db.Column(db.JSON)  # Renamed from metadata to avoid conflict
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    read_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.notification_type,
            'title': self.title,
            'message': self.message,
            'link_url': self.link_url,
            'is_read': self.is_read,
            'metadata': self.notification_metadata,  # Map to original field name in API
            'created_at': self.created_at.isoformat(),
            'read_at': self.read_at.isoformat() if self.read_at else None
        }


class CompanyReview(db.Model):
    __tablename__ = 'company_reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    overall_rating = db.Column(db.Integer, nullable=False)  # 1-5
    work_life_balance_rating = db.Column(db.Integer)  # 1-5
    culture_rating = db.Column(db.Integer)  # 1-5
    benefits_rating = db.Column(db.Integer)  # 1-5
    management_rating = db.Column(db.Integer)  # 1-5
    review_title = db.Column(db.String(200))
    review_text = db.Column(db.Text)
    pros = db.Column(db.Text)
    cons = db.Column(db.Text)
    is_current_employee = db.Column(db.Boolean, default=False)
    employment_status = db.Column(db.String(50))  # current, former, intern
    is_anonymous = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False)  # For moderation
    helpful_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = db.relationship('Student', backref='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'overall_rating': self.overall_rating,
            'work_life_balance_rating': self.work_life_balance_rating,
            'culture_rating': self.culture_rating,
            'benefits_rating': self.benefits_rating,
            'management_rating': self.management_rating,
            'review_title': self.review_title,
            'review_text': self.review_text,
            'pros': self.pros,
            'cons': self.cons,
            'employment_status': self.employment_status,
            'is_anonymous': self.is_anonymous,
            'helpful_count': self.helpful_count,
            'created_at': self.created_at.isoformat()
        }


class SavedSearch(db.Model):
    __tablename__ = 'saved_searches'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    search_query = db.Column(db.String(255), nullable=False)
    filters = db.Column(db.JSON)  # Store additional filters as JSON
    search_count = db.Column(db.Integer, default=1)
    last_searched = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='saved_searches')
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'search_query', name='unique_user_search'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'search_query': self.search_query,
            'filters': self.filters or {},
            'search_count': self.search_count,
            'last_searched': self.last_searched.isoformat() if self.last_searched else None,
            'created_at': self.created_at.isoformat()
        }


class JobAnalytics(db.Model):
    __tablename__ = 'job_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, index=True)
    views = db.Column(db.Integer, default=0)
    applications = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    unique_visitors = db.Column(db.Integer, default=0)
    
    job = db.relationship('Job', backref='analytics')
    
    __table_args__ = (
        db.UniqueConstraint('job_id', 'date', name='unique_job_analytics_per_day'),
    )