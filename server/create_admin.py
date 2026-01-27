# create_admin.py
from app import create_app, db
from models.models import User

def create_admin():
    app = create_app()
    with app.app_context():
        # Check if admin already exists
        admin = User.query.filter_by(role='admin').first()
        if admin:
            print(f"Admin user already exists: {admin.email}")
            return
        
        # Create admin user
        admin = User(
            email='admin@studentshub.com',
            first_name='Admin',
            last_name='User',
            role='admin',
            is_verified=True,
            is_active=True
        )
        admin.set_password('Admin@123')  # Change this to a secure password
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")

if __name__ == '__main__':
    create_admin()