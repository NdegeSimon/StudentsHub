# This file makes Python treat the directory as a package
from flask_sqlalchemy import SQLAlchemy
from app import db
# Create db instance that will be initialized with the app


# Import models after db is created to avoid circular imports
from .models import *  # This will import all models that inherit from db.Model