from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, SavedSearch
from datetime import datetime

search_bp = Blueprint('search', __name__)

@search_bp.route('/api/searches', methods=['GET'])
@jwt_required()
def get_saved_searches():
    """Get all saved searches for the current user"""
    user_id = get_jwt_identity()
    searches = SavedSearch.query.filter_by(user_id=user_id).order_by(SavedSearch.last_searched.desc()).all()
    return jsonify([search.to_dict() for search in searches])

@search_bp.route('/api/searches', methods=['POST'])
@jwt_required()
def save_search():
    """Save a new search or update an existing one"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    search_query = data.get('search_query', '').strip()
    if not search_query:
        return jsonify({"error": "Search query is required"}), 400
    
    # Check if this search already exists for the user
    search = SavedSearch.query.filter_by(
        user_id=user_id, 
        search_query=search_query
    ).first()
    
    if search:
        # Update existing search
        search.search_count += 1
        search.last_searched = datetime.utcnow()
        search.filters = data.get('filters', {})
    else:
        # Create new search
        search = SavedSearch(
            user_id=user_id,
            search_query=search_query,
            filters=data.get('filters', {})
        )
        db.session.add(search)
    
    db.session.commit()
    return jsonify(search.to_dict()), 201

@search_bp.route('/api/searches/<int:search_id>', methods=['DELETE'])
@jwt_required()
def delete_saved_search(search_id):
    """Delete a saved search"""
    user_id = get_jwt_identity()
    search = SavedSearch.query.filter_by(id=search_id, user_id=user_id).first()
    
    if not search:
        return jsonify({"error": "Search not found"}), 404
    
    db.session.delete(search)
    db.session.commit()
    return jsonify({"message": "Search deleted successfully"}), 200
