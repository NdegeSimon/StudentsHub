from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_mail import Mail

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
bcrypt = Bcrypt()
socketio = SocketIO(cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173"])
mail = Mail()
