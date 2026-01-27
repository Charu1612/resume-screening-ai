from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user_model import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate role
        if data['role'] not in ['candidate', 'company']:
            return jsonify({'error': 'Role must be either candidate or company'}), 400
        
        user_model = User(current_app.db)
        
        # Check if email already exists
        if user_model.email_exists(data['email']):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user_id = user_model.create_user(data)
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user_model = User(current_app.db)
        user = user_model.find_by_email(data['email'])
        
        if not user or not user_model.verify_password(data['password'], user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Return user data (excluding password)
        user_data = {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'profile': user.get('profile', {})
        }
        
        return jsonify({
            'token': access_token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'profile': user.get('profile', {})
        }
        
        return jsonify(user_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        user_model = User(current_app.db)
        
        # Update profile
        success = user_model.update_profile(user_id, data)
        
        if success:
            return jsonify({'message': 'Profile updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update profile'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500