import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import ATSScoreCircle from '../../components/ATSScoreCircle'
import SkillTag from '../../components/SkillTag'
import { Upload, FileText, BarChart3 } from 'lucide-react'
import { resumeAPI } from '../../api/resume'

const ATSAnalyzer = () => {
  const [resume, setResume] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResume(file)
    }
  }

  const handleAnalyze = async () => {
    if ((!resume && !resumeText.trim()) || !jobDescription.trim()) {
      alert('Please upload a resume or enter resume text, and provide a job description')
      return
    }

    setIsAnalyzing(true)
    
    try {
      let response;
      
      if (resume) {
        // File upload case - send as FormData
        const formData = new FormData()
        formData.append('resume', resume)
        formData.append('jobDescription', jobDescription)
        
        response = await fetch('http://localhost:5001/api/resume/analyze', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Failed to analyze resume')
        }
        
        const data = await response.json()
        setAnalysis(data)
        
      } else {
        // Text input case - send as JSON
        const analysisData = {
          resumeText: resumeText,
          jobDescription: jobDescription
        }
        
        response = await resumeAPI.analyzeResume(analysisData)
        setAnalysis(response.data)
      }
      
    } catch (error) {
      console.error('Error analyzing resume:', error)
      alert('Failed to analyze resume. Please try again.')
      
      // Fallback to mock analysis for demo
      setAnalysis({
        ats_score: 73,
        score_breakdown: {
          skill_match: 65.0,
          skill_frequency: 45.0,
          experience_match: 80.0,
          education_match: 70.0,
          keywords_tools: 55.0
        },
        skill_analysis: {
          matched_skills: ['JavaScript', 'React', 'Node.js'],
          missing_skills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
          underrepresented_skills: ['Python', 'MongoDB']
        },
        recommendations: [
          'Add TypeScript to your technical skills section',
          'Include cloud platform experience (AWS preferred)',
          'Mention containerization tools like Docker',
          'Highlight database management experience'
        ]
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const extractSkillsFromJobDescription = (description) => {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
      'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Git', 'Jenkins', 'HTML', 'CSS', 'Angular', 'Vue.js'
    ]
    
    return commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    )
  }

  const getDefaultResumeText = () => {
    return `John Doe
Software Developer
Email: john.doe@email.com

EXPERIENCE:
Senior Software Developer at TechCorp (2020-2024)
- Developed web applications using React, JavaScript, and Node.js
- Built RESTful APIs and microservices
- Worked with MongoDB and PostgreSQL databases

EDUCATION:
Bachelor of Computer Science
University of Technology (2014-2018)

SKILLS:
JavaScript, Python, React, Node.js, MongoDB, Git`
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="candidate" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Analyzer</h1>
              <p className="text-gray-600">Upload your resume and job description to get an ATS compatibility score</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Resume Upload/Text Input */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Resume Input</h2>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      onChange={handleResumeUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      {resume ? (
                        <div className="flex items-center justify-center">
                          <FileText className="w-8 h-8 text-green-500 mr-3" />
                          <div>
                            <p className="text-green-600 font-medium">{resume.name}</p>
                            <p className="text-sm text-gray-500">Click to change</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload your resume</p>
                          <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Text Input Alternative */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste your resume text here
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here for instant analysis..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Job Description</h2>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>

            {/* Analyze Button */}
            <div className="text-center mb-6">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resume || !jobDescription.trim()}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-6">
                {/* ATS Score and Breakdown */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* ATS Score Circle */}
                  <div className="card text-center">
                    <h3 className="text-lg font-semibold mb-4">Overall ATS Score</h3>
                    <ATSScoreCircle score={analysis.ats_score} size={150} />
                  </div>

                  {/* Score Breakdown */}
                  <div className="lg:col-span-2 card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Score Breakdown
                    </h3>
                    <div className="space-y-3">
                      {analysis.score_breakdown && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Skill Match (Hard Skills)</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${analysis.score_breakdown.skill_match}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {analysis.score_breakdown.skill_match}%
                              </span>
                              <span className="text-xs text-gray-500 w-8">45%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Skill Frequency</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${analysis.score_breakdown.skill_frequency}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {analysis.score_breakdown.skill_frequency}%
                              </span>
                              <span className="text-xs text-gray-500 w-8">15%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Experience Match</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${analysis.score_breakdown.experience_match}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {analysis.score_breakdown.experience_match}%
                              </span>
                              <span className="text-xs text-gray-500 w-8">15%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Education Match</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-orange-600 h-2 rounded-full" 
                                  style={{ width: `${analysis.score_breakdown.education_match}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {analysis.score_breakdown.education_match}%
                              </span>
                              <span className="text-xs text-gray-500 w-8">10%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Keywords & Tools</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-600 h-2 rounded-full" 
                                  style={{ width: `${analysis.score_breakdown.keywords_tools}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {analysis.score_breakdown.keywords_tools}%
                              </span>
                              <span className="text-xs text-gray-500 w-8">15%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      * Percentages on the right show the weight of each factor in the total score
                    </div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Skills Analysis</h3>
                  
                  <div className="space-y-4">
                    {/* Matched Skills */}
                    <div>
                      <h4 className="text-md font-medium text-green-700 mb-2">
                        ✓ Matched Skills ({analysis.skill_analysis.matched_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skill_analysis.matched_skills.map((skill, index) => (
                          <SkillTag key={index} skill={skill} type="matched" />
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="text-md font-medium text-red-700 mb-2">
                        ✗ Missing Skills ({analysis.skill_analysis.missing_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skill_analysis.missing_skills.map((skill, index) => (
                          <SkillTag key={index} skill={skill} type="missing" />
                        ))}
                      </div>
                    </div>

                    {/* Underrepresented Skills */}
                    <div>
                      <h4 className="text-md font-medium text-yellow-700 mb-2">
                        ⚠ Underrepresented Skills ({analysis.skill_analysis.underrepresented_skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skill_analysis.underrepresented_skills.map((skill, index) => (
                          <SkillTag key={index} skill={skill} type="underrepresented" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATSAnalyzer