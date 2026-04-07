const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
        <p className="text-dark-textSecondary">
          Welcome to the admin dashboard. Monitor and manage the KED Ministries Portal.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card-hover group cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">👥</div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-dark-text mb-1">247</div>
            <div className="text-sm text-dark-textSecondary">Total Users</div>
          </div>
        </div>
        
        <div className="glass-card-hover group cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📝</div>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-dark-text mb-1">1,429</div>
            <div className="text-sm text-dark-textSecondary">Form Submissions</div>
          </div>
        </div>
        
        <div className="glass-card-hover group cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📋</div>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-dark-text mb-1">89</div>
            <div className="text-sm text-dark-textSecondary">Active Forms</div>
          </div>
        </div>
        
        <div className="glass-card-hover group cursor-pointer">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">⏳</div>
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-dark-text mb-1">12</div>
            <div className="text-sm text-dark-textSecondary">Pending Reviews</div>
          </div>
        </div>
      </div>
      
      {/* Activity and Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-dark-text mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div>
                  <div className="font-medium text-dark-text">New user registration</div>
                  <div className="text-sm text-dark-textMuted">Sarah Johnson joined the platform</div>
                </div>
                <span className="text-sm text-dark-textMuted">5 min ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div>
                  <div className="font-medium text-dark-text">Form submitted</div>
                  <div className="text-sm text-dark-textMuted">Ministry Registration Form</div>
                </div>
                <span className="text-sm text-dark-textMuted">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div>
                  <div className="font-medium text-dark-text">System update</div>
                  <div className="text-sm text-dark-textMuted">Security patches applied</div>
                </div>
                <span className="text-sm text-dark-textMuted">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-dark-text mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-dark-text">Database</span>
                </div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-dark-text">API Server</span>
                </div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                  Running
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-dark-text">Email Service</span>
                </div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-dark-text">Storage</span>
                </div>
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium border border-yellow-500/30">
                  78% Used
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
