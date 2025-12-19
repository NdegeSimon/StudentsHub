from app import app
from models.models import (
    db,
    User,
    Student,
    Company,
    Job,
    Application,
)
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

def seed_users():
    print("🌱 Seeding users...")

    admin = User(
        email="admin@studentshub.com",
        first_name="System",
        last_name="Admin",
        role="admin",
        is_active=True,
        password_hash=generate_password_hash("admin1234")
    )

    student_user = User(
        email="student@studentshub.com",
        first_name="John",
        last_name="Doe",
        role="student",
        is_active=True,
        password_hash=generate_password_hash("student1234")
    )

    company_user = User(
        email="company@studentshub.com",
        first_name="Jane",
        last_name="Employer",
        role="company",
        is_active=True,
        password_hash=generate_password_hash("company1234")
    )

    db.session.add_all([admin, student_user, company_user])
    db.session.commit()

    return admin, student_user, company_user


def seed_students(student_user):
    print("🌱 Seeding students...")

    student = Student(
        user_id=student_user.id,
        gender="male",
        institution="University of Nairobi",
        field_of_study="Computer Science",
        graduation_year=2026,
        skills=["HTML", "CSS", "JavaScript", "Python"],
        bio="Aspiring software engineer",
        country="Kenya"
    )

    db.session.add(student)
    db.session.commit()

    return student


def seed_companies(company_user):
    print("🌱 Seeding companies...")

    company = Company(
        user_id=company_user.id,
        company_name="TechNova Ltd",
        industry="Technology",
        location="Nairobi",
        website="https://technova.co.ke"
    )

    db.session.add(company)
    db.session.commit()

    return company


def seed_jobs(company):
    print("🌱 Seeding jobs...")

    jobs = [
        Job(
            company_id=company.id,
            title="Junior Frontend Developer",
            description="Build and maintain web UIs",
            requirements="HTML, CSS, JavaScript",
            job_type="full_time",
            location="Nairobi",
            is_remote=True,
            is_active=True,
            created_at=datetime.utcnow()
        ),
        Job(
            company_id=company.id,
            title="Backend Intern (Python)",
            description="Assist with backend APIs",
            requirements="Python, Flask",
            job_type="internship",
            location="Remote",
            is_remote=True,
            is_active=True,
            created_at=datetime.utcnow()
        )
    ]

    db.session.add_all(jobs)
    db.session.commit()

    return jobs


def seed_applications(student, jobs):
    print("🌱 Seeding applications...")

    application = Application(
        student_id=student.id,
        job_id=jobs[0].id,
        status="pending",
        applied_at=datetime.utcnow()
    )

    db.session.add(application)
    db.session.commit()


def run_seed():
    with app.app_context():
        print("🚀 Running database seed...")

        # Optional: wipe tables (USE CAREFULLY)
        # db.drop_all()
        # db.create_all()

        admin, student_user, company_user = seed_users()
        student = seed_students(student_user)
        company = seed_companies(company_user)
        jobs = seed_jobs(company)
        seed_applications(student, jobs)

        print("✅ Seeding complete.")


if __name__ == "__main__":
    run_seed()
