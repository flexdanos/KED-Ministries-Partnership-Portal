import { Outlet, Link } from 'react-router-dom'

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Admin Navigation */}
      <nav className="bg-dark-surface/90 backdrop-blur-xl border-b border-dark-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-dark-primary to-dark-accent rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xl font-bold gradient-text">Admin Portal</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                to="/admin/dashboard" 
                className="text-dark-textSecondary hover:text-dark-text hover:bg-dark-surfaceHover px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/users" 
                className="text-dark-textSecondary hover:text-dark-text hover:bg-dark-surfaceHover px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Users
              </Link>
              <Link 
                to="/admin/settings" 
                className="text-dark-textSecondary hover:text-dark-text hover:bg-dark-surfaceHover px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="relative">
        <div className="absolute inset-0 bg-dark-gradient opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
