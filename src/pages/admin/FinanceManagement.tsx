import { useState } from 'react'

const FinanceManagement = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budget'>('overview')

  const financialStats = [
    {
      title: 'Total Revenue',
      amount: '$124,563',
      change: '+12.5%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'green'
    },
    {
      title: 'Total Expenses',
      amount: '$87,234',
      change: '+8.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'red'
    },
    {
      title: 'Net Profit',
      amount: '$37,329',
      change: '+18.7%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'blue'
    },
    {
      title: 'Budget Used',
      amount: '78%',
      change: '-2.1%',
      trend: 'down',
      icon: 'PieChart',
      color: 'purple'
    }
  ]

  const transactions = [
    {
      id: 'TRX001',
      date: '2024-04-08',
      description: 'Ministry Event Registration',
      category: 'Revenue',
      amount: 2500,
      status: 'completed'
    },
    {
      id: 'TRX002',
      date: '2024-04-07',
      description: 'Office Supplies',
      category: 'Expenses',
      amount: -342,
      status: 'completed'
    },
    {
      id: 'TRX003',
      date: '2024-04-06',
      description: 'Donation - General Fund',
      category: 'Revenue',
      amount: 1500,
      status: 'completed'
    },
    {
      id: 'TRX004',
      date: '2024-04-05',
      description: 'Website Hosting',
      category: 'Expenses',
      amount: -89,
      status: 'pending'
    },
    {
      id: 'TRX005',
      date: '2024-04-04',
      description: 'Conference Registration',
      category: 'Revenue',
      amount: 3200,
      status: 'completed'
    }
  ]

  const budgetCategories = [
    {
      category: 'Operations',
      budget: 50000,
      spent: 42000,
      percentage: 84
    },
    {
      category: 'Marketing',
      budget: 25000,
      spent: 18000,
      percentage: 72
    },
    {
      category: 'Events',
      budget: 40000,
      spent: 35000,
      percentage: 87.5
    },
    {
      category: 'Technology',
      budget: 20000,
      spent: 15000,
      percentage: 75
    },
    {
      category: 'Administration',
      budget: 15000,
      spent: 12000,
      percentage: 80
    }
  ]

  const getIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      DollarSign: 'M12 4c0 1.657-3.134 3-7 3s-7-1.343-7-3m14 0c0 1.657-3.134 3-7 3S0 5.657 0 4m14 0c0-1.657-3.134-3-7-3S0 2.343 0 4m14 8c0 1.657-3.134 3-7 3s-7-1.343-7-3m14 0c0-1.657-3.134-3-7-3s-7 1.343-7 3m14 8c0 1.657-3.134 3-7 3s-7-1.343-7-3m14 0c0-1.657-3.134-3-7-3s-7 1.343-7 3',
      TrendingUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      PieChart: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
    }
    return icons[iconName] || icons.DollarSign
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30'
      },
      red: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/30'
      },
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30'
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      }
    }
    return colors[color] || colors.green
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Finance Management</h1>
          <p className="text-dark-textSecondary mt-1">Monitor and manage financial operations</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gradient-to-r from-dark-primary to-dark-accent text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Generate Report
          </button>
          <button className="bg-dark-surface border border-dark-border text-dark-text px-4 py-2 rounded-lg font-medium hover:bg-dark-surfaceHover transition-all duration-300">
            Export Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-surface/50 p-1 rounded-lg border border-dark-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-dark-primary text-white shadow-lg'
              : 'text-dark-textSecondary hover:text-dark-text'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'transactions'
              ? 'bg-dark-primary text-white shadow-lg'
              : 'text-dark-textSecondary hover:text-dark-text'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'budget'
              ? 'bg-dark-primary text-white shadow-lg'
              : 'text-dark-textSecondary hover:text-dark-text'
          }`}
        >
          Budget
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialStats.map((stat, index) => {
              const colorClasses = getColorClasses(stat.color)
              return (
                <div key={index} className="glass-card-hover group cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-dark-primary to-dark-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(stat.icon)} />
                        </svg>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border}`}>
                        <span className="flex items-center">
                          {stat.trend === 'up' ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-dark-text mb-1">{stat.amount}</div>
                    <div className="text-sm text-dark-textSecondary">{stat.title}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Transactions and Budget Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Transactions */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Recent Transactions
                  </span>
                  <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    View All
                  </button>
                </h2>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">{transaction.date} · {transaction.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full border ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-600 border-green-300'
                            : 'bg-yellow-100 text-yellow-600 border-yellow-300'
                        }`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Overview</h2>
                <div className="space-y-4">
                  {budgetCategories.map((budget, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{budget.category}</span>
                        <span className="text-sm text-gray-600">
                          ${budget.spent.toLocaleString()} / ${budget.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            budget.percentage >= 90 ? 'bg-red-500' :
                            budget.percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{budget.percentage}% used</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Transactions</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                />
                <select className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-all">
                  <option>All Types</option>
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                            <div className="text-sm text-gray-600">{transaction.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-300`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Budget Categories */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Categories</h2>
                <div className="space-y-4">
                  {budgetCategories.map((budget, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">{budget.category}</span>
                        <span className="text-sm text-gray-600">
                          ${budget.spent.toLocaleString()} / ${budget.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            budget.percentage >= 90 ? 'bg-red-500' :
                            budget.percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">{budget.percentage}% utilized</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Budget Summary</h2>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${budgetCategories.reduce((sum, cat) => sum + cat.budget, 0).toLocaleString()}
                    </div>
                    <div className="text-gray-500">Total Budget</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${budgetCategories.reduce((sum, cat) => sum + cat.spent, 0).toLocaleString()}
                    </div>
                    <div className="text-gray-500">Total Spent</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${(budgetCategories.reduce((sum, cat) => sum + cat.budget, 0) - budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)).toLocaleString()}
                    </div>
                    <div className="text-gray-500">Remaining Budget</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceManagement
