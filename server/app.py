# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from datetime import timedelta
from dotenv import load_dotenv
import os
# import eventlet

# Import extensions from extensions.py
from extensions import db, jwt, migrate, bcrypt, socketio, mail

def create_app():
    app = Flask(__name__)
    load_dotenv()

    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Configuration
    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret-key-change-in-production"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=7),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///studentshub.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        # For file uploads
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max file size
        UPLOAD_FOLDER=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads'),
        # Email configuration
        MAIL_SERVER=os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
        MAIL_PORT=int(os.getenv('MAIL_PORT', 587)),
        MAIL_USE_TLS=os.getenv('MAIL_USE_TLS', 'true').lower() == 'true',
        MAIL_USE_SSL=os.getenv('MAIL_USE_SSL', 'false').lower() == 'true',
        MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
        MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
        MAIL_DEFAULT_SENDER=os.getenv('MAIL_DEFAULT_SENDER')
    )

    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    mail.init_app(app)
    
    # Initialize SocketIO with threading instead of eventlet
    socketio.init_app(app, 
                     cors_allowed_origins=os.getenv('FRONTEND_URL', 'http://localhost:3000'),
                     async_mode='threading',
                     logger=True,
                     engineio_logger=True)

    # CORS - Allow all origins in development
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173", os.getenv('FRONTEND_URL', 'http://localhost:3000')],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "expose_headers": ["Content-Disposition"]
        },
        r"/uploads/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173", os.getenv('FRONTEND_URL', 'http://localhost:3000')],
            "methods": ["GET"],
            "supports_credentials": True
        }
    })

    # Import models inside app context to avoid circular imports
    with app.app_context():
        from models import (
            User, Student, Company, Job, Application, Interview, 
            Notification, CompanyReview, SavedJob, SavedCandidate, 
            Conversation, Participant, Message
        )
        # This will create all database tables if they don't exist
        db.create_all()
        print("📊 Database tables ensured.")

    # Register blueprints
    try:
        # Import and register auth routes
        from routes.routes import bp as auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api')
        print("✅ Auth blueprint registered")
        
        # Import and register search routes
        from routes.search_routes import search_bp
        app.register_blueprint(search_bp, url_prefix='/')
        print("✅ Search blueprint registered")
        
        # Import and register saved jobs routes
        from routes.saved_jobs_routes import saved_jobs_bp
        app.register_blueprint(saved_jobs_bp, url_prefix='/')
        print("✅ Saved Jobs blueprint registered")
        
        # Import and register job routes
        from routes.job_routes import job_bp
        app.register_blueprint(job_bp, url_prefix='/api/jobs')
        print("✅ Job routes blueprint registered")
        
        # Import and register company routes
        from routes.company_routes import company_bp
        app.register_blueprint(company_bp, url_prefix='/api/companies')
        print("✅ Company routes blueprint registered")
        
        # Import and register student routes
        from routes.student_routes import student_bp
        app.register_blueprint(student_bp, url_prefix='/api/students')
        print("✅ Student routes blueprint registered")
        
        # Import and register application routes
        from routes.application_routes import application_bp
        app.register_blueprint(application_bp, url_prefix='/api/applications')
        print("✅ Application routes blueprint registered")
        
        # Import and register notification routes
        from routes.notification_routes import notification_bp
        app.register_blueprint(notification_bp, url_prefix='/api/notifications')
        
        # Import and register profile routes
        from routes.profile_routes import profile_bp
        app.register_blueprint(profile_bp, url_prefix='')
        print("✅ Profile routes blueprint registered")
        print("✅ Notification routes blueprint registered")
        
        # Import and register messaging routes
        from routes.message_routes import message_bp as messages_bp
        app.register_blueprint(messages_bp, url_prefix='/api/messages')
        print("✅ Messaging routes blueprint registered")
        
        # Import and register file upload routes
        from routes.upload_routes import upload_bp
        app.register_blueprint(upload_bp, url_prefix='/api/uploads')
        print("✅ Upload routes blueprint registered")
        
        # Import and register dashboard routes
        from routes.dashboard_routes import dashboard_bp
        app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
        print("✅ Dashboard routes blueprint registered")
        
        # Test route
        @app.route('/api/test', methods=['GET'])
        def test():
            return jsonify({"status": "success", "message": "Backend is working!"})
        
        # Health check route
        @app.route('/api/health', methods=['GET'])
        def health_check():
            return jsonify({
                "status": "healthy",
                "database": "connected" if db.session.bind else "disconnected",
                "messaging": "enabled"
            })
            
    except Exception as e:
        print(f"❌ Error registering blueprints: {e}")
        import traceback
        traceback.print_exc()
        raise

    # WebSocket event handlers
    from flask_jwt_extended import jwt_required, get_jwt_identity
    from models import User, Conversation, Participant, Message
    
    @socketio.on('connect')
    def handle_connect():
        print(f'Client connected: {request.sid}')
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print(f'Client disconnected: {request.sid}')
        # Update user status to offline
        user = User.query.filter_by(socket_id=request.sid).first()
        if user:
            user.is_online = False
            user.socket_id = None
            db.session.commit()
            
            # Notify others
            emit('user_offline', {'user_id': user.id}, broadcast=True)
    
    @socketio.on('authenticate')
    def handle_authentication(data):
        try:
            token = data.get('token')
            if not token:
                emit('auth_error', {'message': 'Token required'})
                return
            
            from flask_jwt_extended import decode_token
            decoded = decode_token(token)
            user_id = decoded.get('user_id')
            
            if not user_id:
                emit('auth_error', {'message': 'Invalid token'})
                return
            
            user = User.query.get(user_id)
            if not user:
                emit('auth_error', {'message': 'User not found'})
                return
            
            # Store user's socket connection
            user.is_online = True
            user.socket_id = request.sid
            db.session.commit()
            
            # Join user to their personal room
            join_room(str(user_id))
            emit('authenticated', {'user_id': user_id})
            
            # Notify others that user is online
            emit('user_online', {'user_id': user_id}, broadcast=True, include_self=False)
            
        except Exception as e:
            print(f"Authentication error: {e}")
            emit('auth_error', {'message': 'Authentication failed'})
    
    @socketio.on('join_conversation')
    def handle_join_conversation(data):
        conversation_id = data.get('conversation_id')
        user_id = data.get('user_id')
        
        if conversation_id and user_id:
            room_name = f'conversation_{conversation_id}'
            join_room(room_name)
            emit('joined_conversation', {'conversation_id': conversation_id})
    
    @socketio.on('send_message')
    def handle_send_message(data):
        try:
            conversation_id = data.get('conversation_id')
            sender_id = data.get('sender_id')
            content = data.get('content')
            message_type = data.get('message_type', 'text')
            file_url = data.get('file_url')
            file_name = data.get('file_name')
            file_size = data.get('file_size')
            
            if not all([conversation_id, sender_id, content]):
                emit('error', {'message': 'Missing required fields'})
                return
            
            # Create message in database
            message = Message(
                conversation_id=conversation_id,
                sender_id=sender_id,
                content=content,
                message_type=message_type,
                file_url=file_url,
                file_name=file_name,
                file_size=file_size,
                status='sent'
            )
            
            db.session.add(message)
            
            # Update conversation last message
            conversation = Conversation.query.get(conversation_id)
            if conversation:
                conversation.last_message = content[:100]
                conversation.last_message_at = datetime.utcnow()
            
            # Update unread counts for other participants
            participants = Participant.query.filter_by(conversation_id=conversation_id).all()
            for participant in participants:
                if participant.user_id != sender_id:
                    participant.unread_count += 1
            
            db.session.commit()
            
            # Prepare message data to send
            sender = User.query.get(sender_id)
            message_data = {
                'id': message.id,
                'conversation_id': message.conversation_id,
                'sender_id': message.sender_id,
                'sender': sender.to_dict() if sender else None,
                'content': message.content,
                'message_type': message.message_type,
                'file_url': message.file_url,
                'file_name': message.file_name,
                'file_size': message.file_size,
                'status': message.status,
                'created_at': message.created_at.isoformat()
            }
            
            # Send to all participants in the conversation room
            room_name = f'conversation_{conversation_id}'
            emit('new_message', message_data, room=room_name)
            
            # Also send to individual user rooms for real-time updates
            for participant in participants:
                if participant.user_id != sender_id:
                    emit('new_message_notification', {
                        'conversation_id': conversation_id,
                        'message': content[:50],
                        'sender_name': sender.name if sender else 'Unknown'
                    }, room=str(participant.user_id))
            
        except Exception as e:
            print(f"Error sending message: {e}")
            emit('error', {'message': 'Failed to send message'})
    
    @socketio.on('typing')
    def handle_typing(data):
        conversation_id = data.get('conversation_id')
        user_id = data.get('user_id')
        is_typing = data.get('is_typing', False)
        
        if conversation_id and user_id:
            room_name = f'conversation_{conversation_id}'
            emit('user_typing', {
                'conversation_id': conversation_id,
                'user_id': user_id,
                'is_typing': is_typing
            }, room=room_name, include_self=False)
    
    @socketio.on('mark_as_read')
    def handle_mark_as_read(data):
        message_id = data.get('message_id')
        user_id = data.get('user_id')
        
        if message_id and user_id:
            message = Message.query.get(message_id)
            if message:
                read_by = message.read_by or []
                if user_id not in read_by:
                    read_by.append(user_id)
                    message.read_by = read_by
                    message.status = 'read'
                    db.session.commit()
                    
                    # Notify sender that message was read
                    emit('message_read', {
                        'message_id': message_id,
                        'user_id': user_id
                    }, room=str(message.sender_id))
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    # Use threading for websocket support
    # import eventlet
    # eventlet.monkey_patch()
    
    app = create_app()
    
    print("🚀 Students Hub API starting...")
    print("🔗 Available at: http://localhost:5001")
    print("🔌 WebSocket enabled on: ws://localhost:5001")
    print("📁 Upload folder:", app.config['UPLOAD_FOLDER'])
    
    # Run with SocketIO support
    socketio.run(app, 
                 host="0.0.0.0", 
                 port=5001, 
                 debug=True)