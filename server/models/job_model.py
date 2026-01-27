from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

class Job:
    def __init__(self, db):
        self.collection = db.jobs
        
    def create_job(self, job_data, company_id):
        """Create a new job posting"""
        job_doc = {
            'title': job_data['title'],
            'companyName': job_data['companyName'],
            'companyId': ObjectId(company_id),
            'location': job_data.get('location', ''),
            'type': job_data.get('type', 'Full-time'),
            'salary': job_data.get('salary', ''),
            'description': job_data['description'],
            'requiredSkills': job_data.get('requiredSkills', []),
            'hrName': job_data.get('hrName', ''),
            'hrContact': job_data.get('hrContact', ''),
            'status': 'active',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(job_doc)
        return str(result.inserted_id)
    
    def get_all_jobs(self, status='active'):
        """Get all active job postings"""
        jobs = list(self.collection.find({'status': status}).sort('created_at', -1))
        for job in jobs:
            job['_id'] = str(job['_id'])
            job['companyId'] = str(job['companyId'])
            job['postedDate'] = self._format_date(job['created_at'])
        return jobs
    
    def get_job_by_id(self, job_id):
        """Get job by ID"""
        job = self.collection.find_one({'_id': ObjectId(job_id)})
        if job:
            job['_id'] = str(job['_id'])
            job['companyId'] = str(job['companyId'])
            job['postedDate'] = self._format_date(job['created_at'])
        return job
    
    def get_company_jobs(self, company_id):
        """Get all jobs posted by a company"""
        jobs = list(self.collection.find({'companyId': ObjectId(company_id)}).sort('created_at', -1))
        for job in jobs:
            job['_id'] = str(job['_id'])
            job['companyId'] = str(job['companyId'])
            job['postedDate'] = self._format_date(job['created_at'])
        return jobs
    
    def update_job(self, job_id, job_data, company_id):
        """Update a job posting"""
        update_data = {
            'title': job_data['title'],
            'companyName': job_data['companyName'],
            'location': job_data.get('location', ''),
            'type': job_data.get('type', 'Full-time'),
            'salary': job_data.get('salary', ''),
            'description': job_data['description'],
            'requiredSkills': job_data.get('requiredSkills', []),
            'hrName': job_data.get('hrName', ''),
            'hrContact': job_data.get('hrContact', ''),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.update_one(
            {'_id': ObjectId(job_id), 'companyId': ObjectId(company_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_job(self, job_id, company_id):
        """Delete a job posting (soft delete by setting status to inactive)"""
        result = self.collection.update_one(
            {'_id': ObjectId(job_id), 'companyId': ObjectId(company_id)},
            {'$set': {'status': 'inactive', 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    def _format_date(self, date):
        """Format date for display"""
        now = datetime.utcnow()
        diff = now - date
        
        if diff.days == 0:
            return "Today"
        elif diff.days == 1:
            return "1 day ago"
        elif diff.days < 7:
            return f"{diff.days} days ago"
        elif diff.days < 30:
            weeks = diff.days // 7
            return f"{weeks} week{'s' if weeks > 1 else ''} ago"
        else:
            return date.strftime("%B %d, %Y")