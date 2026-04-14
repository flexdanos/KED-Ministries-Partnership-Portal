import { useState, useEffect } from 'react'
import { paystackService } from '../../lib/paystack'
import KedLoader from '../../components/KedLoader'

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

interface FinancialStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  totalTransactions: number
  successfulTransactions: number
  pendingTransactions: number
  failedTransactions: number
}

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview')
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([])
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage] = useState(1)
  const [, setTotalPages] = useState(1)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchFinancialData()
  }, [dateRange, currentPage])

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Test Paystack connection first
      console.log('Testing Paystack API connection...')
      try {
        const testResponse = await paystackService.getTransactions({ perPage: 1 })
        console.log('Paystack test successful:', testResponse)
      } catch (testErr) {
        console.error('Paystack test failed:', testErr)
        throw testErr
      }

      // Fetch transactions from Paystack
      const startDate = new Date(dateRange.from)
      const endDate = new Date(dateRange.to)
      
      console.log('Fetching data for date range:', {
        from: dateRange.from,
        to: dateRange.to,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      
      const [transactionsResponse, totalsResponse] = await Promise.all([
        paystackService.getTransactionsByDateRange(startDate, endDate),
        paystackService.getTransactionTotals(startDate, endDate)
      ])
      
      console.log('API responses:', {
        transactionsCount: transactionsResponse.data?.length || 0,
        transactions: transactionsResponse.data,
        totals: totalsResponse
      })

      // Format transactions
      const formattedTransactions = transactionsResponse.data.map(
        transaction => paystackService.formatTransaction(transaction)
      )
      setTransactions(formattedTransactions)

      // Calculate statistics
      const stats = calculateFinancialStats(formattedTransactions)
      setFinancialStats(stats)

      // Set pagination
      setTotalPages(Math.ceil(transactionsResponse.meta.total / transactionsResponse.meta.perPage))

    } catch (err) {
      console.error('Error fetching financial data:', err)
      
      // Type guard for error handling
      const error = err as any
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack,
        name: error.name,
        code: error.code
      })
      
      // Check specific error types
      if (error.status === 401) {
        setError('Authentication failed. Check your Paystack secret key.')
      } else if (error.status === 403) {
        setError('Access forbidden. Check your Paystack permissions.')
      } else if (error.status === 429) {
        setError('Rate limit exceeded. Please try again later.')
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Check your internet connection.')
      } else {
        setError(`Failed to fetch financial data: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateFinancialStats = (
    transactions: FormattedTransaction[]
  ): FinancialStats => {
    const successful = transactions.filter(t => t.status === 'success').length
    const pending = transactions.filter(t => t.status === 'pending').length
    const failed = transactions.filter(t => t.status === 'failed').length
    
    const revenue = transactions
      .filter(t => t.status === 'success' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = Math.abs(
      transactions
        .filter(t => t.status === 'success' && t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)
    )

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      totalTransactions: transactions.length,
      successfulTransactions: successful,
      pendingTransactions: pending,
      failedTransactions: failed
    }
  }

  
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      green: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300'
      },
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300'
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-300'
      }
    }
    return colors[color] || colors.blue
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }

  // Create display stats array from financial data
  const displayStats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(financialStats.totalRevenue),
      icon: 'DollarSign',
      color: 'green',
      trend: financialStats.totalRevenue > 0 ? 'up' : 'neutral',
      change: financialStats.totalRevenue > 0 ? 'Positive' : 'No revenue'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(financialStats.totalExpenses),
      icon: 'TrendingUp',
      color: 'red',
      trend: financialStats.totalExpenses > 0 ? 'up' : 'neutral',
      change: financialStats.totalExpenses > 0 ? 'Active' : 'No expenses'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(financialStats.netProfit),
      icon: 'TrendingUp',
      color: financialStats.netProfit >= 0 ? 'green' : 'red',
      trend: financialStats.netProfit >= 0 ? 'up' : 'down',
      change: financialStats.netProfit >= 0 ? 'Profitable' : 'Loss'
    },
    {
      title: 'Total Transactions',
      value: financialStats.totalTransactions.toString(),
      icon: 'Activity',
      color: 'blue',
      trend: financialStats.totalTransactions > 0 ? 'up' : 'neutral',
      change: financialStats.totalTransactions > 0 ? 'Active' : 'No transactions'
    }
  ]

  const exportData = () => {
    const csv = [
      ['Date', 'Reference', 'Description', 'Amount', 'Status', 'Customer'],
      ...transactions.map(t => [
        t.date,
        t.reference,
        t.description,
        t.amount.toString(),
        t.status,
        t.customer
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const generateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      dateRange,
      stats: financialStats,
      transactions: transactions.slice(0, 100) // Limit to 100 for report
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial_report_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <KedLoader size="xlarge" className="mb-4" />
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchFinancialData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const getIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      DollarSign: 'M12 4c0 1.657-3.134 3-7 3s-7-1.343-7-3m14 0c0 1.657-3.134 3-7 3S0 5.657 0 4m14 0c0-1.657-3.134-3-7-3S0 2.343 0 4m14 8c0 1.657-3.134 3-7 3s-7-1.343-7-3m14 0c0-1.657-3.134-3-7-3s-7 1.343-7 3m14 8c0 1.657-3.134 3-7 3s-7-1.343-7-3m14 0c0-1.657-3.134-3-7-3s-7 1.343-7 3',
      TrendingUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      PieChart: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
      Activity: 'M22 12h-4l-3 9L9 3l-3 9H2'
    }
    return icons[iconName] || ''
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage financial operations</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchFinancialData}
            className="bg-gradient-to-r from-slate-600 to-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:from-slate-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Refresh Data
          </button>
          <button 
            onClick={generateReport}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={transactions.length === 0}
          >
            Generate Report
          </button>
          <button 
            onClick={exportData}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={transactions.length === 0}
          >
            Export Data
          </button>
        </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'transactions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transactions
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => {
              const colorClasses = getColorClasses(stat.color)
              return (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        stat.color === 'green' ? 'from-emerald-500 to-teal-600' :
                        stat.color === 'red' ? 'from-red-500 to-pink-600' :
                        stat.color === 'blue' ? 'from-slate-600 to-slate-700' :
                        'from-amber-500 to-amber-600'
                      } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(stat.icon)} />
                        </svg>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`}>
                        <span className="flex items-center">
                          {stat.trend === 'up' ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : stat.trend === 'down' ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          ) : null}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Transactions */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Recent Transactions
                </span>
                {transactions.length > 5 && (
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    View All
                  </button>
                )}
              </h2>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-600">No transactions found</p>
                  <p className="text-sm text-gray-500 mt-1">Transactions will appear here once they're processed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 hover:scale-102 ${
                      transaction.amount > 0 
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-50 border-emerald-200 hover:from-emerald-100 hover:to-emerald-100' 
                        : 'bg-gradient-to-r from-amber-50 to-amber-50 border-amber-200 hover:from-amber-100 hover:to-amber-100'
                    }`}>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">{transaction.date} · {transaction.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full border ${
                          transaction.status === 'success'
                            ? 'bg-emerald-100 text-emerald-600 border-emerald-300'
                            : transaction.status === 'pending'
                            ? 'bg-amber-100 text-amber-600 border-amber-300'
                            : 'bg-amber-100 text-amber-600 border-amber-300'
                        }`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">All Transactions</h2>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-600">No transactions found</p>
                <p className="text-sm text-gray-500 mt-1">Transactions will appear here once they're processed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:scale-102 ${
                    transaction.amount > 0 
                      ? 'bg-gradient-to-r from-emerald-50 to-emerald-50 border-emerald-200 hover:from-emerald-100 hover:to-emerald-100' 
                      : 'bg-gradient-to-r from-amber-50 to-amber-50 border-amber-200 hover:from-amber-100 hover:to-amber-100'
                  }`}>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-600">{transaction.date} · {transaction.category}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full border ${
                        transaction.status === 'success'
                          ? 'bg-emerald-100 text-emerald-600 border-emerald-300'
                          : transaction.status === 'pending'
                          ? 'bg-amber-100 text-amber-600 border-amber-300'
                          : 'bg-amber-100 text-amber-600 border-amber-300'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceManagement
