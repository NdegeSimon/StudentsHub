from .auth_routes import auth_bp
from .user_routes import user_bp
# ... import other blueprints

__all__ = ['auth_bp', 'user_bp', ...]  # List all blueprints here