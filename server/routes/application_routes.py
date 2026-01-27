from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from models.application_model import Application
from models.user_model import User
from models.job_model import Job
from services.resume_parser import ResumeParser
from services.skill_matcher import SkillMatcher

application_bp = Blueprint('applications', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@application_bp.route('', methods=['POST'])
@jwt_required()
def apply_to_job():
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a candidate
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can apply to jobs'}), 403
        
        # Get form data
        job_id = request.form.get('jobId')
        name = request.form.get('name')
        email = request.form.get('email')
        degree = request.form.get('degree')
        experience = request.form.get('experience')
        
        # Validate required fields
        if not all([job_id, name, email, degree, experience]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if job exists
        job_model = Job(current_app.db)
        job = job_model.get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if already applied
        application_model = Application(current_app.db)
        if application_model.check_existing_application(user_id, job_id):
            return jsonify({'error': 'You have already applied to this job'}), 400
        
        resume_url = None
        match_score = 0
        
        # Handle resume upload if provided
        if 'resume' in request.files:
            file = request.files['resume']
            if file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(f"application_{user_id}_{job_id}_{file.filename}")
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                resume_url = file_path
                
                # Calculate match score
                try:
                    parser = ResumeParser()
                    resume_data = parser.parse_resume(file_path)
                    
                    matcher = SkillMatcher()
                    match_score = matcher.calculate_ats_score(resume_data, job)
                except Exception as e:
                    print(f"Error calculating match score: {e}")
                    match_score = 0
        
        # Create application
        application_data = {
            'candidateId': user_id,
            'jobId': job_id,
            'candidateName': name,
            'email': email,
            'degree': degree,
            'experience': experience,
            'resumeUrl': resume_url,
            'matchScore': match_score
        }
        
        application_id = application_model.create_application(application_data)
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application_id,
            'match_score': match_score
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application_bp.route('/candidate', methods=['GET'])
@jwt_required()
def get_candidate_applications():
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a candidate
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can access this endpoint'}), 403
        
        application_model = Application(current_app.db)
        applications = application_model.get_candidate_applications(user_id)
        
        return jsonify(applications), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application_bp.route('/company', methods=['GET'])
@jwt_required()
def get_company_applications():
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a company
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can access this endpoint'}), 403
        
        application_model = Application(current_app.db)
        applications = application_model.get_company_applications(user_id)
        
        return jsonify(applications), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application_bp.route('/<application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    try:
        user_id = get_jwt_identity()
        
        application_model = Application(current_app.db)
        application = application_model.get_application_by_id(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if user has permission to view this application
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if user['role'] == 'candidate' and str(application['candidateId']) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        elif user['role'] == 'company' and str(application['job']['companyId']) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify(application), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application_bp.route('/<application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('status'):
            return jsonify({'error': 'Status is required'}), 400
        
        if data['status'] not in ['pending', 'accepted', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Verify user is a company and owns the job
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can update application status'}), 403
        
        application_model = Application(current_app.db)
        application = application_model.get_application_by_id(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        if str(application['job']['companyId']) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update status
        success = application_model.update_status(application_id, data['status'])
        
        if success:
            return jsonify({'message': 'Application status updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update status'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_application_stats():
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a company
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can access application stats'}), 403
        
        application_model = Application(current_app.db)
        stats = application_model.get_application_stats(user_id)
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500