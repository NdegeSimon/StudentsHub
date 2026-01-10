from flask import Blueprint, jsonify, request
from models.notification import Notification  # Assuming you have a Notification model
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """
    Get all notifications for the current user
    """
    try:
        current_user = get_jwt_identity()
        notifications = Notification.query.filter_by(user_id=current_user['id']).all()
        return jsonify([notif.to_dict() for notif in notifications]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notification_bp.route('/<int:notification_id>', methods=['GET'])
@jwt_required()
def get_notification(notification_id):
    """
    Get a specific notification by ID
    """
    try:
        current_user = get_jwt_identity()
        notification = Notification.query.filter_by(
            id=notification_id, 
            user_id=current_user['id']
        ).first_or_404()
        return jsonify(notification.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """
    Mark a notification as read
    """
    try:
        current_user = get_jwt_identity()
        notification = Notification.query.filter_by(
            id=notification_id, 
            user_id=current_user['id']
        ).first_or_404()
        
        notification.is_read = True
        db.session.commit()
        return jsonify(notification.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@notification_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """
    Mark all notifications as read for the current user
    """
    try:
        current_user = get_jwt_identity()
        Notification.query.filter_by(
            user_id=current_user['id'],
            is_read=False
        ).update({'is_read': True})
        
        db.session.commit()
        return jsonify({"message": "All notifications marked as read"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """
    Delete a notification
    """
    try:
        current_user = get_jwt_identity()
        notification = Notification.query.filter_by(
            id=notification_id, 
            user_id=current_user['id']
        ).first_or_404()
        
        db.session.delete(notification)
        db.session.commit()
        return jsonify({"message": "Notification deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
