import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import AdminProtectedRoute from '../components/AdminProtectedRoute'
import { LogOut, Menu, X } from 'lucide-react'

const AdminLayout = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    window.location.href = '/admin'
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <Link to="/admin/dashboard" className="flex items-center space-x-3">
                  <img src="/IamKed.png" alt="KED Ministries" className="w-8 h-8" />
                  <span className="text-lg font-semibold text-gray-900">Admin Portal</span>
                </Link>
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <Link 
                  to="/admin/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/dashboard')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/users')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Users
                </Link>
                <Link 
                  to="/admin/finance" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/finance')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Finance
                </Link>
                <Link 
                  to="/admin/settings" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute('/admin/settings')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute('/admin/dashboard')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/users" 
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute('/admin/users')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Users
                  </Link>
                  <Link 
                    to="/admin/finance" 
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute('/admin/finance')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Finance
                  </Link>
                  <Link 
                    to="/admin/settings" 
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute('/admin/settings')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </AdminProtectedRoute>
  )
}

export default AdminLayout
