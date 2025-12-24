from app import create_app

def init_db():
    app = create_app()
    with app.app_context():
        from models import db
        
        # Drop all tables
        print("Dropping all tables...")
        db.drop_all()
        
        # Create all tables
        print("Creating all tables...")
        db.create_all()
        
        print("✅ Database initialized successfully!")

if __name__ == "__main__":
    init_db()
