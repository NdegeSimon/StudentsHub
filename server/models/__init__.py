# This file makes Python treat the directory as a package
from flask_sqlalchemy import SQLAlchemy

# Create db instance that will be initialized with the app
db = SQLAlchemy()

# Import models after db is created to avoid circular imports
# Import models here to make them available when importing from models package
from .models import *  # This will import all models that inherit from db.Model