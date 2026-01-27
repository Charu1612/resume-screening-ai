from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os
from config import Config

# Import routes
from routes.auth_routes import auth_bp
from routes.job_routes import job_bp
from routes.resume_routes import resume_bp
from routes.application_routes import application_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, origins=Config.CORS_ORIGINS)
    jwt = JWTManager(app)
    
    # Initialize MongoDB
    try:
        client = MongoClient(Config.MONGO_URI)
        app.db = client.get_default_database()
        print("Connected to MongoDB successfully")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None
    
    # Create upload directory
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(job_bp, url_prefix='/api/jobs')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(application_bp, url_prefix='/api/applications')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'SkillSync API is running'})
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    if app:
        app.run(host='0.0.0.0', port=5000, debug=Config.DEBUG)