from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, SavedSearch
from sqlalchemy import desc

saved_searches_bp = Blueprint('saved_searches', __name__)

@saved_searches_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_searches():
    try:
        current_user = get_jwt_identity()
        # Ensure we're getting just the ID
        user_id = current_user.get('id') if isinstance(current_user, dict) else current_user
        
        # Debug output
        print(f"Fetching saved searches for user ID: {user_id}, type: {type(user_id)}")
        
        searches = SavedSearch.query.filter_by(user_id=user_id) \
            .order_by(desc(SavedSearch.last_searched)).all()
        
        return jsonify({
            'success': True,
            'searches': [search.to_dict() for search in searches]
        }), 200
        
    except Exception as e:
        print(f"Error in get_saved_searches: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to fetch saved searches',
            'error': str(e)
        }), 500