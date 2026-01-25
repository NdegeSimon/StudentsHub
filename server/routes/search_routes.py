from flask import Blueprint, request, jsonify, current_app
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

@search_bp.route('/api/searches/saved', methods=['GET'])
@jwt_required()
def get_saved_searches_list():
    """Get a list of all saved searches for the current user with basic info"""
    try:
        user_id = get_jwt_identity()
        searches = SavedSearch.query.filter_by(user_id=user_id)\
            .order_by(SavedSearch.last_searched.desc())\
            .all()
            
        result = [{
            'id': search.id,
            'search_query': search.search_query,
            'search_count': search.search_count,
            'last_searched': search.last_searched.isoformat() if search.last_searched else None,
            'created_at': search.created_at.isoformat() if search.created_at else None,
            'filters': search.filters or {}
        } for search in searches]
        
        return jsonify({
            'status': 'success',
            'count': len(result),
            'data': result
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching saved searches: {str(e)}")
        return jsonify({"error": "Failed to fetch saved searches"}), 500

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
