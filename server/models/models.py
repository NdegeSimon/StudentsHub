from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from enum import Enum

from extensions import db

# Enums for status fields
class ApplicationStatus(Enum):
    PENDING = 'pending'
    REVIEWED = 'reviewed'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

class JobType(Enum):
    FULL_TIME = 'full_time'
    PART_TIME = 'part_time'
    INTERNSHIP = 'internship'
    CONTRACT = 'contract'
    TEMPORARY = 'temporary'

class EducationLevel(Enum):
    HIGHSCHOOL = 'highschool'
    DIPLOMA = 'diploma'
    BACHELORS = 'bachelors'
    MASTERS = 'masters'
    PHD = 'phd'

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False)  # 'student', 'company', 'admin', 'government'
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    profile_image = db.Column(db.String(255))  # URL to profile image
    
    # Relationships
    student = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    company = db.relationship('Company', backref='user', uselist=False, cascade='all, delete-orphan')
    government = db.relationship('Government', backref='user', uselist=False, cascade='all, delete-orphan')
    
    # Authentication methods
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    # Required for Flask-Login
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_anonymous(self):
        return False
    
    def get_id(self):
        return str(self.id)
    
    def __repr__(self):
        return f'<User {self.email}>'


class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    bio = db.Column(db.Text)
    education_level = db.Column(db.Enum(EducationLevel))
    institution = db.Column(db.String(150))
    field_of_study = db.Column(db.String(150))
    graduation_year = db.Column(db.Integer)
    skills = db.Column(db.JSON)  # Store as list of strings
    resume_url = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    
    # Relationships
    applications = db.relationship('Application', backref='applicant', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Student {self.id} - {self.user.email}>'


class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    company_name = db.Column(db.String(150), nullable=False)
    industry = db.Column(db.String(100))
    company_size = db.Column(db.String(50))
    website = db.Column(db.String(255))
    founded_year = db.Column(db.Integer)
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    
    # Relationships
    jobs = db.relationship('Job', backref='company', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Company {self.company_name}>'


class Government(db.Model):
    __tablename__ = 'governments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    department = db.Column(db.String(150), nullable=False)
    position = db.Column(db.String(100))
    office_address = db.Column(db.String(255))
    
    def __repr__(self):
        return f'<Government {self.department} - {self.user.email}>'

class ApplicationStatus(Enum):
    PENDING = 'pending'
    REVIEWED = 'reviewed'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    responsibilities = db.Column(db.Text)
    job_type = db.Column(db.Enum(JobType), nullable=False)
    location = db.Column(db.String(150))
    is_remote = db.Column(db.Boolean, default=False)
    salary_range_min = db.Column(db.Numeric(12, 2))
    salary_range_max = db.Column(db.Numeric(12, 2))
    application_deadline = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('Application', backref='job', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Job {self.title} - {self.company.company_name}>'


class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.String(255))
    status = db.Column(db.Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    notes = db.Column(db.Text)
    
    # Ensure one application per student per job
    __table_args__ = (
        db.UniqueConstraint('student_id', 'job_id', name='_student_job_uc'),
    )
    
    def __repr__(self):
        return f'<Application {self.id} - Student {self.student_id} for Job {self.job_id}>'