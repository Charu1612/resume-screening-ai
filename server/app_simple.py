from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

CORS(app, origins=['http://localhost:5173', 'http://localhost:3000'])
jwt = JWTManager(app)

# In-memory storage for demo (replace with MongoDB in production)
users = {}
jobs = {}
applications = {}

# Sample data
sample_jobs = {
    '1': {
        '_id': '1',
        'title': 'Senior Software Engineer',
        'companyName': 'Visa',
        'location': 'San Francisco, CA',
        'type': 'Full-time',
        'salary': '$120k - $180k',
        'description': 'We are looking for a Senior Software Engineer to join our payments team. You will work on building scalable systems that process millions of transactions daily.',
        'requiredSkills': ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
        'postedDate': '2 days ago',
        'companyId': 'company1'
    },
    '2': {
        '_id': '2',
        'title': 'Full Stack Developer',
        'companyName': 'Google',
        'location': 'Mountain View, CA',
        'type': 'Full-time',
        'salary': '$130k - $200k',
        'description': 'Join our team to build next-generation web applications. Work with cutting-edge technologies and collaborate with world-class engineers.',
        'requiredSkills': ['JavaScript', 'Python', 'React', 'Docker', 'GCP'],
        'postedDate': '1 week ago',
        'companyId': 'company2'
    }
}

jobs.update(sample_jobs)

