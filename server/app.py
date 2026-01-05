# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv
import os

# Initialize extensions without app
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    load_dotenv()

    # =======================
    # Configuration
    # =======================
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret-key-change-in-production"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=7),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///studentshub.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Initialize extensions with the app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # =======================
    # Configure CORS
    # =======================
    CORS(app, origins="http://localhost:5173", supports_credentials=True)

    # =======================
    # Test route
    # =======================
    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({"status": "success", "message": "Backend is working!"})

    # =======================
    # Register blueprints
    # =======================
    try:
        from routes.routes import bp as auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api')
    except Exception as e:
        print("⚠️ Could not register blueprint:", e)

    # =======================
    # Error handlers
    # =======================
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": str(error)}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error", "message": str(error)}), 500

    return app

# =======================
# Run server
# =======================
if __name__ == "__main__":
    app = create_app()

    # Ensure database is initialized before starting
    with app.app_context():
        try:
            db.create_all()
            print("📊 Database tables created successfully!")
        except Exception as e:
            print("⚠️ Error creating database tables:", e)

    print("🚀 Students Hub API starting...")
    print("🔗 Available at: http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
