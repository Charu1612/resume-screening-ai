import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    acceptedCandidates: 0
  })
  const [recentApplications, setRecentApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo
      setTimeout(() => {
        setStats({
          totalJobs: 8,
          totalApplications: 45,
          pendingReviews: 12,
          acceptedCandidates: 18
        })

        setRecentApplications([
          {
            id: '1',
            candidateName: 'John Smith',
            jobTitle: 'Senior Software Engineer',
            appliedDate: '2024-01-25',
            status: 'pending',
            matchScore: 85
          },
          {
            id: '2',
            candidateName: 'Sarah Johnson',
            jobTitle: 'Frontend Developer',
            appliedDate: '2024-01-24',
            status: 'pending',
            matchScore: 78
          },
          {
            id: '3',
            candidateName: 'Mike Chen',
            jobTitle: 'Backend Developer',
            appliedDate: '2024-01-23',
            status: 'accepted',
            matchScore: 92
          },
          {
            id: '4',
            candidateName: 'Emily Davis',
            jobTitle: 'Full Stack Developer',
            appliedDate: '2024-01-22',
            status: 'pending',
            matchScore: 73
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setIsLoading(false)
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
        <Sidebar userRole="company" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600">Overview of your job postings and applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Eye className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Accepted</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.acceptedCandidates}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </button>
              </div>

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
                    {recentApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary-600 font-medium text-sm">
                                {application.candidateName.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {application.candidateName}
                            </span>
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
                          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard