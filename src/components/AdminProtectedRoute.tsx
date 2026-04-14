import React from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import KedLoader from './KedLoader'
import { Shield } from 'lucide-react'


const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAdminAuthenticated')
      
      if (authStatus === 'true') {
        setIsAuthenticated(true)
              } else {
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    // Check auth every 5 seconds
    const interval = setInterval(checkAuth, 5000)
    return () => clearInterval(interval)
  }, [location])

  // Show loading spinner while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <KedLoader size="large" className="mb-4" />
          <p className="text-gray-600 text-lg">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />
  }

  // Render protected content if authenticated
  return <>{children}</>
}

export default AdminProtectedRoute
