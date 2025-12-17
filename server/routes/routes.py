from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import re
from ..models.models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation
    if not all(k in data for k in ['email', 'password', 'first_name', 'last_name', 'role']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if not re.match(EMAIL_REGEX, data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    if len(data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    
    if data['role'] not in ['student', 'company', 'government']:
        return jsonify({'error': 'Invalid role'}), 400
    
    # Check if user exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    try:
        # Create new user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone', ''),
            role=data['role']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            },
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
    
    # Update last login
    user.update_last_login()
    
    # Create access token
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'phone': user.phone,
        'profile_image': user.profile_image
    }), 200

@auth_bp.route('/update-password', methods=['PUT'])
@jwt_required()
def update_password():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not all(k in data for k in ['current_password', 'new_password']):
        return jsonify({'error': 'Current and new password are required'}), 400
    
    user = User.query.get(current_user_id)
    
    if not user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    if len(data['new_password']) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    
    try:
        user.set_password(data['new_password'])
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Add this to your main routes file
# from .routes.auth_routes import auth_bp
# app.register_blueprint(auth_bp)


from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.models import db, User
from functools import wraps

user_bp = Blueprint('user', __name__, url_prefix='/api/users')

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@user_bp.route('', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'is_active': user.is_active
    } for user in users]), 200

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    # Users can only access their own profile unless they're an admin
    if current_user_id != user.id and User.query.get(current_user_id).role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'role': user.role,
        'is_active': user.is_active,
        'profile_image': user.profile_image,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'last_login': user.last_login.isoformat() if user.last_login else None
    }), 200

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    user = User.query.get_or_404(user_id)
    
    # Users can only update their own profile unless they're an admin
    if current_user_id != user.id and current_user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Prevent role changes unless admin
    if 'role' in data and current_user.role != 'admin':
        return jsonify({'error': 'Only admins can change user roles'}), 403
    
    # Update fields
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
    if 'is_active' in data and current_user.role == 'admin':
        user.is_active = data['is_active']
    if 'role' in data and current_user.role == 'admin':
        user.role = data['role']
    
    try:
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    # Prevent deleting yourself
    current_user_id = get_jwt_identity()
    if current_user_id == user.id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Add this to your main routes file
# from .routes.user_routes import user_bp
# app.register_blueprint(user_bp)


from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from datetime import datetime
from ..models.models import db, Job, Company, Application, ApplicationStatus, JobType, User
from functools import wraps

job_bp = Blueprint('job', __name__, url_prefix='/api/jobs')

