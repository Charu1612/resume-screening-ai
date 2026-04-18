import { Navigate } from 'react-router-dom'
import { authAPI } from '../api/auth'

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = authAPI.isAuthenticated()
  const user = authAPI.getCurrentUser()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user?.role === 'candidate' ? '/candidate/dashboard' : '/company/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default ProtectedRoute