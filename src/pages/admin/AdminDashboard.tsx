import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { paystackService, type PaystackTransaction } from '../../lib/paystack'
import KedLoader from '../../components/KedLoader'
import { Users, DollarSign, CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react'

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

interface FormattedTransaction {
  id: string
  reference: string
  date: string
  description: string
  category: string
  amount: number
  status: string
  customer: string
  paymentMethod: string
  metadata: any
}

interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  totalTransactions: number
  pendingReviews: number
  successfulTransactions: number
  failedTransactions: number
}

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [users, setUsers] = useState<PartnerApplication[]>([])
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    pendingReviews: 0,
    successfulTransactions: 0,
    failedTransactions: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch users from Supabase
      const { data: partnerApplications, error: usersError } = await supabase
        .from('partner_applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (usersError) throw usersError
      setUsers(partnerApplications || [])

      // Fetch transactions from Paystack
      const endDate = new Date()
      const startDate = getStartDateForTimeRange(timeRange)
      
      const [transactionsResponse, totalsResponse] = await Promise.all([
        paystackService.getTransactionsByDateRange(startDate, endDate),
        paystackService.getTransactionTotals(startDate, endDate)
      ])
      
      const formattedTransactions = transactionsResponse.data.map(
        transaction => paystackService.formatTransaction(transaction)
      )
      setTransactions(formattedTransactions)

      // Calculate stats
      const calculatedStats = calculateDashboardStats(
        partnerApplications || [],
        formattedTransactions,
        totalsResponse
      )
      setStats(calculatedStats)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStartDateForTimeRange = (range: 'week' | 'month' | 'year'): Date => {
    const now = new Date()
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7))
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1))
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1))
      default:
        return new Date(now.setMonth(now.getMonth() - 1))
    }
  }

  const calculateDashboardStats = (
    users: PartnerApplication[],
    transactions: FormattedTransaction[],
    totals: any
  ): DashboardStats => {
    // Calculate total users (partner applications)
    const totalUsers = users.length
    
    // Calculate pending reviews (new applications in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const pendingReviews = users.filter(user => 
      new Date(user.created_at) > sevenDaysAgo
    ).length

    // Calculate financial stats
    const successfulTransactions = transactions.filter(t => t.status === 'success')
    const failedTransactions = transactions.filter(t => t.status === 'failed')
    const totalRevenue = successfulTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalTransactions = transactions.length

    return {
      totalUsers,
      totalRevenue,
      totalTransactions,
      pendingReviews,
      successfulTransactions: successfulTransactions.length,
      failedTransactions: failedTransactions.length
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }


  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <KedLoader size="xlarge" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={fetchDashboardData}
              className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Monitor and manage the KED Ministries Portal.
          </p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              disabled={loading}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/users" className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="mt-2 text-xs text-gray-500">
                Partner applications
              </div>
            </div>
          </Link>
          
          <Link to="/admin/finance" className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="mt-2 text-xs text-gray-500">
                From {stats.totalTransactions} transactions
              </div>
            </div>
          </Link>
          
          <div className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.successfulTransactions}</div>
              <div className="text-sm text-gray-600">Successful</div>
              <div className="mt-2 text-xs text-gray-500">
                Completed transactions
              </div>
            </div>
          </div>
          
          <div className="group">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">{stats.pendingReviews}</div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
              <div className="mt-2 text-xs text-gray-500">
                New this week
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Status Chart */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Transaction Status</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Successful</span>
                  <span className="text-sm font-semibold text-emerald-600">{stats.successfulTransactions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${stats.totalTransactions > 0 ? (stats.successfulTransactions / stats.totalTransactions) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Failed</span>
                  <span className="text-sm font-semibold text-amber-600">{stats.failedTransactions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${stats.totalTransactions > 0 ? (stats.failedTransactions / stats.totalTransactions) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {users.slice(0, 2).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">New partner application</div>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {transactions.slice(0, 2).map((transaction) => (
                <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                  transaction.amount > 0 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-600">{formatCurrency(Math.abs(transaction.amount))}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    transaction.status === 'success' 
                      ? 'text-emerald-700 bg-emerald-100' 
                      : 'text-amber-700 bg-amber-100'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              ))}
              {users.length === 0 && transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
