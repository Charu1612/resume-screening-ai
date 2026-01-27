import { MapPin, Clock, DollarSign } from 'lucide-react'
import SkillTag from './SkillTag'

const JobCard = ({ job, onApply, showApplyButton = true }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-primary-600 font-medium">{job.companyName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
        {job.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
        )}
        {job.type && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {job.type}
          </div>
        )}
        {job.salary && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            {job.salary}
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 5).map((skill, index) => (
              <SkillTag key={index} skill={skill} type="matched" />
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="text-sm text-gray-500">+{job.requiredSkills.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {showApplyButton && (
        <button
          onClick={() => onApply(job)}
          className="btn-primary w-full"
        >
          Apply Now
        </button>
      )}
    </div>
  )
}

export default JobCard