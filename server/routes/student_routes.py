from flask import Blueprint, jsonify, request
from models.models import Student, db
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

student_bp = Blueprint('student', __name__)

@student_bp.route('/', methods=['GET'])
def get_students():
    """
    Get all students
    """
    try:
        students = Student.query.all()
        return jsonify([student.to_dict() for student in students]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """
    Get a specific student by ID
    """
    try:
        student = Student.query.get_or_404(student_id)
        return jsonify(student.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@student_bp.route('/', methods=['POST'])
@jwt_required()
def create_student():
    """
    Create a new student
    """
    try:
        data = request.get_json()
        student = Student(**data)
        db.session.add(student)
        db.session.commit()
        return jsonify(student.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@student_bp.route('/<int:student_id>', methods=['PUT'])
@jwt_required()
def update_student(student_id):
    """
    Update an existing student
    """
    try:
        student = Student.query.get_or_404(student_id)
        data = request.get_json()
        
        # Update student fields
        for key, value in data.items():
            if hasattr(student, key):
                setattr(student, key, value)
                
        db.session.commit()
        return jsonify(student.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@student_bp.route('/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student(student_id):
    """
    Delete a student
    """
    try:
        student = Student.query.get_or_404(student_id)
        db.session.delete(student)
        db.session.commit()
        return jsonify({"message": "Student deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
