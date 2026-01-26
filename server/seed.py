# seed.py
import os
import sys
from datetime import datetime, timedelta
import random
import json
from faker import Faker
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

# Add the server directory to the Python path
server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'server'))
sys.path.append(server_dir)

from app import create_app
from extensions import db
from models.models import User, Profile, Student, Company, Job, Application, SavedJob, Notification, Interview, SavedCandidate, CompanyReview, Message, Conversation, Participant, Share, SavedSearch

# Initialize Flask app
app = create_app()
app.app_context().push()

# Initialize Faker
fake = Faker()

def create_admin():
    """Create an admin user"""
    try:
        # Check if admin already exists
        if User.query.filter_by(email='admin@studentu.com').first():
            print("Admin user already exists")
            return User.query.filter_by(email='admin@studentu.com').first()

        admin = User(
            email='admin@studentu.com',
            first_name='Admin',
            last_name='System',
            role='admin',
            password_hash=generate_password_hash('admin123'),
            is_verified=True,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.session.add(admin)
        db.session.commit()

        # Create admin profile
        profile = Profile(
            user_id=admin.id,
            headline='System Administrator',
            bio='I manage the StudentU platform and ensure everything runs smoothly.',
            location='Nairobi, Kenya',
            phone='+254700000000',
            website='https://studentu.com',
            profile_picture='https://ui-avatars.com/api/?name=Admin+System&background=random',
            created_at=datetime.utcnow()
        )
        db.session.add(profile)
        db.session.commit()

        print("Admin user created successfully")
        return admin

    except IntegrityError as e:
        db.session.rollback()
        print(f"Error creating admin: {str(e)}")
        return None
    except Exception as e:
        db.session.rollback()
        print(f"Unexpected error: {str(e)}")
        return None

def main():
    """Main function to seed the database"""
    try:
        print("Starting database seeding...")
        
        # Create tables if they don't exist
        print("Creating database tables...")
        db.create_all()
        
        # Create admin user
        print("Creating admin user...")
        admin = create_admin()
        
        if not admin:
            print("Failed to create admin user")
            return
        
        print("Database seeding completed successfully!")
        
    except Exception as e:
        print(f"Error during database seeding: {str(e)}")
        db.session.rollback()
    finally:
        db.session.close()

if __name__ == '__main__':
    main()