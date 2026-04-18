import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CandidateDashboard from './pages/candidate/Dashboard'
import CandidateJobs from './pages/candidate/Jobs'
import ATSAnalyzer from './pages/candidate/ATSAnalyzer'
import CandidateCompanies from './pages/candidate/Companies'
import CandidateProfile from './pages/candidate/Profile'
import CompanyDashboard from './pages/company/Dashboard'
import JobVacancies from './pages/company/JobVacancies'
import Applications from './pages/company/Applications'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute role="candidate">
              <CandidateJobs />
            </ProtectedRoute>
          } />
          <Route path="/candidate/ats-analyzer" element={
            <ProtectedRoute role="candidate">
              <ATSAnalyzer />
            </ProtectedRoute>
          } />
          <Route path="/candidate/companies" element={
            <ProtectedRoute role="candidate">
              <CandidateCompanies />
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute role="candidate">
              <CandidateProfile />
            </ProtectedRoute>
          } />
          
          {/* Company Routes */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company/job-vacancies" element={
            <ProtectedRoute role="company">
              <JobVacancies />
            </ProtectedRoute>
          } />
          <Route path="/company/applications" element={
            <ProtectedRoute role="company">
              <Applications />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App