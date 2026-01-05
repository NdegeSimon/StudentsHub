# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv
import os

# Initialize extensions (NO early model imports!)
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

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

    # CRITICAL FIX: Import models ONLY here, inside app context
    with app.app_context():
        from models import User  # ← Now 100% safe
        # Import other models if you have them: Course, Job, etc.
        db.create_all()  # Create tables if they don't exist
        print("📊 Models loaded and database tables ensured.")

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
    app.run(host="0.0.0.0", port=5000, debug=True)