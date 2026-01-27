import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import { Upload, User, Save } from 'lucide-react'
import { authAPI } from '../../api/auth'

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    collegeName: '',
    degree: '',
    specialization: '',
    profilePhoto: null
  })
  const [resume, setResume] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    const user = authAPI.getCurrentUser()
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        collegeName: user.collegeName || '',
        degree: user.degree || '',
        specialization: user.specialization || '',
        profilePhoto: user.profilePhoto || null
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          profilePhoto: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResume(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      setTimeout(() => {
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="candidate" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Update your personal information and resume</p>
            </div>

            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.profilePhoto ? (
                      <img 
                        src={profile.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="btn-secondary cursor-pointer inline-flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={profile.collegeName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={profile.degree}
                        onChange={handleInputChange}
                        placeholder="e.g., Bachelor of Engineering"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={profile.specialization}
                        onChange={handleInputChange}
                        placeholder="e.g., Computer Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Resume</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleResumeUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-600">
                      {resume ? resume.name : 'Click to upload resume'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX up to 10MB
                    </span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Your resume will be automatically analyzed for ATS compatibility and skill matching.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile