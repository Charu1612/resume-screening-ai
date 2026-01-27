import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import JobCard from '../../components/JobCard'
import ApplyJobModal from '../../components/ApplyJobModal'
import { jobsAPI } from '../../api/jobs'

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAllJobs()
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Fallback to mock data for demo
      setJobs([
        {
          _id: '1',
          title: 'Senior Software Engineer',
          companyName: 'Visa',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$120k - $180k',
          description: 'We are looking for a Senior Software Engineer to join our payments team. You will work on building scalable systems that process millions of transactions daily.',
          requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
          postedDate: '2 days ago'
        },
        {
          _id: '2',
          title: 'Full Stack Developer',
          companyName: 'Google',
          location: 'Mountain View, CA',
          type: 'Full-time',
          salary: '$130k - $200k',
          description: 'Join our team to build next-generation web applications. Work with cutting-edge technologies and collaborate with world-class engineers.',
          requiredSkills: ['JavaScript', 'Python', 'React', 'Docker', 'GCP'],
          postedDate: '1 week ago'
        },
        {
          _id: '3',
          title: 'Frontend Engineer',
          companyName: 'Netflix',
          location: 'Los Gatos, CA',
          type: 'Full-time',
          salary: '$110k - $160k',
          description: 'Help us create amazing user experiences for millions of Netflix users worldwide. Work on our web platform and mobile applications.',
          requiredSkills: ['React', 'TypeScript', 'CSS', 'Jest', 'Webpack'],
          postedDate: '3 days ago'
        },
        {
          _id: '4',
          title: 'Backend Developer',
          companyName: 'Microsoft',
          location: 'Seattle, WA',
          type: 'Full-time',
          salary: '$125k - $175k',
          description: 'Build robust backend services for Microsoft Azure. Work with microservices architecture and cloud-native technologies.',
          requiredSkills: ['C#', 'Azure', 'SQL Server', 'Docker', 'Kubernetes'],
          postedDate: '5 days ago'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleApplicationSuccess = () => {
    setSuccessMessage('Job Applied Successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="candidate" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
              <p className="text-gray-600">Find your next opportunity</p>
            </div>

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="grid gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApply={handleApply}
                />
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No jobs available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyJobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  )
}

export default Jobs