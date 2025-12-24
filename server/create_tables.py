from app import create_app, db

def create_database():
    app = create_app()
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully!")

if __name__ == "__main__":
    create_database()
