# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import timedelta
from dotenv import load_dotenv
import os

# Import extensions from extensions.py
from extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)
    load_dotenv()

    # Configuration
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret-key-change-in-production"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=7),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///studentshub.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Initialize database
    with app.app_context():
        # Import models inside app context to avoid circular imports
        from models import User, Student, Company, Job, Application
        # This will create all database tables if they don't exist
        db.create_all()
        print("📊 Database tables ensured.")

    # CORS
    CORS(app, origins="http://localhost:5173", supports_credentials=True)

    # Test route
    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({"status": "success", "message": "Backend is working!"})

    # Register blueprints (safe because imported after models)
    try:
        from routes.routes import bp as auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api')
        print("✅ Auth blueprint registered")
    except Exception as e:
        print("⚠️ Could not register blueprint:", e)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    app = create_app()

    print("🚀 Students Hub API starting...")
    print("🔗 Available at: http://localhost:5000")
    app.run(host="0.0.0.0", port=5001, debug=True)