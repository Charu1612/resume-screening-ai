import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import { Eye, Check, X, Download, User } from 'lucide-react'
import { applicationsAPI } from '../../api/applications'

const Applications = () => {
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getCompanyApplications()
      const applicationsData = response.data.map(app => ({
        _id: app._id,
        candidateName: app.candidateName,
        email: app.email,
        jobTitle: app.job.title,
        appliedDate: app.appliedDate,
        status: app.status,
        matchScore: app.matchScore || 75,
        degree: app.degree,
        experience: app.experience,
        profilePhoto: app.candidate?.profile?.profilePhoto || null,
        resumeUrl: app.resumeUrl,
        skills: app.candidate?.profile?.skills || [],
        mobile: app.candidate?.profile?.mobile || ''
      }))
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error fetching applications:', error)
      // Fallback to mock data for demo
      setApplications([
        {
          _id: '1',
          candidateName: 'John Smith',
          email: 'john.smith@email.com',
          jobTitle: 'Senior Software Engineer',
          appliedDate: '2024-01-25',
          status: 'pending',
          matchScore: 85,
          degree: 'Bachelor of Computer Science',
          experience: '5 years',
          profilePhoto: null,
          resumeUrl: '/resumes/john-smith-resume.pdf',
          skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
          mobile: '+1-555-0123'
        },
        {
          _id: '2',
          candidateName: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          jobTitle: 'Frontend Developer',
          appliedDate: '2024-01-24',
          status: 'pending',
          matchScore: 78,
          degree: 'Bachelor of Information Technology',
          experience: '3 years',
          profilePhoto: null,
          resumeUrl: '/resumes/sarah-johnson-resume.pdf',
          skills: ['React', 'JavaScript', 'CSS', 'HTML'],
          mobile: '+1-555-0124'
        },
        {
          _id: '3',
          candidateName: 'Mike Chen',
          email: 'mike.chen@email.com',
          jobTitle: 'Backend Developer',
          appliedDate: '2024-01-23',
          status: 'accepted',
          matchScore: 92,
          degree: 'Master of Computer Science',
          experience: '7 years',
          profilePhoto: null,
          resumeUrl: '/resumes/mike-chen-resume.pdf',
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          mobile: '+1-555-0125'
        },
        {
          _id: '4',
          candidateName: 'Emily Davis',
          email: 'emily.davis@email.com',
          jobTitle: 'Full Stack Developer',
          appliedDate: '2024-01-22',
          status: 'rejected',
          matchScore: 73,
          degree: 'Bachelor of Software Engineering',
          experience: '4 years',
          profilePhoto: null,
          resumeUrl: '/resumes/emily-davis-resume.pdf',
          skills: ['Vue.js', 'Express.js', 'MongoDB', 'Git'],
          mobile: '+1-555-0126'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, newStatus)
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      )
      setSuccessMessage(`Application ${newStatus} successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update application status. Please try again.')
    }
  }

  const handleViewProfile = (application) => {
    setSelectedApplication(application)
    setShowProfileModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50'
      case 'rejected':
        return 'text-red-600 bg-red-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="company" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="company" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Applications & Profiles</h1>
              <p className="text-gray-600">Review and manage candidate applications</p>
            </div>

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Candidate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Position</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Applied Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Match Score</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              {application.profilePhoto ? (
                                <img 
                                  src={application.profilePhoto} 
                                  alt={application.candidateName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {application.candidateName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {application.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{application.jobTitle}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${application.matchScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {application.matchScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewProfile(application)}
                              className="p-1 text-gray-400 hover:text-primary-600"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {application.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                  className="p-1 text-gray-400 hover:text-green-600"
                                  title="Accept"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No applications received yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Candidate Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  {selectedApplication.profilePhoto ? (
                    <img 
                      src={selectedApplication.profilePhoto} 
                      alt={selectedApplication.candidateName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedApplication.candidateName}
                  </h3>
                  <p className="text-gray-600">{selectedApplication.email}</p>
                  <p className="text-gray-600">{selectedApplication.mobile}</p>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applied Position
                  </label>
                  <p className="text-gray-900">{selectedApplication.jobTitle}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Match Score
                  </label>
                  <p className="text-gray-900">{selectedApplication.matchScore}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <p className="text-gray-900">{selectedApplication.degree}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <p className="text-gray-900">{selectedApplication.experience}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                <button className="flex items-center text-primary-600 hover:text-primary-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </button>
              </div>

              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication._id, 'accepted')
                      setShowProfileModal(false)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Accept Candidate
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication._id, 'rejected')
                      setShowProfileModal(false)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Reject Candidate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Applications