# Helper functions
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Routes
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'SkillSync API is running'})

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        if data['role'] not in ['candidate', 'company']:
            return jsonify({'error': 'Role must be either candidate or company'}), 400
        
        if data['email'] in users:
            return jsonify({'error': 'Email already registered'}), 400
        
        user_id = f"user_{len(users) + 1}"
        users[user_id] = {
            '_id': user_id,
            'name': data['name'],
            'email': data['email'].lower(),
            'password': hash_password(data['password']),
            'role': data['role'],
            'created_at': datetime.utcnow(),
            'profile': {}
        }
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = None
        for u in users.values():
            if u['email'] == data['email'].lower():
                user = u
                break
        
        if not user or not verify_password(data['password'], user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user['_id'])
        
        user_data = {
            'id': user['_id'],
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

@app.route('/api/jobs', methods=['GET'])
def get_all_jobs():
    try:
        return jsonify(list(jobs.values())), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/company', methods=['GET'])
@jwt_required()
def get_company_jobs():
    try:
        user_id = get_jwt_identity()
        
        user = users.get(user_id)
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can access this endpoint'}), 403
        
        # Filter jobs by company
        company_jobs = []
        for job in jobs.values():
            if job.get('companyId') == user_id:
                company_jobs.append(job)
        
        return jsonify(company_jobs), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs', methods=['POST'])
@jwt_required()
def create_job():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        user = users.get(user_id)
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can post jobs'}), 403
        
        required_fields = ['title', 'companyName', 'description']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        job_id = f"job_{len(jobs) + 1}"
        jobs[job_id] = {
            '_id': job_id,
            'title': data['title'],
            'companyName': data['companyName'],
            'companyId': user_id,
            'location': data.get('location', ''),
            'type': data.get('type', 'Full-time'),
            'salary': data.get('salary', ''),
            'description': data['description'],
            'requiredSkills': data.get('requiredSkills', []),
            'hrName': data.get('hrName', ''),
            'hrContact': data.get('hrContact', ''),
            'postedDate': 'Just now',
            'created_at': datetime.utcnow()
        }
        
        return jsonify({
            'message': 'Job created successfully',
            'job_id': job_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications', methods=['POST'])
@jwt_required()
def apply_to_job():
    try:
        user_id = get_jwt_identity()
        
        user = users.get(user_id)
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can apply to jobs'}), 403
        
        # Get form data
        job_id = request.form.get('jobId') if request.form else request.json.get('jobId')
        name = request.form.get('name') if request.form else request.json.get('name')
        email = request.form.get('email') if request.form else request.json.get('email')
        degree = request.form.get('degree') if request.form else request.json.get('degree')
        experience = request.form.get('experience') if request.form else request.json.get('experience')
        
        if not all([job_id, name, email, degree, experience]):
            return jsonify({'error': 'All fields are required'}), 400
        
        if job_id not in jobs:
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if already applied
        for app in applications.values():
            if app['candidateId'] == user_id and app['jobId'] == job_id:
                return jsonify({'error': 'You have already applied to this job'}), 400
        
        app_id = f"app_{len(applications) + 1}"
        applications[app_id] = {
            '_id': app_id,
            'candidateId': user_id,
            'jobId': job_id,
            'candidateName': name,
            'email': email,
            'degree': degree,
            'experience': experience,
            'status': 'pending',
            'matchScore': 75,  # Mock score
            'appliedDate': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': app_id,
            'match_score': 75
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/candidate', methods=['GET'])
@jwt_required()
def get_candidate_applications():
    try:
        user_id = get_jwt_identity()
        
        user = users.get(user_id)
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can access this endpoint'}), 403
        
        candidate_apps = []
        for app in applications.values():
            if app['candidateId'] == user_id:
                # Add job details
                job = jobs.get(app['jobId'])
                if job:
                    app_with_job = app.copy()
                    app_with_job['job'] = job
                    candidate_apps.append(app_with_job)
        
        return jsonify(candidate_apps), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/company', methods=['GET'])
@jwt_required()
def get_company_applications():
    try:
        user_id = get_jwt_identity()
        
        user = users.get(user_id)
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can access this endpoint'}), 403
        
        company_apps = []
        for app in applications.values():
            job = jobs.get(app['jobId'])
            if job and job.get('companyId') == user_id:
                # Add job details and candidate details
                candidate = users.get(app['candidateId'])
                app_with_details = app.copy()
                app_with_details['job'] = job
                if candidate:
                    app_with_details['candidate'] = {
                        '_id': candidate['_id'],
                        'name': candidate['name'],
                        'email': candidate['email'],
                        'profile': candidate.get('profile', {})
                    }
                company_apps.append(app_with_details)
        
        return jsonify(company_apps), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/applications/<application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('status'):
            return jsonify({'error': 'Status is required'}), 400
        
        if data['status'] not in ['pending', 'accepted', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400
        
        user = users.get(user_id)
        if not user or user['role'] != 'company':
            return jsonify({'error': 'Only companies can update application status'}), 403
        
        application = applications.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Check if company owns the job
        job = jobs.get(application['jobId'])
        if not job or job.get('companyId') != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update status
        applications[application_id]['status'] = data['status']
        applications[application_id]['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({'message': 'Application status updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/resume/analyze', methods=['POST'])
@jwt_required()
def analyze_resume():
    try:
        user_id = get_jwt_identity()
        
        user = users.get(user_id)
        if not user or user['role'] != 'candidate':
            return jsonify({'error': 'Only candidates can analyze resumes'}), 403
        
        # Handle both form data (file upload) and JSON data (text input)
        if request.content_type and 'multipart/form-data' in request.content_type:
            # File upload case
            job_description = request.form.get('jobDescription')
            resume_file = request.files.get('resume')
            
            if not job_description:
                return jsonify({'error': 'Job description is required'}), 400
            
            if resume_file:
                # Extract text from uploaded file
                resume_text = extract_text_from_file(resume_file)
                if not resume_text:
                    return jsonify({'error': 'Could not extract text from resume file'}), 400
            else:
                return jsonify({'error': 'Resume file is required'}), 400
                
        else:
            # JSON data case (text input)
            data = request.get_json()
            job_description = data.get('jobDescription', '')
            resume_text = data.get('resumeText', '')
            
            if not job_description:
                return jsonify({'error': 'Job description is required'}), 400
            
            if not resume_text:
                # Use default resume text for demo
                resume_text = get_default_resume_text()
        
        # Create job object for analysis
        job = {
            'title': 'Software Engineer',
            'description': job_description,
            'requiredSkills': extract_skills_from_job_description(job_description)
        }
        
        # Perform actual ATS analysis
        analysis = calculate_ats_score(resume_text, job)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_text_from_file(file):
    """Extract text from uploaded PDF or DOCX file"""
    try:
        filename = file.filename.lower()
        
        if filename.endswith('.pdf'):
            return extract_text_from_pdf(file)
        elif filename.endswith(('.doc', '.docx')):
            return extract_text_from_docx(file)
        else:
            return None
            
    except Exception as e:
        print(f"Error extracting text from file: {e}")
        return None

def extract_text_from_pdf(file):
    """Extract text from PDF file"""
    try:
        from PyPDF2 import PdfReader
        import io
        
        # Read file content
        file_content = file.read()
        file.seek(0)  # Reset file pointer
        
        # Create PDF reader
        pdf_reader = PdfReader(io.BytesIO(file_content))
        text = ""
        
        # Extract text from all pages
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
        
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return None

def extract_text_from_docx(file):
    """Extract text from DOCX file"""
    try:
        from docx import Document
        import io
        
        # Read file content
        file_content = file.read()
        file.seek(0)  # Reset file pointer
        
        # Create document object
        doc = Document(io.BytesIO(file_content))
        text = ""
        
        # Extract text from all paragraphs
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        return text.strip()
        
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return None

def extract_skills_from_job_description(description):
    """Extract technical skills from job description"""
    common_skills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 
        'Angular', 'Vue.js', 'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL',
        'MySQL', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Jenkins',
        'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
        'Django', 'Flask', 'Spring', 'Express.js', 'Laravel', 'Rails'
    ]
    
    description_lower = description.lower()
    found_skills = []
    
    for skill in common_skills:
        if skill.lower() in description_lower:
            found_skills.append(skill)
    
    return found_skills

def preprocess_text(text):
    """Clean and preprocess text for analysis"""
    if not text:
        return ""
    
    import re
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove extra whitespace and newlines
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep alphanumeric and common punctuation
    text = re.sub(r'[^\w\s\-\.\,\(\)]', ' ', text)
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def extract_keywords_from_text(text):
    """Extract important keywords from text"""
    # Remove common stop words
    stop_words = {
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
        'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
        'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
        'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their',
        'if', 'up', 'out', 'many', 'then', 'them', 'these', 'so', 'some'
    }
    
    words = text.split()
    keywords = []
    
    for word in words:
        # Remove punctuation
        word = word.strip('.,()[]{}!?;:"')
        
        # Skip if too short, is stop word, or is numeric
        if (len(word) >= 2 and 
            word.lower() not in stop_words and 
            not word.isdigit()):
            keywords.append(word.lower())
    
    return list(set(keywords))  # Remove duplicates

def get_default_resume_text():
    """Default resume text for demo purposes"""
    return """
    John Doe
    Software Developer
    Email: john.doe@email.com
    Phone: +1-555-0123
    
    EXPERIENCE:
    Senior Software Developer at TechCorp (2020-2024)
    - Developed web applications using React, JavaScript, and Node.js
    - Built RESTful APIs and microservices
    - Worked with MongoDB and PostgreSQL databases
    - Collaborated with cross-functional teams using Agile methodologies
    - Implemented CI/CD pipelines using Jenkins
    
    Software Developer at StartupXYZ (2018-2020)
    - Created responsive web interfaces using HTML, CSS, and JavaScript
    - Developed backend services using Python and Django
    - Worked with MySQL databases
    - Participated in code reviews and testing
    
    EDUCATION:
    Bachelor of Computer Science
    University of Technology (2014-2018)
    GPA: 3.7/4.0
    
    SKILLS:
    Programming Languages: JavaScript, Python, Java, HTML, CSS
    Frameworks: React, Node.js, Django, Express.js
    Databases: MongoDB, PostgreSQL, MySQL
    Tools: Git, Jenkins, Docker, AWS (basic)
    Methodologies: Agile, Scrum
    
    PROJECTS:
    E-commerce Platform - Built using React and Node.js
    Task Management App - Developed with Python and Django
    """
    """Default resume text for demo purposes"""
    return """
    John Doe
    Software Developer
    Email: john.doe@email.com
    Phone: +1-555-0123
    
    EXPERIENCE:
    Senior Software Developer at TechCorp (2020-2024)
    - Developed web applications using React, JavaScript, and Node.js
    - Built RESTful APIs and microservices
    - Worked with MongoDB and PostgreSQL databases
    - Collaborated with cross-functional teams using Agile methodologies
    - Implemented CI/CD pipelines using Jenkins
    
    Software Developer at StartupXYZ (2018-2020)
    - Created responsive web interfaces using HTML, CSS, and JavaScript
    - Developed backend services using Python and Django
    - Worked with MySQL databases
    - Participated in code reviews and testing
    
    EDUCATION:
    Bachelor of Computer Science
    University of Technology (2014-2018)
    GPA: 3.7/4.0
    
    SKILLS:
    Programming Languages: JavaScript, Python, Java, HTML, CSS
    Frameworks: React, Node.js, Django, Express.js
    Databases: MongoDB, PostgreSQL, MySQL
    Tools: Git, Jenkins, Docker, AWS (basic)
    Methodologies: Agile, Scrum
    
    PROJECTS:
    E-commerce Platform - Built using React and Node.js
    Task Management App - Developed with Python and Django
    """

def calculate_ats_score(resume_text, job):
    """
    Calculate ATS score based on the specified factors:
    - Skill Match (Hard Skills): 45%
    - Skill Frequency: 15%
    - Experience Match: 15%
    - Education Match: 10%
    - Keywords & Tools: 15%
    """
    
    # Preprocess texts
    resume_clean = preprocess_text(resume_text)
    job_description = preprocess_text(job.get('description', ''))
    job_title = preprocess_text(job.get('title', ''))
    required_skills = [skill.lower() for skill in job.get('requiredSkills', [])]
    
    # 1. Skill Match (Hard Skills) - 45%
    skill_score = calculate_skill_match(resume_clean, required_skills, job_description)
    
    # 2. Skill Frequency - 15%
    frequency_score = calculate_skill_frequency(resume_clean, required_skills)
    
    # 3. Experience Match - 15%
    experience_score = calculate_experience_match(resume_clean, job_title, job_description)
    
    # 4. Education Match - 10%
    education_score = calculate_education_match(resume_clean, job_description)
    
    # 5. Keywords & Tools - 15%
    keywords_score = calculate_keywords_match(resume_clean, job_description)
    
    # Calculate weighted total score
    total_score = (
        skill_score * 0.45 +
        frequency_score * 0.15 +
        experience_score * 0.15 +
        education_score * 0.10 +
        keywords_score * 0.15
    )
    
    # Ensure score is between 0 and 100
    final_score = max(0, min(100, int(total_score)))
    
    # Generate detailed analysis
    matched_skills, missing_skills, underrepresented_skills = analyze_skills_detailed(
        resume_clean, required_skills, job_description
    )
    
    recommendations = generate_recommendations(
        missing_skills, underrepresented_skills, final_score
    )
    
    return {
        'ats_score': final_score,
        'score_breakdown': {
            'skill_match': round(skill_score, 1),
            'skill_frequency': round(frequency_score, 1),
            'experience_match': round(experience_score, 1),
            'education_match': round(education_score, 1),
            'keywords_tools': round(keywords_score, 1)
        },
        'skill_analysis': {
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'underrepresented_skills': underrepresented_skills
        },
        'recommendations': recommendations,
        'processing_info': {
            'resume_length': len(resume_text),
            'job_description_length': len(job.get('description', '')),
            'total_required_skills': len(required_skills),
            'resume_keywords_count': len(extract_keywords_from_text(resume_clean))
        }
    }

def calculate_skill_match(resume_text, required_skills, job_description):
    """Calculate skill match score (0-100)"""
    if not required_skills:
        return 50  # Neutral score if no skills specified
    
    matched_count = 0
    for skill in required_skills:
        if skill in resume_text:
            matched_count += 1
    
    # Calculate percentage match
    match_percentage = (matched_count / len(required_skills)) * 100
    return match_percentage

def calculate_skill_frequency(resume_text, required_skills):
    """Calculate how frequently skills are mentioned (0-100)"""
    if not required_skills:
        return 50
    
    total_mentions = 0
    for skill in required_skills:
        mentions = resume_text.count(skill)
        if mentions > 0:
            # Give higher score for multiple mentions (up to 3)
            total_mentions += min(mentions, 3)
    
    # Calculate score based on frequency (max 3 mentions per skill)
    max_possible = len(required_skills) * 3
    frequency_score = (total_mentions / max_possible) * 100
    return min(frequency_score, 100)

def calculate_experience_match(resume_text, job_title, job_description):
    """Calculate experience relevance (0-100)"""
    score = 0
    
    # Check for years of experience
    import re
    years_pattern = r'(\d+)\+?\s*years?'
    years_matches = re.findall(years_pattern, resume_text)
    
    if years_matches:
        max_years = max([int(year) for year in years_matches])
        if max_years >= 5:
            score += 40  # Senior level
        elif max_years >= 3:
            score += 30  # Mid level
        elif max_years >= 1:
            score += 20  # Junior level
        else:
            score += 10  # Entry level
    else:
        score += 15  # Default if no years mentioned
    
    # Check for relevant job titles/roles
    relevant_titles = ['developer', 'engineer', 'programmer', 'architect', 'lead', 'senior']
    for title in relevant_titles:
        if title in resume_text:
            score += 10
            break
    
    # Check for leadership/senior experience
    leadership_keywords = ['lead', 'senior', 'manager', 'architect', 'principal']
    for keyword in leadership_keywords:
        if keyword in resume_text:
            score += 15
            break
    
    # Check for relevant industry experience
    if any(word in resume_text for word in ['software', 'technology', 'development', 'programming']):
        score += 15
    
    return min(score, 100)

def calculate_education_match(resume_text, job_description):
    """Calculate education relevance (0-100)"""
    score = 50  # Base score
    
    # Check for relevant degrees
    cs_keywords = ['computer science', 'software engineering', 'information technology', 
                   'computer engineering', 'software development']
    
    for keyword in cs_keywords:
        if keyword in resume_text:
            score += 30
            break
    
    # Check for degree level
    if 'master' in resume_text or 'msc' in resume_text or 'm.s.' in resume_text:
        score += 15
    elif 'bachelor' in resume_text or 'bsc' in resume_text or 'b.s.' in resume_text:
        score += 10
    
    # Check for relevant certifications
    cert_keywords = ['certified', 'certification', 'aws', 'azure', 'google cloud', 'oracle']
    for keyword in cert_keywords:
        if keyword in resume_text:
            score += 5
            break
    
    return min(score, 100)

def calculate_keywords_match(resume_text, job_description):
    """Calculate keywords and tools match (0-100)"""
    # Common technical keywords and tools
    technical_keywords = [
        'api', 'rest', 'restful', 'microservices', 'database', 'sql', 'nosql',
        'cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
        'git', 'github', 'gitlab', 'ci/cd', 'devops', 'agile', 'scrum',
        'testing', 'unit testing', 'integration testing', 'tdd', 'bdd'
    ]
    
    # Extract keywords from job description
    job_keywords = []
    for keyword in technical_keywords:
        if keyword in job_description:
            job_keywords.append(keyword)
    
    if not job_keywords:
        return 50  # Neutral score if no keywords found
    
    # Count matches in resume
    matched_keywords = 0
    for keyword in job_keywords:
        if keyword in resume_text:
            matched_keywords += 1
    
    # Calculate percentage
    keywords_score = (matched_keywords / len(job_keywords)) * 100
    return keywords_score

def analyze_skills_detailed(resume_text, required_skills, job_description):
    """Analyze skills in detail"""
    matched_skills = []
    missing_skills = []
    underrepresented_skills = []
    
    for skill in required_skills:
        skill_count = resume_text.count(skill)
        if skill_count >= 2:
            matched_skills.append(skill.title())
        elif skill_count == 1:
            underrepresented_skills.append(skill.title())
        else:
            missing_skills.append(skill.title())
    
    return matched_skills, missing_skills, underrepresented_skills

def generate_recommendations(missing_skills, underrepresented_skills, score):
    """Generate personalized recommendations"""
    recommendations = []
    
    if score < 60:
        recommendations.append("Your resume needs significant improvement to match this job. Focus on the missing skills and keywords.")
    elif score < 80:
        recommendations.append("Good match! Consider adding the missing skills to strengthen your application.")
    else:
        recommendations.append("Excellent match! Your resume aligns well with the job requirements.")
    
    if missing_skills:
        recommendations.append(f"Add these missing skills to your resume: {', '.join(missing_skills[:3])}")
    
    if underrepresented_skills:
        recommendations.append(f"Mention these skills more frequently: {', '.join(underrepresented_skills[:2])}")
    
    recommendations.append("Include specific examples and achievements for each skill mentioned.")
    recommendations.append("Use keywords from the job description throughout your resume.")
    
    return recommendations[:5]  # Limit to 5 recommendations

if __name__ == '__main__':
    print("Starting SkillSync API server...")
    print("Server will be available at: http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)