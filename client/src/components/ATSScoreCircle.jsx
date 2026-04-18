const ATSScoreCircle = ({ score, size = 120 }) => {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981' // green
    if (score >= 60) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent match! High chance of getting shortlisted.'
    if (score >= 60) return 'Good match. Improve it to increase shortlisting chances.'
    return 'Needs improvement. Consider optimizing your resume.'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{score}%</span>
          <span className="text-sm text-gray-500">ATS Match</span>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-600 text-center max-w-xs">
        {getScoreMessage(score)}
      </p>
    </div>
  )
}

export default ATSScoreCircle