import { Link } from 'react-router-dom'
import { CheckCircle, Play, Eye } from 'lucide-react'

const Landing = () => {
  const features = [
    'ATS Resume Checker',
    'Job Scan & Match Score',
    'AI Resume Tools'
  ]

  const companies = ['Google', 'Target', 'Fender', 'Microsoft', 'Apple', 'Netflix']

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">SkillSync</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features & How It Works</a>
              <a href="#tracker" className="text-gray-600 hover:text-gray-900">Layoffs Tracker</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-navy mb-6">
                Land More Interviews
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                SkillSync analyzes your resume using AI, compares it with job descriptions, 
                identifies missing skills & keywords, and provides an ATS match score. 
                Get auto-optimize keyword suggestions to boost your chances.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="btn-secondary flex items-center justify-center">
                  <Eye className="w-5 h-5 mr-2" />
                  VIEW SAMPLE
                </button>
                <Link to="/signup" className="btn-primary flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  TRY FOR FREE
                </Link>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:pl-12">
              <div className="bg-white rounded-lg shadow-xl p-8 border">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary-600 mb-4">
                    Revolutionize Your Job Search with SkillSync
                  </h3>
                  <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">85%</span>
                      </div>
                      <p className="text-gray-600">ATS Match Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Trusted by professionals at leading companies
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <span className="text-gray-600 font-semibold">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">SkillSync</h2>
            <p className="text-gray-300 mb-8">
              Revolutionize your job search with AI-powered resume analysis
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/signup" className="btn-primary">
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing