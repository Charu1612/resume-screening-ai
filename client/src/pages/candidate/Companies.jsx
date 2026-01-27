import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import { Building2, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'
import { applicationsAPI } from '../../api/applications'

const Companies = () => {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusNotification, setStatusNotification] = useState('')

  useEffect(() => {
    fetchApplications()
    
    // Auto-refresh every 30 seconds to show real-time updates
    const interval = setInterval(() => {
      fetchApplications()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchApplications = async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true)
    }
    
    try {
      const response = await applicationsAPI.getCandidateApplications()
      const applicationsData = response.data.map(app => ({
        id: app._id,
        companyName: app.job.companyName,
        jobTitle: app.job.title,
        appliedDate: app.appliedDate,
        status: app.status,
        matchPercentage: app.matchScore || 75,
        logo: app.job.companyName.charAt(0),
        updatedAt: app.updated_at
      }))
      
      // Check for status changes if this is a refresh
      if (showRefreshing && applications.length > 0) {
        const statusChanges = applicationsData.filter(newApp => {
          const oldApp = applications.find(app => app.id === newApp.id)
          return oldApp && oldApp.status !== newApp.status
        })
        
        if (statusChanges.length > 0) {
          const change = statusChanges[0]
          setStatusNotification(`Your application to ${change.companyName} has been ${change.status}!`)
          setTimeout(() => setStatusNotification(''), 5000)
        }
      }
      
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error fetching applications:', error)
      // Fallback to mock data for demo
      setApplications([
        {
          id: '1',
          companyName: 'Visa',
          jobTitle: 'Senior Software Engineer',
          appliedDate: '2024-01-20',
          status: 'accepted',
          matchPercentage: 85,
          logo: 'V'
        },
        {
          id: '2',
          companyName: 'Google',
          jobTitle: 'Full Stack Developer',
          appliedDate: '2024-01-18',
          status: 'pending',
          matchPercentage: 78,
          logo: 'G'
        },
        {
          id: '3',
          companyName: 'Netflix',
          jobTitle: 'Frontend Engineer',
          appliedDate: '2024-01-15',
          status: 'rejected',
          matchPercentage: 72,
          logo: 'N'
        },
        {
          id: '4',
          companyName: 'Microsoft',
          jobTitle: 'Backend Developer',
          appliedDate: '2024-01-12',
          status: 'accepted',
          matchPercentage: 88,
          logo: 'M'
        }
      ])
    } finally {
      setIsLoading(false)
      if (showRefreshing) {
        setIsRefreshing(false)
      }
    }
  }

  const handleRefresh = () => {
    fetchApplications(true)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Resume Accepted'
      case 'rejected':
        return 'Not Selected'
      case 'pending':
        return 'Under Review'
      default:
        return 'Unknown'
    }
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
        <Sidebar userRole="candidate" />
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
      <Sidebar userRole="candidate" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600">Track your job applications and their status</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
              </button>
            </div>

            {statusNotification && (
              <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {statusNotification}
                </div>
              </div>
            )}

            <div className="grid gap-6">
              {applications.map((application) => (
                <div key={application.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-lg">
                          {application.logo}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.jobTitle}
                        </h3>
                        <p className="text-primary-600 font-medium">
                          {application.companyName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                        {application.updatedAt && application.status !== 'pending' && (
                          <p className="text-xs text-gray-400">
                            Status updated: {new Date(application.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-2">{getStatusText(application.status)}</span>
                      </div>
                      
                      {application.status === 'accepted' && (
                        <div className="text-xs text-green-600 font-medium mb-2">
                          🎉 Congratulations! Your application was accepted
                        </div>
                      )}
                      
                      {application.status === 'rejected' && (
                        <div className="text-xs text-red-600 mb-2">
                          Application was not selected this time
                        </div>
                      )}
                      
                      {application.status === 'pending' && (
                        <div className="text-xs text-yellow-600 mb-2">
                          Application under review
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-sm text-gray-600">Match:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${application.matchPercentage}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {application.matchPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No applications yet</p>
                <p className="text-gray-400">Start applying to jobs to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Companies