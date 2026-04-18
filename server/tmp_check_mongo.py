from pymongo import MongoClient
from config import Config

print('URI=', Config.MONGO_URI)
client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=3000)
print('Server version:', client.server_info()['version'])
print('Default DB:', client.get_default_database().name)
print('Databases:', client.list_database_names())
