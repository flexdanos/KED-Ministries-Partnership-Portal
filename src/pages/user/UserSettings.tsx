const UserSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User Settings</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-gray-700">Email notifications for form submissions</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-gray-700">SMS notifications for urgent updates</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <span className="text-gray-700">Weekly activity summary</span>
              </label>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Preferences</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="radio" name="theme" defaultChecked className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-gray-700">Light Theme</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-gray-700">Dark Theme</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-gray-700">System Default</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors">
            Cancel
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserSettings
