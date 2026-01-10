from flask import Blueprint, jsonify, request
from models.models import Message, Conversation, Participant, db
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

message_bp = Blueprint('message', __name__)

@message_bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    """
    Get all conversations for the current user
    """
    try:
        current_user = get_jwt_identity()
        
        # Get all conversations where the current user is a participant
        conversations = db.session.query(Conversation).join(
            Participant, 
            Participant.conversation_id == Conversation.id
        ).filter(
            Participant.user_id == current_user['id']
        ).order_by(
            Conversation.last_message_at.desc()
        ).all()
        
        return jsonify([{
            'id': conv.id,
            'last_message': conv.last_message,
            'last_message_at': conv.last_message_at.isoformat() if conv.last_message_at else None,
            'unread_count': next((p.unread_count for p in conv.participants if p.user_id == current_user['id']), 0),
            'participants': [{
                'id': p.user.id,
                'name': f"{p.user.first_name} {p.user.last_name}",
                'avatar': p.user.avatar,
                'is_online': p.user.is_online
            } for p in conv.participants if p.user_id != current_user['id']]
        } for conv in conversations]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@message_bp.route('/conversations', methods=['POST'])
@jwt_required()
def create_conversation():
    """
    Create a new conversation
    """
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if 'participant_ids' not in data or not isinstance(data['participant_ids'], list):
            return jsonify({"error": "participant_ids is required and must be an array"}), 400
            
        # Create new conversation
        conversation = Conversation(
            last_message_at=datetime.utcnow()
        )
        db.session.add(conversation)
        
        # Add current user as participant
        current_participant = Participant(
            conversation=conversation,
            user_id=current_user['id'],
            user_type='user',
            joined_at=datetime.utcnow()
        )
        db.session.add(current_participant)
        
        # Add other participants
        for user_id in data['participant_ids']:
            if user_id != current_user['id']:  # Don't add current user again
                participant = Participant(
                    conversation=conversation,
                    user_id=user_id,
                    user_type='user',
                    joined_at=datetime.utcnow()
                )
                db.session.add(participant)
        
        db.session.commit()
        
        return jsonify({
            'id': conversation.id,
            'created_at': conversation.created_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@message_bp.route('/conversations/<int:conversation_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(conversation_id):
    """
    Get messages for a conversation
    """
    try:
        current_user = get_jwt_identity()
        
        # Verify user is a participant in the conversation
        participant = Participant.query.filter_by(
            conversation_id=conversation_id,
            user_id=current_user['id']
        ).first_or_404()
        
        # Get messages
        messages = Message.query.filter_by(
            conversation_id=conversation_id
        ).order_by(
            Message.created_at.asc()
        ).all()
        
        # Mark messages as read
        unread_messages = Message.query.filter(
            Message.conversation_id == conversation_id,
            Message.sender_id != current_user['id'],
            ~Message.read_by.any(current_user['id'])
        ).all()
        
        for msg in unread_messages:
            if not msg.read_by:
                msg.read_by = []
            if current_user['id'] not in msg.read_by:
                msg.read_by.append(current_user['id'])
        
        db.session.commit()
        
        return jsonify([{
            'id': msg.id,
            'content': msg.content,
            'sender_id': msg.sender_id,
            'message_type': msg.message_type,
            'file_url': msg.file_url,
            'file_name': msg.file_name,
            'file_size': msg.file_size,
            'created_at': msg.created_at.isoformat(),
            'is_read': current_user['id'] in (msg.read_by or [])
        } for msg in messages]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@message_bp.route('/conversations/<int:conversation_id>/messages', methods=['POST'])
@jwt_required()
def send_message(conversation_id):
    """
    Send a message in a conversation
    """
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Verify user is a participant in the conversation
        participant = Participant.query.filter_by(
            conversation_id=conversation_id,
            user_id=current_user['id']
        ).first_or_404()
        
        # Create new message
        message = Message(
            conversation_id=conversation_id,
            sender_id=current_user['id'],
            content=data.get('content', ''),
            message_type=data.get('message_type', 'text'),
            file_url=data.get('file_url'),
            file_name=data.get('file_name'),
            file_size=data.get('file_size'),
            is_encrypted=data.get('is_encrypted', False),
            encryption_key=data.get('encryption_key'),
            reply_to_id=data.get('reply_to_id')
        )
        
        # Update conversation last message
        conversation = Conversation.query.get(conversation_id)
        conversation.last_message = message.content[:100]  # Store first 100 chars as preview
        conversation.last_message_at = datetime.utcnow()
        
        # Increment unread count for other participants
        for p in conversation.participants:
            if p.user_id != current_user['id']:
                p.unread_count = (p.unread_count or 0) + 1
        
        db.session.add(message)
        db.session.commit()
        
        # Here you would typically emit a socket.io event to notify other participants
        # socketio.emit('new_message', {
        #     'conversation_id': conversation_id,
        #     'message': {
        #         'id': message.id,
        #         'content': message.content,
        #         'sender_id': message.sender_id,
        #         'created_at': message.created_at.isoformat(),
        #         'is_read': False
        #     }
        # }, room=f'conversation_{conversation_id}')
        
        return jsonify({
            'id': message.id,
            'content': message.content,
            'sender_id': message.sender_id,
            'created_at': message.created_at.isoformat(),
            'is_read': False
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@message_bp.route('/messages/<int:message_id>/read', methods=['POST'])
@jwt_required()
def mark_message_as_read(message_id):
    """
    Mark a message as read
    """
    try:
        current_user = get_jwt_identity()
        
        message = Message.query.get_or_404(message_id)
        
        # Verify user is a participant in the conversation
        participant = Participant.query.filter_by(
            conversation_id=message.conversation_id,
            user_id=current_user['id']
        ).first_or_404()
        
        # Mark as read if not already
        if not message.read_by:
            message.read_by = []
            
        if current_user['id'] not in message.read_by:
            message.read_by.append(current_user['id'])
            
            # Decrement unread count
            participant.unread_count = max(0, (participant.unread_count or 1) - 1)
            
            db.session.commit()
        
        return jsonify({"status": "success"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
