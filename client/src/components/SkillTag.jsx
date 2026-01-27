const SkillTag = ({ skill, type = 'matched', frequency }) => {
  const getTagStyles = () => {
    switch (type) {
      case 'matched':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'underrepresented':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTagStyles()}`}>
      {skill}
      {frequency && (
        <span className="ml-2 text-xs opacity-75">
          ({frequency}x)
        </span>
      )}
    </span>
  )
}

export default SkillTag