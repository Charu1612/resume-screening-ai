import { NavLink } from 'react-router-dom'
import { Home, Briefcase, BarChart3, Building2, User } from 'lucide-react'

const Sidebar = ({ userRole }) => {
  const candidateLinks = [
    { to: '/candidate/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/candidate/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/candidate/ats-analyzer', icon: BarChart3, label: 'ATS Analyzer' },
    { to: '/candidate/companies', icon: Building2, label: 'Companies' },
    { to: '/candidate/profile', icon: User, label: 'My Profile' },
  ]

  const companyLinks = [
    { to: '/company/dashboard', icon: Home, label: 'Home' },
    { to: '/company/job-vacancies', icon: Briefcase, label: 'Job Vacancies' },
    { to: '/company/applications', icon: User, label: 'Applications / Profiles' },
  ]

  const links = userRole === 'candidate' ? candidateLinks : companyLinks

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">SkillSync</h1>
      </div>
      
      <nav className="mt-6">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar