from models.user_model import User
from models.job_model import Job
from models.application_model import Application
from config import Config
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from bson import ObjectId

client = MongoClient(Config.MONGO_URI)
db = client.skillsync

user_model = User(db)
job_model = Job(db)
app_model = Application(db)

# Create test company user
company_data = {
    'name': 'Test Company',
    'email': 'company@test.com',
    'password': generate_password_hash('password123'),
    'role': 'company'
}
company_id = user_model.create_user(company_data)
print(f'Created company with ID: {company_id}')

# Create test candidate user
candidate_data = {
    'name': 'John Doe',
    'email': 'candidate@test.com',
    'password': generate_password_hash('password123'),
    'role': 'candidate'
}
candidate_id = user_model.create_user(candidate_data)
print(f'Created candidate with ID: {candidate_id}')

# Create test job
job_data = {
    'title': 'Software Engineer',
    'companyName': 'Test Company',
    'companyId': company_id,
    'description': 'We are looking for a skilled software engineer',
    'requiredSkills': ['Python', 'React', 'MongoDB'],
    'location': 'Remote',
    'salary': '80000-100000'
}
job_id = job_model.create_job(job_data)
print(f'Created job with ID: {job_id}')

# Create test application
application_data = {
    'candidateId': candidate_id,
    'jobId': job_id,
    'candidateName': 'John Doe',
    'email': 'candidate@test.com',
    'degree': 'Bachelor of Computer Science',
    'experience': '3 years',
    'resumeUrl': None,
    'matchScore': 85
}
app_id = app_model.create_application(application_data)
print(f'Created application with ID: {app_id}')

print('Test data created successfully!')
print('Company login: company@test.com / password123')
print('Candidate login: candidate@test.com / password123')