def company_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'company':
            return jsonify({'error': 'Company access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Get all jobs with filters
@job_bp.route('', methods=['GET'])
def get_jobs():
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Filters
    query = Job.query.filter_by(is_active=True)
    
    # Search by title or description
    search = request.args.get('search')
    if search:
        query = query.filter(
            or_(
                Job.title.ilike(f'%{search}%'),
                Job.description.ilike(f'%{search}%'),
                Job.requirements.ilike(f'%{search}%')
            )
        )
    
    # Filter by job type
    job_type = request.args.get('type')
    if job_type and job_type in [t.value for t in JobType]:
        query = query.filter_by(job_type=JobType(job_type))
    
    # Filter by location
    location = request.args.get('location')
    if location:
        query = query.filter(Job.location.ilike(f'%{location}%'))
    
    # Filter by remote
    remote = request.args.get('remote')
    if remote is not None:
        query = query.filter_by(is_remote=remote.lower() == 'true')
    
    # Filter by company
    company_id = request.args.get('company_id')
    if company_id:
        query = query.filter_by(company_id=company_id)
    
    # Filter by date (newest first by default)
    sort = request.args.get('sort', 'newest')
    if sort == 'newest':
        query = query.order_by(Job.created_at.desc())
    elif sort == 'oldest':
        query = query.order_by(Job.created_at.asc())
    
    # Execute query with pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    jobs = pagination.items
    
    return jsonify({
        'items': [{
            'id': job.id,
            'title': job.title,
            'company_id': job.company_id,
            'company_name': job.company.company_name,
            'job_type': job.job_type.value,
            'location': job.location,
            'is_remote': job.is_remote,
            'salary_range_min': float(job.salary_range_min) if job.salary_range_min else None,
            'salary_range_max': float(job.salary_range_max) if job.salary_range_max else None,
            'application_deadline': job.application_deadline.isoformat() if job.application_deadline else None,
            'created_at': job.created_at.isoformat(),
            'description_preview': job.description[:200] + '...' if job.description else ''
        } for job in jobs],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200

# Get job by ID
@job_bp.route('/<int:job_id>', methods=['GET'])
@jwt_required(optional=True)
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    # Check if user has already applied
    has_applied = False
    current_user_id = get_jwt_identity()
    if current_user_id:
        user = User.query.get(current_user_id)
        if user.role == 'student' and user.student:
            has_applied = Application.query.filter_by(
                job_id=job_id,
                student_id=user.student.id
            ).first() is not None
    
    return jsonify({
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'requirements': job.requirements,
        'responsibilities': job.responsibilities,
        'job_type': job.job_type.value,
        'location': job.location,
        'is_remote': job.is_remote,
        'salary_range_min': float(job.salary_range_min) if job.salary_range_min else None,
        'salary_range_max': float(job.salary_range_max) if job.salary_range_max else None,
        'application_deadline': job.application_deadline.isoformat() if job.application_deadline else None,
        'is_active': job.is_active,
        'created_at': job.created_at.isoformat(),
        'updated_at': job.updated_at.isoformat() if job.updated_at else None,
        'company': {
            'id': job.company.id,
            'company_name': job.company.company_name,
            'industry': job.company.industry,
            'website': job.company.website,
            'logo_url': job.company.logo_url
        },
        'has_applied': has_applied
    }), 200

# Create job (company only)
@job_bp.route('', methods=['POST'])
@jwt_required()
@company_required
def create_job():
    current_user = User.query.get(get_jwt_identity())
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'description', 'job_type', 'location']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Get company
    company = Company.query.filter_by(user_id=current_user.id).first()
    if not company:
        return jsonify({'error': 'Company profile not found'}), 404
    
    # Create job
    try:
        job = Job(
            company_id=company.id,
            title=data['title'],
            description=data['description'],
            requirements=data.get('requirements', ''),
            responsibilities=data.get('responsibilities', ''),
            job_type=JobType(data['job_type']),
            location=data['location'],
            is_remote=data.get('is_remote', False),
            salary_range_min=data.get('salary_range_min'),
            salary_range_max=data.get('salary_range_max'),
            application_deadline=datetime.fromisoformat(data['application_deadline']) if 'application_deadline' in data else None,
            is_active=data.get('is_active', True)
        )
        
        db.session.add(job)
        db.session.commit()
        
        return jsonify({
            'message': 'Job created successfully',
            'job_id': job.id
        }), 201
    except ValueError as e:
        return jsonify({'error': f'Invalid data: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Update job (company only)
@job_bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    current_user = User.query.get(get_jwt_identity())
    job = Job.query.get_or_404(job_id)
    
    # Check if user owns the job or is admin
    company = Company.query.filter_by(user_id=current_user.id).first()
    if not company or (current_user.role != 'admin' and job.company_id != company.id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        job.title = data['title']
    if 'description' in data:
        job.description = data['description']
    if 'requirements' in data:
        job.requirements = data['requirements']
    if 'responsibilities' in data:
        job.responsibilities = data['responsibilities']
    if 'job_type' in data:
        job.job_type = JobType(data['job_type'])
    if 'location' in data:
        job.location = data['location']
    if 'is_remote' in data:
        job.is_remote = data['is_remote']
    if 'salary_range_min' in data:
        job.salary_range_min = data['salary_range_min']
    if 'salary_range_max' in data:
        job.salary_range_max = data['salary_range_max']
    if 'application_deadline' in data:
        job.application_deadline = datetime.fromisoformat(data['application_deadline']) if data['application_deadline'] else None
    if 'is_active' in data and current_user.role == 'admin':
        job.is_active = data['is_active']
    
    try:
        db.session.commit()
        return jsonify({'message': 'Job updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete job (company or admin)
@job_bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    current_user = User.query.get(get_jwt_identity())
    job = Job.query.get_or_404(job_id)
    
    # Check if user owns the job or is admin
    company = Company.query.filter_by(user_id=current_user.id).first()
    if current_user.role != 'admin' and (not company or job.company_id != company.id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        db.session.delete(job)
        db.session.commit()
        return jsonify({'message': 'Job deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get applications for a job (company only)
@job_bp.route('/<int:job_id>/applications', methods=['GET'])
@jwt_required()
def get_job_applications(job_id):
    current_user = User.query.get(get_jwt_identity())
    job = Job.query.get_or_404(job_id)
    
    # Check if user owns the job or is admin
    company = Company.query.filter_by(user_id=current_user.id).first()
    if current_user.role != 'admin' and (not company or job.company_id != company.id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    applications = Application.query.filter_by(job_id=job_id).all()
    
    return jsonify([{
        'id': app.id,
        'student_id': app.student_id,
        'student_name': f"{app.applicant.user.first_name} {app.applicant.user.last_name}",
        'student_email': app.applicant.user.email,
        'status': app.status.value,
        'applied_at': app.applied_at.isoformat(),
        'resume_url': app.resume_url,
        'cover_letter': app.cover_letter
    } for app in applications]), 200

# Add this to your main routes file
# from .routes.job_routes import job_bp
# app.register_blueprint(job_bp)


from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.models import db, Student, User, Application, Job
from ..models.models import EducationLevel
from functools import wraps

student_bp = Blueprint('student', __name__, url_prefix='/api/students')

def student_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Create or update student profile
@student_bp.route('', methods=['POST', 'PUT'])
@jwt_required()
@student_required
def manage_student_profile():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields for creation
    if request.method == 'POST' and not all(k in data for k in ['date_of_birth', 'gender', 'institution']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Get or create student profile
    student = Student.query.filter_by(user_id=current_user_id).first()
    if not student and request.method == 'POST':
        student = Student(user_id=current_user_id)
        db.session.add(student)
    elif not student:
        return jsonify({'error': 'Student profile not found'}), 404
    
    # Update fields
    if 'date_of_birth' in data:
        student.date_of_birth = data['date_of_birth']
    if 'gender' in data:
        student.gender = data['gender']
    if 'address' in data:
        student.address = data['address']
    if 'city' in data:
        student.city = data['city']
    if 'country' in data:
        student.country = data['country']
    if 'bio' in data:
        student.bio = data['bio']
    if 'education_level' in data:
        student.education_level = EducationLevel(data['education_level'])
    if 'institution' in data:
        student.institution = data['institution']
    if 'field_of_study' in data:
        student.field_of_study = data['field_of_study']
    if 'graduation_year' in data:
        student.graduation_year = data['graduation_year']
    if 'skills' in data and isinstance(data['skills'], list):
        student.skills = data['skills']
    if 'resume_url' in data:
        student.resume_url = data['resume_url']
    if 'linkedin_url' in data:
        student.linkedin_url = data['linkedin_url']
    if 'github_url' in data:
        student.github_url = data['github_url']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Student profile updated successfully',
            'student_id': student.id
        }), 200 if request.method == 'PUT' else 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get student profile
@student_bp.route('', methods=['GET'])
@jwt_required()
def get_student_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # If user is not an admin, they can only view their own profile
    student_user_id = request.args.get('user_id', current_user_id)
    if user.role != 'admin' and str(student_user_id) != str(current_user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    student = Student.query.filter_by(user_id=student_user_id).first()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
    
    return jsonify({
        'id': student.id,
        'user_id': student.user_id,
        'date_of_birth': student.date_of_birth.isoformat() if student.date_of_birth else None,
        'gender': student.gender,
        'address': student.address,
        'city': student.city,
        'country': student.country,
        'bio': student.bio,
        'education_level': student.education_level.value if student.education_level else None,
        'institution': student.institution,
        'field_of_study': student.field_of_study,
        'graduation_year': student.graduation_year,
        'skills': student.skills or [],
        'resume_url': student.resume_url,
        'linkedin_url': student.linkedin_url,
        'github_url': student.github_url,
        'user': {
            'email': student.user.email,
            'first_name': student.user.first_name,
            'last_name': student.user.last_name,
            'phone': student.user.phone,
            'profile_image': student.user.profile_image
        }
    }), 200

# Get student's applications
@student_bp.route('/<int:student_id>/applications', methods=['GET'])
@jwt_required()
def get_student_applications(student_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Users can only view their own applications unless they're an admin
    if user.role != 'admin' and str(student_id) != str(Student.query.filter_by(user_id=current_user_id).first().id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    applications = Application.query.filter_by(student_id=student_id).all()
    
    return jsonify([{
        'id': app.id,
        'job_id': app.job_id,
        'job_title': app.job.title,
        'company_name': app.job.company.company_name,
        'status': app.status.value,
        'applied_at': app.applied_at.isoformat(),
        'updated_at': app.updated_at.isoformat() if app.updated_at else None
    } for app in applications]), 200

# Get all students (for admin and companies)
@student_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_students():
    current_user = User.query.get(get_jwt_identity())
    
    # Only admin and companies can list all students
    if current_user.role not in ['admin', 'company']:
        return jsonify({'error': 'Unauthorized'}), 403
    
    students = Student.query.all()
    
    return jsonify([{
        'id': s.id,
        'user_id': s.user_id,
        'name': f"{s.user.first_name} {s.user.last_name}",
        'email': s.user.email,
        'institution': s.institution,
        'field_of_study': s.field_of_study,
        'graduation_year': s.graduation_year,
        'skills': s.skills or []
    } for s in students]), 200

# Add this to your main routes file
# from .routes.student_routes import student_bp
# app.register_blueprint(student_bp)
