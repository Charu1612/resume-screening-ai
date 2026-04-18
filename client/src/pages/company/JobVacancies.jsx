import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import { jobsAPI } from '../../api/jobs'

const JobVacancies = () => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requiredSkills: '',
    hrName: '',
    hrContact: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getCompanyJobs()
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Fallback to mock data for demo
      setJobs([
        {
          _id: '1',
          title: 'Senior Software Engineer',
          companyName: 'TechCorp',
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$120k - $180k',
          description: 'We are looking for a Senior Software Engineer to join our team...',
          requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
          hrName: 'John Doe',
          hrContact: '+1-555-0123',
          applicationsCount: 15,
          postedDate: '2024-01-20'
        },
        {
          _id: '2',
          title: 'Frontend Developer',
          companyName: 'TechCorp',
          location: 'Remote',
          type: 'Full-time',
          salary: '$90k - $130k',
          description: 'Join our frontend team to build amazing user experiences...',
          requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML'],
          hrName: 'Jane Smith',
          hrContact: '+1-555-0124',
          applicationsCount: 8,
          postedDate: '2024-01-18'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim())
      }

      if (editingJob) {
        // Update existing job
        await jobsAPI.updateJob(editingJob._id, jobData)
        setSuccessMessage('Job updated successfully!')
      } else {
        // Create new job
        await jobsAPI.createJob(jobData)
        setSuccessMessage('Job posted successfully! It will now appear in the candidate jobs list.')
      }

      // Reset form
      setFormData({
        title: '',
        companyName: '',
        location: '',
        type: 'Full-time',
        salary: '',
        description: '',
        requiredSkills: '',
        hrName: '',
        hrContact: ''
      })
      setShowForm(false)
      setEditingJob(null)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
      
      // Refresh jobs list
      fetchJobs()
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job. Please try again.')
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requiredSkills: job.requiredSkills.join(', '),
      hrName: job.hrName,
      hrContact: job.hrContact
    })
    setShowForm(true)
  }

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        console.log('Deleting job:', jobId)
        fetchJobs()
      } catch (error) {
        console.error('Error deleting job:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="company" />
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
      <Sidebar userRole="company" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Job Vacancies</h1>
                <p className="text-gray-600">Manage your job postings</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Job Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingJob ? 'Edit Job' : 'Post New Job'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Type
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Salary Range
                        </label>
                        <input
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          placeholder="e.g., $80k - $120k"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Required Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="requiredSkills"
                        value={formData.requiredSkills}
                        onChange={handleInputChange}
                        placeholder="React, Node.js, TypeScript, AWS"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          HR Name
                        </label>
                        <input
                          type="text"
                          name="hrName"
                          value={formData.hrName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          HR Contact Number
                        </label>
                        <input
                          type="tel"
                          name="hrContact"
                          value={formData.hrContact}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false)
                          setEditingJob(null)
                          setFormData({
                            title: '',
                            companyName: '',
                            location: '',
                            type: 'Full-time',
                            salary: '',
                            description: '',
                            requiredSkills: '',
                            hrName: '',
                            hrContact: ''
                          })
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-primary"
                      >
                        {editingJob ? 'Update Job' : 'Post Job'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Jobs List */}
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-primary-600 font-medium">{job.companyName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        {job.salary && <span>{job.salary}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicationsCount} applications
                      </div>
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                    <span>HR: {job.hrName} ({job.hrContact})</span>
                  </div>
                </div>
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No jobs posted yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary mt-4"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobVacancies