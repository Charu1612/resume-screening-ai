from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import bcrypt

class User:
    def __init__(self, db):
        self.collection = db.users
        
    def create_user(self, user_data):
        """Create a new user"""
        # Hash password
        password = user_data['password'].encode('utf-8')
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        
        user_doc = {
            'name': user_data['name'],
            'email': user_data['email'].lower(),
            'password': hashed_password,
            'role': user_data['role'],  # 'candidate' or 'company'
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'profile': {
                'firstName': '',
                'lastName': '',
                'mobile': '',
                'collegeName': '',
                'degree': '',
                'specialization': '',
                'profilePhoto': None,
                'resumeUrl': None
            } if user_data['role'] == 'candidate' else {
                'companyName': user_data['name'],
                'description': '',
                'website': '',
                'location': ''
            }
        }
        
        result = self.collection.insert_one(user_doc)
        return str(result.inserted_id)
    
    def find_by_email(self, email):
        """Find user by email"""
        return self.collection.find_one({'email': email.lower()})
    
    def find_by_id(self, user_id):
        """Find user by ID"""
        return self.collection.find_one({'_id': ObjectId(user_id)})
    
    def verify_password(self, password, hashed_password):
        """Verify password"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
    
    def update_profile(self, user_id, profile_data):
        """Update user profile"""
        update_data = {
            'profile': profile_data,
            'updated_at': datetime.utcnow()
        }
        
        result = self.collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def email_exists(self, email):
        """Check if email already exists"""
        return self.collection.find_one({'email': email.lower()}) is not None