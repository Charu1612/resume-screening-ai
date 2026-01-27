# SkillSync - Resume Screening & Skill Matching System

A full-stack web application that uses AI to analyze resumes, match them with job descriptions, and provide ATS compatibility scores to help candidates improve their job applications and companies find better candidates.

## 🚀 Features

### For Candidates
- **ATS Resume Checker**: Get compatibility scores for your resume against job descriptions
- **Job Matching**: Browse jobs and see match percentages
- **Skill Analysis**: Identify missing skills and get improvement recommendations
- **Application Tracking**: Track your job applications and their status
- **Profile Management**: Maintain your professional profile and resume

### For Companies
- **Job Posting**: Post job vacancies with detailed requirements
- **Application Management**: Review candidate applications with match scores
- **Candidate Screening**: View detailed candidate profiles and resumes
- **Dashboard Analytics**: Track application statistics and metrics

## 🛠 Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive UI
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Python Flask** for REST API
- **MongoDB** for data storage
- **JWT** for authentication
- **PyPDF2 & python-docx** for resume parsing
- **NLTK & spaCy** for natural language processing
- **scikit-learn** for skill matching algorithms

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (v4.4 or higher)
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd resume-screening-ai
```

### 2. Frontend Setup
```bash
cd client
npm install
```

### 3. Backend Setup
```bash
cd ../server
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
# In the server directory
cp .env.example .env
# Edit .env file with your configuration
```

### 5. Database Setup
Make sure MongoDB is running on your system. The application will create the necessary collections automatically.

### 6. Download NLP Models (Optional)
```bash
python -m spacy download en_core_web_sm
python -m nltk.downloader punkt stopwords
```

## 🚀 Running the Application

### Start the Backend Server
```bash
cd server
python app.py
```
The API will be available at `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd client
npm run dev
```
The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
resume-screening-ai/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/               # API service functions
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   │   ├── candidate/    # Candidate-specific pages
│   │   │   └── company/      # Company-specific pages
│   │   ├── routes/           # Route protection
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                    # Python Flask backend
│   ├── models/               # Database models
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic services
│   ├── utils/                # Utility functions
│   ├── app.py               # Main application file
│   ├── config.py            # Configuration settings
│   └── requirements.txt     # Python dependencies
└── README.md
```

## 🔑 Key Features Explained

### ATS Score Calculation
The system analyzes resumes using multiple factors:
- **Skill Matching (40%)**: Comparison of candidate skills with job requirements
- **Keyword Density (20%)**: Relevance of resume content to job description
- **Experience Relevance (20%)**: Match between candidate experience and job level
- **Education Relevance (10%)**: Educational background alignment
- **Resume Structure (10%)**: Completeness and organization of resume

### Skill Matching Algorithm
- Extracts technical skills from resumes and job descriptions
- Uses NLP techniques for text preprocessing and normalization
- Identifies matched, missing, and underrepresented skills
- Provides actionable recommendations for improvement

### Resume Parsing
- Supports PDF, DOC, and DOCX formats
- Extracts text, skills, experience, education, and contact information
- Uses pattern matching and NLP for information extraction

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Candidate/Company)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (Company only)
- `GET /api/jobs/company` - Get company jobs
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Resume Analysis
- `POST /api/resume/upload` - Upload and parse resume
- `POST /api/resume/analyze` - Analyze resume against job
- `GET /api/resume/ats-score/:jobId` - Get ATS score
- `GET /api/resume/skill-analysis/:jobId` - Get skill analysis

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/candidate` - Get candidate applications
- `GET /api/applications/company` - Get company applications
- `PUT /api/applications/:id/status` - Update application status

## 🎨 UI/UX Features

- **Professional ATS/SaaS Dashboard Design**
- **Responsive Layout** for all device sizes
- **Interactive Components** with hover effects and animations
- **Color-coded Skill Tags** for easy identification
- **Progress Indicators** for ATS scores and match percentages
- **Modal Dialogs** for forms and detailed views

## 🔮 Future Enhancements

- AI-powered resume optimization suggestions
- Integration with job boards and LinkedIn
- Advanced analytics and reporting
- Email notifications for application updates
- Bulk resume processing for companies
- Machine learning model improvements
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- OpenAI for inspiration on AI-powered text analysis
- The open-source community for the amazing libraries and tools
- Contributors and testers who helped improve the application

---

**SkillSync** - Revolutionizing the job search and recruitment process with AI-powered resume analysis and skill matching.