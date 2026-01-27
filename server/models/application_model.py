from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

class Application:
    def __init__(self, db):
        self.collection = db.applications
        
    def create_application(self, application_data):
        """Create a new job application"""
        app_doc = {
            'candidateId': ObjectId(application_data['candidateId']),
            'jobId': ObjectId(application_data['jobId']),
            'candidateName': application_data['candidateName'],
            'email': application_data['email'],
            'degree': application_data['degree'],
            'experience': application_data['experience'],
            'resumeUrl': application_data.get('resumeUrl'),
            'status': 'pending',  # pending, accepted, rejected
            'matchScore': application_data.get('matchScore', 0),
            'appliedDate': datetime.utcnow(),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.insert_one(app_doc)
        return str(result.inserted_id)
    
    def get_candidate_applications(self, candidate_id):
        """Get all applications by a candidate"""
        pipeline = [
            {'$match': {'candidateId': ObjectId(candidate_id)}},
            {'$lookup': {
                'from': 'jobs',
                'localField': 'jobId',
                'foreignField': '_id',
                'as': 'job'
            }},
            {'$unwind': '$job'},
            {'$sort': {'appliedDate': -1}}
        ]
        
        applications = list(self.collection.aggregate(pipeline))
        for app in applications:
            app['_id'] = str(app['_id'])
            app['candidateId'] = str(app['candidateId'])
            app['jobId'] = str(app['jobId'])
            app['job']['_id'] = str(app['job']['_id'])
            app['job']['companyId'] = str(app['job']['companyId'])
        
        return applications
    
    def get_company_applications(self, company_id):
        """Get all applications for a company's jobs"""
        pipeline = [
            {'$lookup': {
                'from': 'jobs',
                'localField': 'jobId',
                'foreignField': '_id',
                'as': 'job'
            }},
            {'$unwind': '$job'},
            {'$match': {'job.companyId': ObjectId(company_id)}},
            {'$lookup': {
                'from': 'users',
                'localField': 'candidateId',
                'foreignField': '_id',
                'as': 'candidate'
            }},
            {'$unwind': '$candidate'},
            {'$sort': {'appliedDate': -1}}
        ]
        
        applications = list(self.collection.aggregate(pipeline))
        for app in applications:
            app['_id'] = str(app['_id'])
            app['candidateId'] = str(app['candidateId'])
            app['jobId'] = str(app['jobId'])
            app['job']['_id'] = str(app['job']['_id'])
            app['job']['companyId'] = str(app['job']['companyId'])
            app['candidate']['_id'] = str(app['candidate']['_id'])
        
        return applications
    
    def get_application_by_id(self, application_id):
        """Get application by ID"""
        pipeline = [
            {'$match': {'_id': ObjectId(application_id)}},
            {'$lookup': {
                'from': 'jobs',
                'localField': 'jobId',
                'foreignField': '_id',
                'as': 'job'
            }},
            {'$unwind': '$job'},
            {'$lookup': {
                'from': 'users',
                'localField': 'candidateId',
                'foreignField': '_id',
                'as': 'candidate'
            }},
            {'$unwind': '$candidate'}
        ]
        
        result = list(self.collection.aggregate(pipeline))
        if result:
            app = result[0]
            app['_id'] = str(app['_id'])
            app['candidateId'] = str(app['candidateId'])
            app['jobId'] = str(app['jobId'])
            app['job']['_id'] = str(app['job']['_id'])
            app['job']['companyId'] = str(app['job']['companyId'])
            app['candidate']['_id'] = str(app['candidate']['_id'])
            return app
        return None
    
    def update_status(self, application_id, status):
        """Update application status"""
        result = self.collection.update_one(
            {'_id': ObjectId(application_id)},
            {'$set': {'status': status, 'updated_at': datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    def check_existing_application(self, candidate_id, job_id):
        """Check if candidate has already applied to this job"""
        return self.collection.find_one({
            'candidateId': ObjectId(candidate_id),
            'jobId': ObjectId(job_id)
        }) is not None
    
    def get_application_stats(self, company_id):
        """Get application statistics for a company"""
        pipeline = [
            {'$lookup': {
                'from': 'jobs',
                'localField': 'jobId',
                'foreignField': '_id',
                'as': 'job'
            }},
            {'$unwind': '$job'},
            {'$match': {'job.companyId': ObjectId(company_id)}},
            {'$group': {
                '_id': '$status',
                'count': {'$sum': 1}
            }}
        ]
        
        stats = list(self.collection.aggregate(pipeline))
        result = {'pending': 0, 'accepted': 0, 'rejected': 0, 'total': 0}
        
        for stat in stats:
            result[stat['_id']] = stat['count']
            result['total'] += stat['count']
        
        return result