from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.job_model import Job
from models.user_model import User

job_bp = Blueprint('jobs', __name__)

@job_bp.route('', methods=['GET'])
def get_all_jobs():
    try:
        job_model = Job(current_app.db)
        jobs = job_model.get_all_jobs()
        return jsonify(jobs), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job_model = Job(current_app.db)
        job = job_model.get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify(job), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('', methods=['POST'])
@jwt_required()
def create_job():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Verify user is a company
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can post jobs'}), 403
        
        # Validate required fields
        required_fields = ['title', 'companyName', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        job_model = Job(current_app.db)
        job_id = job_model.create_job(data, user_id)
        
        return jsonify({
            'message': 'Job created successfully',
            'job_id': job_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/company', methods=['GET'])
@jwt_required()
def get_company_jobs():
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a company
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can access this endpoint'}), 403
        
        job_model = Job(current_app.db)
        jobs = job_model.get_company_jobs(user_id)
        
        return jsonify(jobs), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/<job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Verify user is a company
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can update jobs'}), 403
        
        # Validate required fields
        required_fields = ['title', 'companyName', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        job_model = Job(current_app.db)
        success = job_model.update_job(job_id, data, user_id)
        
        if success:
            return jsonify({'message': 'Job updated successfully'}), 200
        else:
            return jsonify({'error': 'Job not found or unauthorized'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/<job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a company
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can delete jobs'}), 403
        
        job_model = Job(current_app.db)
        success = job_model.delete_job(job_id, user_id)
        
        if success:
            return jsonify({'message': 'Job deleted successfully'}), 200
        else:
            return jsonify({'error': 'Job not found or unauthorized'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500