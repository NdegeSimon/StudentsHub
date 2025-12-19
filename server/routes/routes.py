from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token
)
from datetime import timedelta, datetime
from functools import wraps
import re

from models.models import (
    db,
    User,
    Job,
    Company,
    Application,
    Student,
    JobType
)

bp = Blueprint("api", __name__, url_prefix="/api")

# =====================================================
# HELPERS
# =====================================================

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

def get_current_user():
    user_id = get_jwt_identity()
    if not user_id:
        return None
    return User.query.get(user_id)

def error(msg, code=400):
    return jsonify({"error": msg}), code

# =====================================================
# ROLE DECORATORS
# =====================================================

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != "admin":
            return error("Admin access required", 403)
        return fn(*args, **kwargs)
    return wrapper

def company_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != "company":
            return error("Company access required", 403)
        return fn(*args, **kwargs)
    return wrapper

def student_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != "student":
            return error("Student access required", 403)
        return fn(*args, **kwargs)
    return wrapper

# =====================================================
# AUTH
# =====================================================

@bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    required = ["email", "password", "first_name", "last_name", "role"]
    if not all(k in data for k in required):
        return error("Missing required fields")

    if not re.match(EMAIL_REGEX, data["email"]):
        return error("Invalid email")

    if len(data["password"]) < 8:
        return error("Password must be at least 8 characters")

    if data["role"] not in ["student", "company", "admin"]:
        return error("Invalid role")

    if User.query.filter_by(email=data["email"]).first():
        return error("Email already exists", 409)

    user = User(
        email=data["email"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        phone=data.get("phone", ""),
        role=data["role"],
        is_active=True
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }), 201


@bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    if "email" not in data or "password" not in data:
        return error("Email and password required")

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return error("Invalid credentials", 401)

    if not user.is_active:
        return error("Account disabled", 403)

    user.last_login = datetime.utcnow()
    db.session.commit()

    token = create_access_token(identity=user.id, expires_delta=timedelta(days=7))

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    })


@bp.route("/auth/me", methods=["GET"])
@jwt_required()
def me():
    user = get_current_user()
    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone
    })

# =====================================================
# JOBS
# =====================================================

@bp.route("/jobs", methods=["GET"])
@jwt_required(optional=True)
def list_jobs():
    query = Job.query.filter_by(is_active=True)

    search = request.args.get("search")
    if search:
        query = query.filter(Job.title.ilike(f"%{search}%"))

    jobs = query.order_by(Job.created_at.desc()).all()

    return jsonify([
        {
            "id": j.id,
            "title": j.title,
            "location": j.location,
            "job_type": j.job_type.value,
            "company_id": j.company_id
        } for j in jobs
    ])


@bp.route("/jobs", methods=["POST"])
@jwt_required()
@company_required
def create_job():
    user = get_current_user()
    data = request.get_json() or {}

    required = ["title", "description", "location", "job_type"]
    if not all(k in data for k in required):
        return error("Missing job fields")

    try:
        job_type = JobType(data["job_type"])
    except ValueError:
        return error("Invalid job type")

    company = Company.query.filter_by(user_id=user.id).first()
    if not company:
        return error("Company profile required", 400)

    job = Job(
        title=data["title"],
        description=data["description"],
        location=data["location"],
        job_type=job_type,
        company_id=company.id,
        is_active=True
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({"message": "Job created", "job_id": job.id}), 201


@bp.route("/jobs/<int:job_id>/close", methods=["PUT"])
@jwt_required()
@company_required
def close_job(job_id):
    user = get_current_user()
    company = Company.query.filter_by(user_id=user.id).first()

    job = Job.query.filter_by(id=job_id, company_id=company.id).first()
    if not job:
        return error("Job not found", 404)

    job.is_active = False
    db.session.commit()

    return jsonify({"message": "Job closed"})

# =====================================================
# APPLICATIONS
# =====================================================

@bp.route("/jobs/<int:job_id>/apply", methods=["POST"])
@jwt_required()
@student_required
def apply_job(job_id):
    user = get_current_user()
    student = Student.query.filter_by(user_id=user.id).first()

    if not student:
        return error("Student profile required", 400)

    if Application.query.filter_by(job_id=job_id, student_id=student.id).first():
        return error("Already applied", 409)

    app = Application(
        job_id=job_id,
        student_id=student.id,
        applied_at=datetime.utcnow(),
        status="pending"
    )

    db.session.add(app)
    db.session.commit()

    return jsonify({"message": "Application submitted"}), 201


@bp.route("/students/applications", methods=["GET"])
@jwt_required()
@student_required
def my_applications():
    user = get_current_user()
    student = Student.query.filter_by(user_id=user.id).first()

    apps = Application.query.filter_by(student_id=student.id).all()

    return jsonify([
        {
            "job_id": a.job.id,
            "job_title": a.job.title,
            "company": a.job.company.company_name,
            "status": a.status,
            "applied_at": a.applied_at
        } for a in apps
    ])

# =====================================================
# COMPANY
# =====================================================

@bp.route("/companies", methods=["POST"])
@jwt_required()
@company_required
def create_company():
    user = get_current_user()
    data = request.get_json() or {}

    if Company.query.filter_by(user_id=user.id).first():
        return error("Company already exists", 409)

    company = Company(
        user_id=user.id,
        company_name=data.get("company_name"),
        industry=data.get("industry"),
        website=data.get("website"),
        logo_url=data.get("logo_url")
    )

    db.session.add(company)
    db.session.commit()

    return jsonify({"message": "Company profile created"}), 201


@bp.route("/companies/<int:company_id>/applications", methods=["GET"])
@jwt_required()
@company_required
def company_applications(company_id):
    user = get_current_user()
    company = Company.query.filter_by(user_id=user.id).first()

    if company.id != company_id:
        return error("Unauthorized", 403)

    jobs = Job.query.filter_by(company_id=company.id).all()
    job_ids = [j.id for j in jobs]

    apps = Application.query.filter(Application.job_id.in_(job_ids)).all()

    return jsonify([
        {
            "student": f"{a.student.user.first_name} {a.student.user.last_name}",
            "job_title": a.job.title,
            "status": a.status,
            "applied_at": a.applied_at
        } for a in apps
    ])
