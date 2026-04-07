import { Outlet, Link } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/user" className="text-xl font-bold">
                User Portal
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/user" 
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/user/profile" 
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Profile
              </Link>
              <Link 
                to="/user/settings" 
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Settings
              </Link>
              <Link 
                to="/" 
                className="bg-blue-500 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* User Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default UserLayout
