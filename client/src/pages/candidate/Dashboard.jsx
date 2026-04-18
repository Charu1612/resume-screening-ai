import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import TopNavbar from '../../components/TopNavbar'
import ATSScoreCircle from '../../components/ATSScoreCircle'
import SkillTag from '../../components/SkillTag'

const Dashboard = () => {
  const [atsData, setAtsData] = useState({
    score: 71,
    matchedSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
    missingSkills: ['TypeScript', 'AWS', 'Docker'],
    underrepresentedSkills: ['Python', 'SQL']
  })

  const [jobDescription] = useState(`
We are looking for a Senior Software Engineer to join our team. The ideal candidate will have:

• 5+ years of experience in full-stack development
• Strong proficiency in React, TypeScript, and Node.js
• Experience with cloud platforms (AWS preferred)
• Knowledge of containerization (Docker, Kubernetes)
• Database experience with MongoDB and SQL
• Understanding of microservices architecture
• Experience with CI/CD pipelines

Responsibilities:
• Design and develop scalable web applications
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews and technical discussions
  `)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="candidate" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar 
          jobTitle="Software Engineer – Lead Level"
          companyName="Visa"
          showATSBadge={true}
        />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - ATS Score */}
            <div className="lg:col-span-2 space-y-6">
              {/* ATS Score Section */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">ATS Match Analysis</h2>
                <div className="flex justify-center mb-6">
                  <ATSScoreCircle score={atsData.score} />
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Skill Analysis</h3>
                
                <div className="space-y-6">
                  {/* Matched Skills */}
                  <div>
                    <h4 className="text-md font-medium text-green-700 mb-3">
                      ✓ Matched Skills ({atsData.matchedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsData.matchedSkills.map((skill, index) => (
                        <SkillTag key={index} skill={skill} type="matched" />
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h4 className="text-md font-medium text-red-700 mb-3">
                      ✗ Missing Skills ({atsData.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsData.missingSkills.map((skill, index) => (
                        <SkillTag key={index} skill={skill} type="missing" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Consider adding these skills to your resume or gaining experience in these areas.
                    </p>
                  </div>

                  {/* Underrepresented Skills */}
                  <div>
                    <h4 className="text-md font-medium text-yellow-700 mb-3">
                      ⚠ Underrepresented Skills ({atsData.underrepresentedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {atsData.underrepresentedSkills.map((skill, index) => (
                        <SkillTag key={index} skill={skill} type="underrepresented" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      These skills appear in your resume but could be mentioned more frequently.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">
                      Add TypeScript experience to your skills section and provide specific examples of projects.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">
                      Include AWS certifications or cloud project experience to strengthen your profile.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <p className="text-gray-700">
                      Mention Docker and containerization experience more prominently in your work history.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Job Description */}
            <div className="card h-fit">
              <h3 className="text-lg font-semibold mb-4">Job Description</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {jobDescription}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard