from flask import Blueprint, jsonify, request
from models.models import Company, db
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

company_bp = Blueprint('company', __name__)

@company_bp.route('/', methods=['GET'])
def get_companies():
    """
    Get all companies
    """
    try:
        companies = Company.query.all()
        return jsonify([company.to_dict() for company in companies]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@company_bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    """
    Get a specific company by ID
    """
    try:
        company = Company.query.get_or_404(company_id)
        return jsonify(company.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@company_bp.route('/', methods=['POST'])
@jwt_required()
def create_company():
    """
    Create a new company
    """
    try:
        data = request.get_json()
        company = Company(**data)
        db.session.add(company)
        db.session.commit()
        return jsonify(company.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@company_bp.route('/<int:company_id>', methods=['PUT'])
@jwt_required()
def update_company(company_id):
    """
    Update an existing company
    """
    try:
        company = Company.query.get_or_404(company_id)
        data = request.get_json()
        
        # Update company fields
        for key, value in data.items():
            if hasattr(company, key):
                setattr(company, key, value)
                
        db.session.commit()
        return jsonify(company.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@company_bp.route('/<int:company_id>', methods=['DELETE'])
@jwt_required()
def delete_company(company_id):
    """
    Delete a company
    """
    try:
        company = Company.query.get_or_404(company_id)
        db.session.delete(company)
        db.session.commit()
        return jsonify({"message": "Company deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
