# 🚀 SkillSync - Quick Start Guide

## ✅ Current Status
Both servers are running successfully!

- **Frontend**: http://localhost:3000 ✅
- **Backend API**: http://localhost:5001 ✅

## 🎯 How to Use the Application

### 1. Open the Application
Navigate to: **http://localhost:3000**

### 2. Create an Account
1. Click "Get Started" or "Sign Up"
2. Fill in your details:
   - Name
   - Email
   - Password
   - Role: Choose either **Candidate** or **Company**

### 3. For Candidates:
After logging in, you can:
- **Dashboard**: View ATS analysis for jobs
- **Jobs**: Browse available positions and apply
- **ATS Analyzer**: Upload resume and analyze against job descriptions
- **Companies**: Track your applications and their status
- **Profile**: Manage your personal information and resume

### 4. For Companies:
After logging in, you can:
- **Dashboard**: View application statistics
- **Job Vacancies**: Post and manage job openings
- **Applications**: Review candidate applications and resumes

## 🔧 Technical Details

### Backend API Endpoints (http://localhost:5001/api)
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /jobs` - Get all jobs
- `POST /jobs` - Create job (Company only)
- `POST /applications` - Apply to job (Candidate only)
- `POST /resume/analyze` - Analyze resume against job

### Frontend Features
- Professional ATS/SaaS dashboard design
- Role-based authentication and routing
- Responsive design with Tailwind CSS
- Interactive components and modals
- Real-time form validation

## 🎨 Key Features Demonstrated

### ATS Score Analysis
- Upload resume and get compatibility score
- Skill matching (matched, missing, underrepresented)
- Actionable recommendations for improvement

### Job Application Flow
- Browse jobs with detailed descriptions
- Apply with resume upload
- Track application status

### Company Management
- Post job vacancies with requirements
- Review applications with match scores
- Accept/reject candidates

## 🛠 Development Notes

### Current Implementation
- **Simplified Backend**: Using in-memory storage (no MongoDB required)
- **Mock Data**: Sample jobs and realistic ATS scoring
- **Core Features**: All main functionality is working
- **Professional UI**: Clean, modern design

### For Production
To make this production-ready:
1. Set up MongoDB database
2. Implement proper file upload handling
3. Add advanced NLP for resume parsing
4. Implement email notifications
5. Add comprehensive error handling
6. Set up proper authentication security

## 🎉 Demo Scenarios

### Test as a Candidate:
1. Sign up as a candidate
2. Go to Jobs page and apply to "Senior Software Engineer" at Visa
3. Visit ATS Analyzer to check resume compatibility
4. Check Companies page to see application status

### Test as a Company:
1. Sign up as a company
2. Post a new job vacancy
3. View applications from candidates
4. Review candidate profiles and resumes

## 🔄 Restarting Servers

If you need to restart the servers:

### Backend:
```bash
cd resume-screening-ai/server
python app_simple.py
```

### Frontend:
```bash
cd resume-screening-ai/client
npm run dev
```

## 🎯 Next Steps

The application is fully functional for demonstration purposes. You can:
1. Test all the features mentioned above
2. Customize the UI/UX as needed
3. Add more sophisticated algorithms
4. Integrate with real databases and services
5. Deploy to production environments

---

**Enjoy exploring SkillSync!** 🚀