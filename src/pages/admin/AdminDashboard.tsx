import { useState } from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-dark-textSecondary">
            Welcome to the admin dashboard. Monitor and manage the KED Ministries Portal.
          </p>
        </div>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                timeRange === range
                  ? 'bg-dark-primary text-white shadow-lg'
                  : 'bg-dark-surface border border-dark-border text-dark-textSecondary hover:text-dark-text'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link to="/admin/users" className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">👥</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">247</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +12% from last {timeRange}
            </div>
          </div>
        </Link>
        
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📝</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,429</div>
            <div className="text-sm text-gray-600">Form Submissions</div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +8% from last {timeRange}
            </div>
          </div>
        </div>
        
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📋</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">89</div>
            <div className="text-sm text-gray-600">Active Forms</div>
            <div className="mt-2 text-xs text-yellow-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              -2% from last {timeRange}
            </div>
          </div>
        </div>
        
        <Link to="/admin/finance" className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">💰</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$124.5K</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +18% from last {timeRange}
            </div>
          </div>
        </Link>
        
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">⏳</div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
            <div className="mt-2 text-xs text-orange-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Requires attention
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity, Status, and Finance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">New user registration</div>
                  <div className="text-sm text-gray-600">Sarah Johnson joined the platform</div>
                </div>
                <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">5 min ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Payment received</div>
                  <div className="text-sm text-gray-600">Ministry Event Registration - $2,500</div>
                </div>
                <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Form submitted</div>
                  <div className="text-sm text-gray-600">Ministry Registration Form</div>
                </div>
                <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">3 hours ago</span>
              </div>
              <Link to="/admin/finance" className="block w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 py-3 rounded-xl font-medium">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-900 font-medium">Database</span>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-900 font-medium">API Server</span>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Running
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-900 font-medium">Email Service</span>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-900 font-medium">Storage</span>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  78% Used
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
              <span className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Financial Overview
              </span>
              <Link to="/admin/finance" className="text-sm text-gray-600 hover:text-gray-900 transition-colors bg-gray-100 px-3 py-1 rounded-lg">
                Details →
              </Link>
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="text-sm text-gray-600">Revenue</div>
                  <div className="text-lg font-bold text-green-600">$124,563</div>
                </div>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+12.5%</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="text-sm text-gray-600">Expenses</div>
                  <div className="text-lg font-bold text-red-600">$87,234</div>
                </div>
                <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">+8.2%</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                  <div className="text-lg font-bold text-blue-600">$37,329</div>
                </div>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+18.7%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/admin/users" className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Manage Users</div>
                  <div className="text-sm text-gray-600">Add or edit users</div>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/finance" className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">View Finance</div>
                  <div className="text-sm text-gray-600">Financial reports</div>
                </div>
              </div>
            </Link>
            
            <button className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Export analytics</div>
                </div>
              </div>
            </button>
            
            <button className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Settings</div>
                  <div className="text-sm text-gray-600">System config</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
