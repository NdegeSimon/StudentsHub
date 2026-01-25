# models.py
from datetime import datetime
from extensions import db  # Import db from extensions
from werkzeug.security import generate_password_hash, check_password_hash
import json

import jwt
import os
from extensions import db, bcrypt
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=True)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'employer'
    avatar = db.Column(db.String(500), nullable=True)
    is_online = db.Column(db.Boolean, default=False)
    socket_id = db.Column(db.String(100))
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    verification_token = db.Column(db.String(100), nullable=True)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete-orphan')
    dashboard_stats = db.relationship('DashboardStats', backref='user', uselist=False, cascade='all, delete-orphan')
    student = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    company = db.relationship('Company', backref='user', uselist=False, cascade='all, delete-orphan')
    posted_jobs = db.relationship('Job', backref='employer', lazy='dynamic', foreign_keys='Job.employer_id')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic')
    participants = db.relationship('Participant', back_populates='user', cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', backref='sender', lazy=True, foreign_keys='Message.sender_id')
    saved_searches = db.relationship('SavedSearch', backref='user', lazy='dynamic')
    shares_sent = db.relationship('Share', foreign_keys='Share.shared_by_id', backref='shared_by')
    shares_received = db.relationship('Share', foreign_keys='Share.shared_with_id', backref='shared_with')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_token(self):
        payload = {
            'user_id': self.id,
            'email': self.email,
            'role': self.role,
            'exp': datetime.utcnow().timestamp() + 86400  # 24 hours
        }
        return jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name or '',
            'name': f"{self.first_name} {self.last_name or ''}".strip(),
            'role': self.role,
            'avatar': self.avatar,
            'is_online': self.is_online,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Profile(db.Model):
    """Unified profile model for all users (students, employers, admins)"""
    __tablename__ = 'profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Basic profile information
    headline = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    website = db.Column(db.String(200), nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    cover_picture = db.Column(db.String(500), nullable=True)
    
    # Social links
    github = db.Column(db.String(200), nullable=True)
    linkedin = db.Column(db.String(200), nullable=True)
    twitter = db.Column(db.String(200), nullable=True)
    portfolio = db.Column(db.String(200), nullable=True)
    other_links = db.Column(db.JSON, nullable=True, default=dict)
    
    # For students (keeping compatibility with Student model)
    university = db.Column(db.String(200), nullable=True)
    major = db.Column(db.String(100), nullable=True)
    graduation_year = db.Column(db.Integer, nullable=True)
    gpa = db.Column(db.Float, nullable=True)
    degree_type = db.Column(db.String(50), nullable=True)
    
    # For employers (keeping compatibility with Company model)
    title = db.Column(db.String(100), nullable=True)  # e.g., "HR Manager", "Technical Recruiter"
    department = db.Column(db.String(100), nullable=True)
    
    # Job preferences (for students)
    looking_for_job = db.Column(db.Boolean, default=True)
    open_to_relocation = db.Column(db.Boolean, default=False)
    open_to_remote = db.Column(db.Boolean, default=True)
    preferred_locations = db.Column(db.JSON, nullable=True, default=list)
    preferred_roles = db.Column(db.JSON, nullable=True, default=list)
    expected_salary = db.Column(db.String(50), nullable=True)
    job_types = db.Column(db.JSON, nullable=True, default=list)
    availability = db.Column(db.String(50), nullable=True)  # immediate, 2weeks, 1month, etc.
    
    # Stats and visibility
    profile_views = db.Column(db.Integer, default=0)
    resume_views = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Privacy settings
    show_profile = db.Column(db.Boolean, default=True)
    show_contact_info = db.Column(db.Boolean, default=False)
    show_education = db.Column(db.Boolean, default=True)
    show_experience = db.Column(db.Boolean, default=True)
    show_skills = db.Column(db.Boolean, default=True)
    
    # Notification preferences
    email_notifications = db.Column(db.Boolean, default=True)
    job_alerts = db.Column(db.Boolean, default=True)
    connection_requests = db.Column(db.Boolean, default=True)
    message_notifications = db.Column(db.Boolean, default=True)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships to profile components
    skills = db.relationship('ProfileSkill', backref='profile', lazy=True, cascade='all, delete-orphan')
    educations = db.relationship('ProfileEducation', backref='profile', lazy=True, cascade='all, delete-orphan')
    experiences = db.relationship('ProfileExperience', backref='profile', lazy=True, cascade='all, delete-orphan')
    projects = db.relationship('ProfileProject', backref='profile', lazy=True, cascade='all, delete-orphan')
    certifications = db.relationship('ProfileCertification', backref='profile', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Profile {self.user_id}>'
    
    def to_dict(self, include_relationships=False):
        """Convert profile to dictionary for API responses"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'headline': self.headline,
            'bio': self.bio,
            'location': self.location,
            'phone': self.phone,
            'website': self.website,
            'profile_picture': self.profile_picture,
            'cover_picture': self.cover_picture,
            'github': self.github,
            'linkedin': self.linkedin,
            'twitter': self.twitter,
            'portfolio': self.portfolio,
            'other_links': self.other_links or {},
            'university': self.university,
            'major': self.major,
            'graduation_year': self.graduation_year,
            'gpa': self.gpa,
            'degree_type': self.degree_type,
            'title': self.title,
            'department': self.department,
            'looking_for_job': self.looking_for_job,
            'open_to_relocation': self.open_to_relocation,
            'open_to_remote': self.open_to_remote,
            'preferred_locations': self.preferred_locations or [],
            'preferred_roles': self.preferred_roles or [],
            'expected_salary': self.expected_salary,
            'job_types': self.job_types or [],
            'availability': self.availability,
            'profile_views': self.profile_views,
            'resume_views': self.resume_views,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'show_profile': self.show_profile,
            'show_contact_info': self.show_contact_info,
            'show_education': self.show_education,
            'show_experience': self.show_experience,
            'show_skills': self.show_skills,
            'email_notifications': self.email_notifications,
            'job_alerts': self.job_alerts,
            'connection_requests': self.connection_requests,
            'message_notifications': self.message_notifications,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if include_relationships:
            data['skills'] = [skill.to_dict() for skill in self.skills]
            data['educations'] = [edu.to_dict() for edu in self.educations]
            data['experiences'] = [exp.to_dict() for exp in self.experiences]
            data['projects'] = [project.to_dict() for project in self.projects]
            data['certifications'] = [cert.to_dict() for cert in self.certifications]
        
        return data
    
    def calculate_completion_percentage(self):
        """Calculate profile completion percentage"""
        # Fields to check for completion
        fields_to_check = [
            'headline', 'bio', 'location', 'profile_picture',
            'github', 'linkedin', 'university', 'major'
        ]
        
        completed = 0
        for field in fields_to_check:
            value = getattr(self, field)
            if value and (isinstance(value, str) and value.strip() != ''):
                completed += 1
        
        # Check for skills, education, experience
        if self.skills and len(self.skills) > 0:
            completed += 2
        if self.educations and len(self.educations) > 0:
            completed += 2
        if self.experiences and len(self.experiences) > 0:
            completed += 2
        
        # Max possible score: 8 basic fields + 6 for relationships = 14
        return min(100, int((completed / 14) * 100))


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
    applications = db.relationship('Application', backref='student', lazy='dynamic')
    saved_jobs = db.relationship('SavedJob', backref='student', lazy='dynamic')
    saved_by_companies = db.relationship('SavedCandidate', backref='student', lazy='dynamic')
    reviews = db.relationship('CompanyReview', backref='student', lazy='dynamic')

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
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
        
        if self.user and self.user.profile:
            data['profile'] = self.user.profile.to_dict(include_relationships=True)
        if self.user and self.user.dashboard_stats:
            data['dashboard_stats'] = self.user.dashboard_stats.to_dict()
            
        return data
    
    def save_job(self, job):
        """Save a job for later"""
        # Check if already saved
        existing_saved = SavedJob.query.filter_by(
            student_id=self.id,
            job_id=job.id
        ).first()
        
        if existing_saved:
            return False, "Job already saved"
        
        saved_job = SavedJob(
            student_id=self.id,
            job_id=job.id,
            saved_at=datetime.utcnow()
        )
        
        db.session.add(saved_job)
        
        try:
            db.session.commit()
            return True, "Job saved successfully"
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    def unsave_job(self, job):
        """Remove a saved job"""
        saved_job = SavedJob.query.filter_by(
            student_id=self.id,
            job_id=job.id
        ).first()
        
        if saved_job:
            db.session.delete(saved_job)
            db.session.commit()
            return True, "Job removed from saved list"
        return False, "Job not found in saved list"
    
    def get_saved_jobs(self):
        """Get all saved jobs for this student"""
        saved_jobs = SavedJob.query.filter_by(
            student_id=self.id
        ).order_by(SavedJob.saved_at.desc()).all()
        
        return [sj.job.to_dict() for sj in saved_jobs if sj.job]


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
    jobs = db.relationship('Job', backref='company', lazy='dynamic')
    saved_candidates = db.relationship('SavedCandidate', backref='company', lazy='dynamic')
    reviews = db.relationship('CompanyReview', backref='company', lazy='dynamic')

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'user': self.user.to_dict() if self.user else None,
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
        
        if self.user and self.user.profile:
            data['profile'] = self.user.profile.to_dict(include_relationships=True)
        if self.user and self.user.dashboard_stats:
            data['dashboard_stats'] = self.user.dashboard_stats.to_dict()
            
        return data
        
    def save_candidate(self, student):
        """Save a candidate for future reference"""
        # Check if already saved
        existing_saved = SavedCandidate.query.filter_by(
            company_id=self.id,
            student_id=student.id
        ).first()
        
        if existing_saved:
            return False, "Candidate already saved"
        
        saved_candidate = SavedCandidate(
            company_id=self.id,
            student_id=student.id,
            saved_at=datetime.utcnow()
        )
        
        db.session.add(saved_candidate)
        
        try:
            db.session.commit()
            return True, "Candidate saved successfully"
        except Exception as e:
            db.session.rollback()
            return False, str(e)


class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
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
    applications = db.relationship('Application', backref='job', lazy='dynamic')
    saved_by = db.relationship('SavedJob', backref='job', lazy='dynamic')
    analytics = db.relationship('JobAnalytics', backref='job', lazy='dynamic')
    shares = db.relationship('Share', backref='job', lazy='dynamic')
    conversations = db.relationship('Conversation', backref='job', lazy='dynamic', foreign_keys='Conversation.job_id')

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
    
    def apply(self, student, cover_letter="", resume_url=None):
        """Create an application for this job"""
        # Check if student has already applied
        existing_application = Application.query.filter_by(
            job_id=self.id,
            student_id=student.id
        ).first()
        
        if existing_application:
            return None, "You have already applied to this job"
        
        # Create new application
        application = Application(
            job_id=self.id,
            student_id=student.id,
            cover_letter=cover_letter,
            resume_url=resume_url or student.resume_url,
            status="pending",
            applied_at=datetime.utcnow()
        )
        
        db.session.add(application)
        
        # Create notification for company
        notification = Notification(
            user_id=self.company.user_id,
            notification_type="new_application",
            title="New Job Application",
            message=f"{student.user.first_name} applied for {self.title}",
            link_url=f"/company/jobs/{self.id}/applications",
            notification_metadata={
                "job_id": self.id,
                "job_title": self.title,
                "student_id": student.id,
                "student_name": f"{student.user.first_name} {student.user.last_name or ''}"
            }
        )
        db.session.add(notification)
        
        # Update job analytics
        analytics = JobAnalytics.query.filter_by(
            job_id=self.id,
            date=datetime.utcnow().date()
        ).first()
        
        if analytics:
            analytics.applications += 1
        else:
            analytics = JobAnalytics(
                job_id=self.id,
                date=datetime.utcnow().date(),
                applications=1
            )
            db.session.add(analytics)
        
        try:
            db.session.commit()
            return application, "Application submitted successfully"
        except Exception as e:
            db.session.rollback()
            return None, str(e)


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
    interviews = db.relationship('Interview', backref='application', lazy='dynamic')
    messages = db.relationship('Message', backref='application', lazy='dynamic', foreign_keys='Message.application_id')
    
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
    filters = db.Column(db.JSON)
    search_count = db.Column(db.Integer, default=1)
    last_searched = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
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
    
    __table_args__ = (
        db.UniqueConstraint('job_id', 'date', name='unique_job_analytics_per_day'),
    )


# Messaging System Models
class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=True)
    last_message = db.Column(db.String(500))
    last_message_at = db.Column(db.DateTime, default=datetime.utcnow)
    encryption_key = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    participants = db.relationship('Participant', back_populates='conversation', cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='conversation', lazy=True)


class Participant(db.Model):
    __tablename__ = 'participants'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'student' or 'employer'
    unread_count = db.Column(db.Integer, default=0)
    is_muted = db.Column(db.Boolean, default=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = db.relationship('Conversation', back_populates='participants')
    user = db.relationship('User', back_populates='participants')


class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # 'text', 'image', 'document', 'voice'
    file_url = db.Column(db.String(500))
    file_name = db.Column(db.String(255))
    file_size = db.Column(db.String(50))
    is_encrypted = db.Column(db.Boolean, default=True)
    encryption_key = db.Column(db.String(255))
    reactions = db.Column(JSON)  # Store as JSON: [{"emoji": "👍", "users": [1, 2]}]
    reply_to_id = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable=True)
    status = db.Column(db.String(20), default='sent')  # 'sent', 'delivered', 'read'
    read_by = db.Column(JSON)  # Store user IDs who read the message
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Additional foreign key for application-related messages
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'), nullable=True)
    
    # Self-referential relationship for replies
    replies = db.relationship('Message', backref=db.backref('parent', remote_side=[id]), lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'sender_id': self.sender_id,
            'sender': self.sender.to_dict() if self.sender else None,
            'content': self.content,
            'message_type': self.message_type,
            'file_url': self.file_url,
            'file_name': self.file_name,
            'file_size': self.file_size,
            'reactions': self.reactions or [],
            'reply_to_id': self.reply_to_id,
            'status': self.status,
            'read_by': self.read_by or [],
            'created_at': self.created_at.isoformat()
        }


class Share(db.Model):
    __tablename__ = 'shares'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    shared_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shared_with_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    shared_with_email = db.Column(db.String(255), nullable=True)
    share_type = db.Column(db.String(50), nullable=False)  # 'email', 'link', 'social'
    share_token = db.Column(db.String(255), unique=True, nullable=True)
    message = db.Column(db.Text, nullable=True)
    shared_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    viewed = db.Column(db.Boolean, default=False)
    viewed_at = db.Column(db.DateTime, nullable=True)


class DashboardStats(db.Model):
    """Dashboard statistics for users"""
    __tablename__ = 'dashboard_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    
    # Application stats
    total_applications = db.Column(db.Integer, default=0)
    pending_applications = db.Column(db.Integer, default=0)
    interview_applications = db.Column(db.Integer, default=0)
    rejected_applications = db.Column(db.Integer, default=0)
    accepted_applications = db.Column(db.Integer, default=0)
    
    # Job stats
    saved_jobs = db.Column(db.Integer, default=0)
    viewed_jobs = db.Column(db.Integer, default=0)
    recommended_jobs = db.Column(db.Integer, default=0)
    
    # Profile stats
    profile_views = db.Column(db.Integer, default=0)
    profile_completion = db.Column(db.Integer, default=0)  # Percentage
    
    # Messages
    unread_messages = db.Column(db.Integer, default=0)
    
    # For employers
    posted_jobs = db.Column(db.Integer, default=0)
    active_jobs = db.Column(db.Integer, default=0)
    total_applicants = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'applications': {
                'total': self.total_applications,
                'pending': self.pending_applications,
                'interview': self.interview_applications,
                'rejected': self.rejected_applications,
                'accepted': self.accepted_applications
            },
            'jobs': {
                'saved': self.saved_jobs,
                'viewed': self.viewed_jobs,
                'recommended': self.recommended_jobs
            },
            'profile': {
                'views': self.profile_views,
                'completion': self.profile_completion
            },
            'messages': {
                'unread': self.unread_messages
            },
            'employer': {
                'posted_jobs': self.posted_jobs,
                'active_jobs': self.active_jobs,
                'total_applicants': self.total_applicants
            }
        }


class ProfileSkill(db.Model):
    """Skills for user profiles"""
    __tablename__ = 'profile_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(50), nullable=False)  # Beginner, Intermediate, Advanced, Expert
    years_of_experience = db.Column(db.Integer, nullable=True)
    verified = db.Column(db.Boolean, default=False)
    endorsements_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProfileSkill {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'years_of_experience': self.years_of_experience,
            'verified': self.verified,
            'endorsements_count': self.endorsements_count,
            'created_at': self.created_at.isoformat()
        }


class ProfileEducation(db.Model):
    """Education history for profiles"""
    __tablename__ = 'profile_educations'
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    institution = db.Column(db.String(200), nullable=False)
    degree = db.Column(db.String(100), nullable=False)
    field_of_study = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    gpa = db.Column(db.Float, nullable=True)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    is_current = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProfileEducation {self.institution}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'institution': self.institution,
            'degree': self.degree,
            'field_of_study': self.field_of_study,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'gpa': self.gpa,
            'description': self.description,
            'location': self.location,
            'is_current': self.is_current,
            'created_at': self.created_at.isoformat()
        }


class ProfileExperience(db.Model):
    """Work experience for profiles"""
    __tablename__ = 'profile_experiences'
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100), nullable=True)
    employment_type = db.Column(db.String(50), nullable=True)  # Full-time, Part-time, Internship, Contract
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    currently_working = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text, nullable=True)
    skills_used = db.Column(db.JSON, nullable=True, default=list)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProfileExperience {self.title} at {self.company}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'employment_type': self.employment_type,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'currently_working': self.currently_working,
            'description': self.description,
            'skills_used': self.skills_used or [],
            'created_at': self.created_at.isoformat()
        }


class ProfileProject(db.Model):
    """Projects for profiles"""
    __tablename__ = 'profile_projects'
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    technologies = db.Column(db.JSON, nullable=True, default=list)
    github_url = db.Column(db.String(500), nullable=True)
    live_url = db.Column(db.String(500), nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    is_current = db.Column(db.Boolean, default=False)
    team_size = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProfileProject {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'technologies': self.technologies or [],
            'github_url': self.github_url,
            'live_url': self.live_url,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'is_current': self.is_current,
            'team_size': self.team_size,
            'created_at': self.created_at.isoformat()
        }


class ProfileCertification(db.Model):
    """Certifications for profiles"""
    __tablename__ = 'profile_certifications'
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    issuing_organization = db.Column(db.String(200), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date, nullable=True)
    credential_id = db.Column(db.String(100), nullable=True)
    credential_url = db.Column(db.String(500), nullable=True)
    skills = db.Column(db.JSON, nullable=True, default=list)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProfileCertification {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'issuing_organization': self.issuing_organization,
            'issue_date': self.issue_date.isoformat() if self.issue_date else None,
            'expiration_date': self.expiration_date.isoformat() if self.expiration_date else None,
            'credential_id': self.credential_id,
            'credential_url': self.credential_url,
            'skills': self.skills or [],
            'created_at': self.created_at.isoformat()
        }