from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from datetime import timedelta
from dotenv import load_dotenv
from extensions import db, jwt, migrate
import os

# db = SQLAlchemy()
# jwt = JWTManager()
# migrate = Migrate()

def create_app():
    app = Flask(__name__)

    load_dotenv()

    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "jwt-secret"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=7),
        SQLALCHEMY_DATABASE_URI=os.getenv(
            "DATABASE_URL", "sqlite:///studentshub.db"
        ),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # CORS — UPDATED with all necessary permissions
    CORS(
        app,
        resources={r"/api/*": {
            "origins": "http://localhost:5173",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"]
        }},
        supports_credentials=True,
    )

    # Import models AFTER db init
    from models.models import User

    # Blueprints
    from routes.routes import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")  # ← Add /auth)

    # Errors
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