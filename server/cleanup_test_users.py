from models import db, User, Company, Student, Profile, DashboardStats
from app import create_app

def cleanup_test_users():
    app = create_app()
    with app.app_context():
        # Find and delete test users
        test_emails = ['test_student@example.com', 'test_employer@example.com']
        
        for email in test_emails:
            user = User.query.filter_by(email=email).first()
            if user:
                print(f"Deleting user: {email} (ID: {user.id})")
                
                # Delete associated data first (handled by cascade)
                db.session.delete(user)
        
        # Commit the changes
        db.session.commit()
        print("Cleanup complete!")

if __name__ == "__main__":
    cleanup_test_users()
