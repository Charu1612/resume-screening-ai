from models.user_model import User
from models.job_model import Job
from models.application_model import Application
from config import Config
from pymongo import MongoClient
import os

client = MongoClient(Config.MONGO_URI)
db = client.skillsync

user_model = User(db)
job_model = Job(db)
app_model = Application(db)

print('Users:', list(user_model.collection.find({}, {'_id': 1, 'name': 1, 'email': 1, 'role': 1})))
print('Jobs:', list(job_model.collection.find({}, {'_id': 1, 'title': 1, 'companyName': 1})))
print('Applications:', list(app_model.collection.find({}, {'_id': 1, 'candidateName': 1, 'status': 1})))