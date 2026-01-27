from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from services.resume_parser import ResumeParser
from services.skill_matcher import SkillMatcher
from models.user_model import User
from models.job_model import Job

resume_bp = Blueprint('resume', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a candidate
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can upload resumes'}), 403
        
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOC, DOCX allowed'}), 400
        
        # Save file
        filename = secure_filename(f"{user_id}_{file.filename}")
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Parse resume
        parser = ResumeParser()
        resume_data = parser.parse_resume(file_path)
        
        # Update user profile with resume data
        profile_update = {
            'resumeUrl': file_path,
            'skills': resume_data.get('skills', []),
            'experience': resume_data.get('experience', ''),
            'education': resume_data.get('education', '')
        }
        
        user_model.update_profile(user_id, profile_update)
        
        return jsonify({
            'message': 'Resume uploaded and parsed successfully',
            'resume_data': resume_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_resume():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('jobId'):
            return jsonify({'error': 'Job ID is required'}), 400
        
        # Verify user is a candidate
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can analyze resumes'}), 403
        
        # Get job details
        job_model = Job(current_app.db)
        job = job_model.get_job_by_id(data['jobId'])
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Get user's resume data
        resume_path = user.get('profile', {}).get('resumeUrl')
        if not resume_path or not os.path.exists(resume_path):
            return jsonify({'error': 'No resume found. Please upload a resume first'}), 400
        
        # Parse resume if not already parsed
        parser = ResumeParser()
        resume_data = parser.parse_resume(resume_path)
        
        # Perform skill matching
        matcher = SkillMatcher()
        analysis = matcher.analyze_match(resume_data, job)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/ats-score/<job_id>', methods=['GET'])
@jwt_required()
def get_ats_score(job_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a candidate
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can access ATS scores'}), 403
        
        # Get job details
        job_model = Job(current_app.db)
        job = job_model.get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Get user's resume data
        resume_path = user.get('profile', {}).get('resumeUrl')
        if not resume_path or not os.path.exists(resume_path):
            return jsonify({'error': 'No resume found. Please upload a resume first'}), 400
        
        # Parse resume and calculate ATS score
        parser = ResumeParser()
        resume_data = parser.parse_resume(resume_path)
        
        matcher = SkillMatcher()
        score = matcher.calculate_ats_score(resume_data, job)
        
        return jsonify({'ats_score': score}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resume_bp.route('/skill-analysis/<job_id>', methods=['GET'])
@jwt_required()
def get_skill_analysis(job_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify user is a candidate
        user_model = User(current_app.db)
        user = user_model.find_by_id(user_id)
        
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can access skill analysis'}), 403
        
        # Get job details
        job_model = Job(current_app.db)
        job = job_model.get_job_by_id(job_id)
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Get user's resume data
        resume_path = user.get('profile', {}).get('resumeUrl')
        if not resume_path or not os.path.exists(resume_path):
            return jsonify({'error': 'No resume found. Please upload a resume first'}), 400
        
        # Parse resume and analyze skills
        parser = ResumeParser()
        resume_data = parser.parse_resume(resume_path)
        
        matcher = SkillMatcher()
        analysis = matcher.analyze_skills(resume_data, job)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500