import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  name: string
  isDemo: boolean
}

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<AdminUser | null>(null)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('isAdminAuthenticated')
        const userStr = localStorage.getItem('adminUser')
        const loginTime = localStorage.getItem('adminLoginTime')

        if (!authStatus || !userStr || !loginTime) {
          setIsAuthenticated(false)
          return
        }

        const user = JSON.parse(userStr) as AdminUser
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)

        // Check if session is older than 24 hours
        if (hoursSinceLogin > 24) {
          console.log('Session expired')
          localStorage.removeItem('isAdminAuthenticated')
          localStorage.removeItem('adminLoginTime')
          localStorage.removeItem('adminUser')
          setIsAuthenticated(false)
          return
        }

        // Check if user has admin privileges
        if (user.role !== 'admin' && user.role !== 'super_admin') {
          console.log('User lacks admin privileges:', user.role)
          setIsAuthenticated(false)
          return
        }

        setUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    // Check auth every minute
    const interval = setInterval(checkAuth, 60000)
    return () => clearInterval(interval)
  }, [])

  // Show loading spinner while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-xtra-navy flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-xtra-primary rounded-full mb-4">
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-300 text-sm">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Render protected content if authenticated
  return <>{children}</>
}

export default AdminProtectedRoute
