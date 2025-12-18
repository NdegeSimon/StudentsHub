from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from datetime import timedelta, datetime
from functools import wraps
import re

from models.models import db, User, Job, Company, Application, Student, JobType, EducationLevel

# ----------------- Blueprints -----------------
bp = Blueprint('api', __name__, url_prefix='/api')

# ----------------- Decorators -----------------
def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = User.query.get(get_jwt_identity())
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return wrapper

def company_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = User.query.get(get_jwt_identity())
        if not user or user.role != 'company':
            return jsonify({'error': 'Company access required'}), 403
        return f(*args, **kwargs)
    return wrapper

def student_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = User.query.get(get_jwt_identity())
        if not user or user.role != 'student':
            return jsonify({'error': 'Student access required'}), 403
        return f(*args, **kwargs)
    return wrapper

# ----------------- Auth Routes -----------------
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(k in data for k in ['email', 'password', 'first_name', 'last_name', 'role']):
        return jsonify({'error': 'Missing required fields'}), 400
    if not re.match(EMAIL_REGEX, data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    if len(data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    if data['role'] not in ['student', 'company', 'government']:
        return jsonify({'error': 'Invalid role'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    try:
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

        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
        return jsonify({
            'message': 'User registered successfully',
            'user': {'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name, 'role': user.role},
            'access_token': access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Email and password are required'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403

    user.update_last_login()
    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name, 'role': user.role}
    }), 200


@bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'id': user.id, 'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name,
                    'role': user.role, 'phone': user.phone, 'profile_image': user.profile_image}), 200


@bp.route('/auth/update-password', methods=['PUT'])
@jwt_required()
def update_password():
    user = User.query.get(get_jwt_identity())
    data = request.get_json()
    if not all(k in data for k in ['current_password', 'new_password']):
        return jsonify({'error': 'Current and new password are required'}), 400
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

# ----------------- User Routes -----------------
@bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'email': u.email, 'first_name': u.first_name, 'last_name': u.last_name,
                     'role': u.role, 'is_active': u.is_active} for u in users]), 200


@bp.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user_operations(user_id):
    current_user = User.query.get(get_jwt_identity())
    target_user = User.query.get_or_404(user_id)

    if request.method == 'GET':
        if current_user.id != target_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        return jsonify({'id': target_user.id, 'email': target_user.email, 'first_name': target_user.first_name,
                        'last_name': target_user.last_name, 'role': target_user.role, 'phone': target_user.phone,
                        'is_active': target_user.is_active}), 200

    elif request.method == 'PUT':
        if current_user.id != target_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        data = request.get_json()
        for field in ['first_name', 'last_name', 'phone']:
            if field in data:
                setattr(target_user, field, data[field])
        if 'role' in data and current_user.role == 'admin':
            target_user.role = data['role']
        if 'is_active' in data and current_user.role == 'admin':
            target_user.is_active = data['is_active']
        try:
            db.session.commit()
            return jsonify({'message': 'User updated successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    elif request.method == 'DELETE':
        if current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        if current_user.id == target_user.id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        try:
            db.session.delete(target_user)
            db.session.commit()
            return jsonify({'message': 'User deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

# ----------------- Job Routes -----------------
@bp.route('/jobs', methods=['GET', 'POST'])
@jwt_required(optional=True)
def jobs():
    if request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        query = Job.query.filter_by(is_active=True)

        search = request.args.get('search')
        if search:
            query = query.filter(Job.title.ilike(f'%{search}%'))
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        jobs_list = pagination.items
        return jsonify({'items': [{'id': j.id, 'title': j.title, 'company_id': j.company_id} for j in jobs_list],
                        'total': pagination.total, 'pages': pagination.pages, 'current_page': page}), 200

    elif request.method == 'POST':
        user = User.query.get(get_jwt_identity())
        if not user or user.role != 'company':
            return jsonify({'error': 'Company access required'}), 403
        data = request.get_json()
        company = Company.query.filter_by(user_id=user.id).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        job = Job(company_id=company.id, title=data['title'], description=data['description'],
                  job_type=JobType(data['job_type']), location=data['location'])
        db.session.add(job)
        db.session.commit()
        return jsonify({'message': 'Job created', 'job_id': job.id}), 201

# ----------------- Student Routes -----------------
@bp.route('/students', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def students():
    user = User.query.get(get_jwt_identity())
    if request.method == 'POST':
        if user.role != 'student':
            return jsonify({'error': 'Student access required'}), 403
        data = request.get_json()
        student = Student(user_id=user.id)
        student.date_of_birth = data.get('date_of_birth')
        student.gender = data.get('gender')
        student.institution = data.get('institution')
        db.session.add(student)
        db.session.commit()
        return jsonify({'message': 'Student profile created', 'student_id': student.id}), 201

    elif request.method == 'PUT':
        if user.role != 'student':
            return jsonify({'error': 'Student access required'}), 403
        student = Student.query.filter_by(user_id=user.id).first()
        if not student:
            return jsonify({'error': 'Student profile not found'}), 404
        data = request.get_json()
        for field in ['date_of_birth', 'gender', 'institution', 'bio', 'skills']:
            if field in data:
                setattr(student, field, data[field])
        db.session.commit()
        return jsonify({'message': 'Student profile updated'}), 200

    elif request.method == 'GET':
        if user.role not in ['admin', 'company'] and user.role != 'student':
            return jsonify({'error': 'Unauthorized'}), 403
        students_list = Student.query.all()
        return jsonify([{'id': s.id, 'user_id': s.user_id, 'name': f"{s.user.first_name} {s.user.last_name}"} for s in students_list]), 200
# ----------------- Company Routes -----------------
@bp.route('/companies', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def companies():
    user = User.query.get(get_jwt_identity())

    # Create company profile
    if request.method == 'POST':
        if user.role != 'company':
            return jsonify({'error': 'Company access required'}), 403
        data = request.get_json()
        company = Company(user_id=user.id, company_name=data.get('company_name'),
                          industry=data.get('industry'), website=data.get('website'),
                          logo_url=data.get('logo_url'))
        db.session.add(company)
        db.session.commit()
        return jsonify({'message': 'Company profile created', 'company_id': company.id}), 201

    # Update company profile
    elif request.method == 'PUT':
        if user.role != 'company':
            return jsonify({'error': 'Company access required'}), 403
        company = Company.query.filter_by(user_id=user.id).first()
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404
        data = request.get_json()
        for field in ['company_name', 'industry', 'website', 'logo_url']:
            if field in data:
                setattr(company, field, data[field])
        db.session.commit()
        return jsonify({'message': 'Company profile updated'}), 200

    # List all companies (admin and anyone can see basic info)
    elif request.method == 'GET':
        companies_list = Company.query.all()
        return jsonify([{'id': c.id, 'company_name': c.company_name, 'industry': c.industry,
                         'website': c.website, 'logo_url': c.logo_url} for c in companies_list]), 200


# Get a specific company by ID
@bp.route('/companies/<int:company_id>', methods=['GET'])
@jwt_required(optional=True)
def get_company(company_id):
    company = Company.query.get_or_404(company_id)
    return jsonify({'id': company.id, 'company_name': company.company_name, 'industry': company.industry,
                    'website': company.website, 'logo_url': company.logo_url}), 200


# Delete company profile (admin only)
@bp.route('/companies/<int:company_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_company(company_id):
    company = Company.query.get_or_404(company_id)
    try:
        db.session.delete(company)
        db.session.commit()
        return jsonify({'message': 'Company deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
