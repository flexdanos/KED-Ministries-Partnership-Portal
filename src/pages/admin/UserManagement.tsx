import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import KedLoader from '../../components/KedLoader'

interface PartnerApplication {
  id: number
  name: string
  email: string
  residence: string
  mobile: string
  partnership_type: string
  payment_method: string
  payment_frequency: string
  notify: boolean
  special_request?: string
  created_at: string
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [users, setUsers] = useState<PartnerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<PartnerApplication | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: partner_applications, error } = await supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUsers(partner_applications || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to fetch users from database')
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = (user: PartnerApplication) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this partner application?')) {
      try {
        const { error } = await supabase
          .from('partner_applications')
          .delete()
          .eq('id', userId)
        
        if (error) throw error
        
        // Refresh users list
        fetchUsers()
      } catch (err) {
        console.error('Error deleting user:', err)
        setError('Failed to delete user')
      }
    }
  }

  const handleCloseModal = () => {
    setShowViewModal(false)
    setSelectedUser(null)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.partnership_type === filterRole
    const matchesPaymentMethod = filterStatus === 'all' || user.payment_method === filterStatus
    return matchesSearch && matchesRole && matchesPaymentMethod
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Applications</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all partner applications</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{users.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
        </div>
        
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{users.length}</div>
            <div className="text-sm text-gray-600">Active Partners</div>
          </div>
        </div>
        
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">+2</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{users.filter(u => u.payment_frequency === 'Monthly').length}</div>
            <div className="text-sm text-gray-600">Monthly Partners</div>
          </div>
        </div>
        
        <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">-5%</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{users.filter(u => u.partnership_type === 'platinum').length}</div>
            <div className="text-sm text-gray-600">Platinum Partners</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pl-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                />
              </div>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
            >
              <option value="all">All Types</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
            >
              <option value="all">All Payment Methods</option>
              <option value="momo">momo</option>
              <option value="bank">bank</option>
            </select>
          </div>
        </div>
      </div>
        
      {/* Loading and Error States */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-center">
            <KedLoader size="xlarge" />
            <span className="ml-2 text-gray-600">Loading partner applications...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Partner Applications Table */}
      {!loading && !error && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Partner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-3 text-white font-bold text-lg">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.mobile}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          user.partnership_type === 'platinum'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : user.partnership_type === 'gold'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : user.partnership_type === 'silver'
                            ? 'bg-gray-100 text-gray-800 border-gray-300'
                            : user.partnership_type === 'bronze'
                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {user.partnership_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.payment_frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.payment_method}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-gray-600 hover:text-gray-900 mr-3 transition-colors bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors bg-red-100 px-3 py-1 rounded-lg hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          
            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{filteredUsers.length}</span> of{' '}
                <span className="font-medium text-gray-900">{users.length}</span> total applications
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all">
                  Previous
                </button>
                <button className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm">
                  1
                </button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Partner Application Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="text-gray-900 font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mobile:</span>
                      <p className="text-gray-900">{selectedUser.mobile}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Residence:</span>
                      <p className="text-gray-900">{selectedUser.residence}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Partnership Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Partnership Type:</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          selectedUser.partnership_type === 'platinum'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : selectedUser.partnership_type === 'gold'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : selectedUser.partnership_type === 'silver'
                            ? 'bg-gray-100 text-gray-800 border-gray-300'
                            : selectedUser.partnership_type === 'bronze'
                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {selectedUser.partnership_type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <p className="text-gray-900">{selectedUser.payment_method}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Payment Frequency:</span>
                      <p className="text-gray-900">{selectedUser.payment_frequency}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Notification:</span>
                      <p className="text-gray-900">{selectedUser.notify ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedUser.special_request && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Special Request</h3>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedUser.special_request}</p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-600">Application Date:</span>
                    <p className="text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()} at {new Date(selectedUser.created_at).toLocaleTimeString()}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
