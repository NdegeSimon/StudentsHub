from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv
import os

# Extensions
from extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)

    # Load environment variables
    load_dotenv()

    # App configuration
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "jwt-secret"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=7),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///studentshub.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # CORS configuration
    CORS(
        app,
        resources={r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"]
        }},
        supports_credentials=True,
    )

    # JWT error handlers
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(error):
        return jsonify({'error': 'Token expired'}), 401

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({'error': 'Missing token'}), 401

    # Import models AFTER db init
    from models.models import User

    # Blueprints
    from routes.routes import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Global error handlers
    @app.errorhandler(404)
    def not_found(_):
        return jsonify(error="Not found"), 404

    @app.errorhandler(401)
    def unauthorized(_):
        return jsonify(error="Unauthorized"), 401

    @app.errorhandler(500)
    def server_error(_):
        return jsonify(error="Server error"), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
