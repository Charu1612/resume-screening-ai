from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models.user_model import User

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token is invalid or expired'}), 401
    return decorated

def role_required(required_role):
    """Decorator to require specific user role"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                
                user_model = User(current_app.db)
                user = user_model.find_by_id(user_id)
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404
                
                if user['role'] != required_role:
                    return jsonify({'error': f'Access denied. {required_role.title()} role required'}), 403
                
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Authorization failed'}), 401
        return decorated
    return decorator

def get_current_user():
    """Get current user from JWT token"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if user:
            # Remove sensitive information
            user.pop('password', None)
            user['_id'] = str(user['_id'])
        
        return user
    except Exception as e:
        return None

def validate_token_and_get_user():
    """Validate token and return user data"""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user:
            return None, jsonify({'error': 'User not found'}), 404
        
        # Remove sensitive information
        user.pop('password', None)
        user['_id'] = str(user['_id'])
        
        return user, None, None
    except Exception as e:
        return None, jsonify({'error': 'Token validation failed'}), 401