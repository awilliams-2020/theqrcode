'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  QrCode,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  Zap
} from 'lucide-react'

interface MetricsData {
  period: number
  userAcquisition: {
    total: number
    newInPeriod: number
    growthRate: number
    dailySignups: Array<{ date: string; count: number }>
  }
  conversion: {
    planDistribution: Array<{ plan: string; count: number }>
    freeToAnyPaidRate: number
    paidUsers: number
    freeUsers: number
    activeTrials: number
    convertedTrials: number
    trialConversionRate: number
  }
  churn: {
    rate: number
    cancelledInPeriod: number
    downgradesInPeriod: number
    deletedAccountsInPeriod: number
    totalAtRisk: number
    monthlyTrend: Array<{ month: string; rate: number }>
  }
  revenue: {
    mrr: number
    arr: number
    arpu: number
    growthRate: number
    byPlan: Array<{ plan: string; subscribers: number; mrr: number }>
    newSubscriptions: number
  }
  featureUsage: {
    qrCodes: {
      total: number
      newInPeriod: number
      dynamic: number
      avgScansPerCode: number
      byType: Array<{ type: string; count: number }>
    }
    scans: {
      total: number
      inPeriod: number
      dailyScans: Array<{ date: string; count: number }>
    }
    api: {
      activeKeys: number
      callsInPeriod: number
    }
    engagement: {
      rate: number
      activeUsers: number
    }
    topUsers: Array<{
      id: string
      name: string
      email: string
      qrCodes: number
      apiKeys: number
      plan: string
    }>
  }
}

export default function AdminMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/metrics?period=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setMetrics(data)
      } else {
        throw new Error(data.error || 'Failed to load metrics')
      }
    } catch (err) {
      console.error('Error fetching metrics:', err)
      setError(err instanceof Error ? err.message : 'Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const TrendIndicator = ({ value, reverse = false }: { value: number; reverse?: boolean }) => {
    const isPositive = reverse ? value < 0 : value > 0
    const isNegative = reverse ? value > 0 : value < 0
    
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${
        isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
      }`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : isNegative ? <TrendingDown className="h-4 w-4" /> : null}
        {Math.abs(value).toFixed(1)}%
      </span>
    )
  }

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    iconColor = 'text-blue-600',
    reverseTrend = false
  }: { 
    title: string
    value: string | number
    subtitle?: string
    icon: React.ComponentType<{ className?: string }>
    trend?: number
    iconColor?: string
    reverseTrend?: boolean
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <TrendIndicator value={trend} reverse={reverseTrend} />
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading metrics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Metrics</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Time Period:</span>
          </div>
          <div className="flex gap-2">
            {['7', '30', '90', '180', '365'].map((days) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days === '7' ? '7 days' : days === '30' ? '30 days' : days === '90' ? '3 months' : days === '180' ? '6 months' : '1 year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* USER ACQUISITION METRICS */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          User Acquisition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Users"
            value={metrics.userAcquisition.total.toLocaleString()}
            icon={Users}
            iconColor="text-blue-600"
          />
          <MetricCard
            title="New Users"
            value={metrics.userAcquisition.newInPeriod.toLocaleString()}
            subtitle={`Last ${period} days`}
            icon={TrendingUp}
            trend={metrics.userAcquisition.growthRate}
            iconColor="text-green-600"
          />
          <MetricCard
            title="Growth Rate"
            value={`${metrics.userAcquisition.growthRate.toFixed(1)}%`}
            subtitle="Period over period"
            icon={Activity}
            iconColor="text-purple-600"
          />
        </div>

        {/* Daily Signups Chart */}
        {metrics.userAcquisition.dailySignups.length > 0 && (
          <div className="mt-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Signups</h3>
            <div className="space-y-4">
              {/* Chart */}
              <div className="h-48 flex items-end justify-between gap-1">
                {metrics.userAcquisition.dailySignups.map((day, idx) => {
                  const maxCount = Math.max(...metrics.userAcquisition.dailySignups.map(d => d.count))
                  const height = maxCount > 0 ? Math.max((day.count / maxCount) * 100, day.count > 0 ? 5 : 0) : 0
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      {/* Count label above bar */}
                      {day.count > 0 && (
                        <div className="text-xs font-semibold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.count}
                        </div>
                      )}
                      {/* Bar */}
                      <div 
                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative"
                        style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none z-10">
                          {day.date}: {day.count} users
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Summary Stats */}
              <div className="pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.userAcquisition.dailySignups.reduce((sum, d) => sum + d.count, 0)}
                  </p>
                  <p className="text-xs text-gray-600">Total Signups</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {(metrics.userAcquisition.dailySignups.reduce((sum, d) => sum + d.count, 0) / metrics.userAcquisition.dailySignups.length).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600">Daily Average</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...metrics.userAcquisition.dailySignups.map(d => d.count))}
                  </p>
                  <p className="text-xs text-gray-600">Peak Day</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.userAcquisition.dailySignups.filter(d => d.count > 0).length}
                  </p>
                  <p className="text-xs text-gray-600">Active Days</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONVERSION METRICS */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-green-600" />
          Conversion Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Free to Paid Rate"
            value={`${metrics.conversion.freeToAnyPaidRate.toFixed(1)}%`}
            subtitle={`${metrics.conversion.paidUsers} paid users`}
            icon={Target}
            iconColor="text-green-600"
          />
          <MetricCard
            title="Active Trials"
            value={metrics.conversion.activeTrials.toLocaleString()}
            subtitle="Currently in trial"
            icon={Zap}
            iconColor="text-yellow-600"
          />
          <MetricCard
            title="Trial Conversion"
            value={`${metrics.conversion.trialConversionRate.toFixed(1)}%`}
            subtitle={`${metrics.conversion.convertedTrials} converted`}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
          <MetricCard
            title="Free Users"
            value={metrics.conversion.freeUsers.toLocaleString()}
            subtitle="Potential conversions"
            icon={Users}
            iconColor="text-gray-600"
          />
        </div>

        {/* Plan Distribution */}
        <div className="mt-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {metrics.conversion.planDistribution.map((plan) => {
              const total = metrics.conversion.planDistribution.reduce((sum, p) => sum + p.count, 0)
              const percentage = total > 0 ? (plan.count / total) * 100 : 0
              const planColors: Record<string, string> = {
                free: 'bg-gray-500',
                starter: 'bg-blue-500',
                pro: 'bg-purple-500',
                business: 'bg-green-500'
              }
              return (
                <div key={plan.plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{plan.plan}</span>
                    <span className="text-sm text-gray-600">{plan.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${planColors[plan.plan] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CHURN ANALYSIS */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-red-600" />
          Churn Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Churn Rate"
            value={`${metrics.churn.rate.toFixed(1)}%`}
            subtitle="Period churn"
            icon={AlertCircle}
            iconColor="text-red-600"
            trend={-metrics.churn.rate}
            reverseTrend={true}
          />
          <MetricCard
            title="Cancellations"
            value={metrics.churn.cancelledInPeriod.toLocaleString()}
            subtitle={`Last ${period} days`}
            icon={TrendingDown}
            iconColor="text-red-600"
          />
          <MetricCard
            title="Downgrades"
            value={metrics.churn.downgradesInPeriod.toLocaleString()}
            subtitle="Active users to free"
            icon={TrendingDown}
            iconColor="text-orange-600"
          />
          <MetricCard
            title="Deleted Accounts"
            value={metrics.churn.deletedAccountsInPeriod.toLocaleString()}
            subtitle="Account deletions"
            icon={Users}
            iconColor="text-purple-600"
          />
          <MetricCard
            title="Total Churned"
            value={metrics.churn.totalAtRisk.toLocaleString()}
            subtitle="All churn types"
            icon={AlertCircle}
            iconColor="text-yellow-600"
          />
        </div>

        {/* Monthly Churn Trend */}
        {metrics.churn.monthlyTrend.length > 0 && (
          <div className="mt-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Churn Trend</h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {metrics.churn.monthlyTrend.map((month, idx) => {
                const maxRate = Math.max(...metrics.churn.monthlyTrend.map(m => m.rate))
                const height = maxRate > 0 ? (month.rate / maxRate) * 100 : 0
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                    <div 
                      className="w-full bg-red-500 rounded-t hover:bg-red-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none z-10">
                        {month.month}: {month.rate}%
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left whitespace-nowrap">
                      {month.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* REVENUE TRACKING */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          Revenue Tracking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(metrics.revenue.mrr)}
            subtitle="MRR"
            icon={DollarSign}
            trend={metrics.revenue.growthRate}
            iconColor="text-green-600"
          />
          <MetricCard
            title="Annual Recurring Revenue"
            value={formatCurrency(metrics.revenue.arr)}
            subtitle="ARR"
            icon={TrendingUp}
            iconColor="text-green-600"
          />
          <MetricCard
            title="ARPU"
            value={formatCurrency(metrics.revenue.arpu)}
            subtitle="Average revenue per user"
            icon={Users}
            iconColor="text-blue-600"
          />
          <MetricCard
            title="New Subscriptions"
            value={metrics.revenue.newSubscriptions.toLocaleString()}
            subtitle={`Last ${period} days`}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
        </div>

        {/* Revenue by Plan */}
        <div className="mt-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {metrics.revenue.byPlan.map((plan) => (
              <div key={plan.plan} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{plan.plan}</p>
                  <p className="text-sm text-gray-600">{plan.subscribers} subscribers</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(plan.mrr)}</p>
                  <p className="text-sm text-gray-600">MRR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE USAGE ANALYTICS */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          Feature Usage Analytics
        </h2>
        
        {/* QR Code Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <MetricCard
            title="Total QR Codes"
            value={metrics.featureUsage.qrCodes.total.toLocaleString()}
            subtitle={`${metrics.featureUsage.qrCodes.newInPeriod} new`}
            icon={QrCode}
            iconColor="text-purple-600"
          />
          <MetricCard
            title="Dynamic QR Codes"
            value={metrics.featureUsage.qrCodes.dynamic.toLocaleString()}
            subtitle={`${metrics.featureUsage.qrCodes.total > 0 ? ((metrics.featureUsage.qrCodes.dynamic / metrics.featureUsage.qrCodes.total) * 100).toFixed(1) : '0'}% of total`}
            icon={Activity}
            iconColor="text-blue-600"
          />
          <MetricCard
            title="Total Scans"
            value={metrics.featureUsage.scans.total.toLocaleString()}
            subtitle={`${metrics.featureUsage.scans.inPeriod} in period`}
            icon={BarChart3}
            iconColor="text-green-600"
          />
          <MetricCard
            title="Avg Scans/QR"
            value={metrics.featureUsage.qrCodes.avgScansPerCode.toFixed(1)}
            subtitle="Per QR code"
            icon={Target}
            iconColor="text-orange-600"
          />
        </div>

        {/* Engagement & API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <MetricCard
            title="User Engagement"
            value={`${metrics.featureUsage.engagement.rate.toFixed(1)}%`}
            subtitle={`${metrics.featureUsage.engagement.activeUsers} active users`}
            icon={Zap}
            iconColor="text-yellow-600"
          />
          <MetricCard
            title="Active API Keys"
            value={metrics.featureUsage.api.activeKeys.toLocaleString()}
            subtitle="Currently active"
            icon={Activity}
            iconColor="text-blue-600"
          />
          <MetricCard
            title="API Calls"
            value={metrics.featureUsage.api.callsInPeriod.toLocaleString()}
            subtitle={`Last ${period} days`}
            icon={BarChart3}
            iconColor="text-purple-600"
          />
        </div>

        {/* Daily Scans Chart */}
        {metrics.featureUsage.scans.dailyScans.length > 0 && (
          <div className="mb-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Scans Activity</h3>
            <div className="space-y-4">
              {/* Chart */}
              <div className="h-48 flex items-end justify-between gap-1">
                {metrics.featureUsage.scans.dailyScans.map((day, idx) => {
                  const maxCount = Math.max(...metrics.featureUsage.scans.dailyScans.map(d => d.count))
                  const height = maxCount > 0 ? Math.max((day.count / maxCount) * 100, day.count > 0 ? 5 : 0) : 0
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      {/* Count label above bar */}
                      {day.count > 0 && (
                        <div className="text-xs font-semibold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.count}
                        </div>
                      )}
                      {/* Bar */}
                      <div 
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer relative"
                        style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none z-10">
                          {day.date}: {day.count.toLocaleString()} scans
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Summary Stats */}
              <div className="pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.featureUsage.scans.dailyScans.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Total Scans</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {(metrics.featureUsage.scans.dailyScans.reduce((sum, d) => sum + d.count, 0) / metrics.featureUsage.scans.dailyScans.length).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-600">Daily Average</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...metrics.featureUsage.scans.dailyScans.map(d => d.count)).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Peak Day</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.featureUsage.scans.dailyScans.filter(d => d.count > 0).length}
                  </p>
                  <p className="text-xs text-gray-600">Active Days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Codes by Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">QR Codes by Type</h3>
            <div className="space-y-3">
              {metrics.featureUsage.qrCodes.byType.slice(0, 5).map((type) => {
                const total = metrics.featureUsage.qrCodes.total
                const percentage = total > 0 ? (type.count / total) * 100 : 0
                return (
                  <div key={type.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{type.type}</span>
                      <span className="text-sm text-gray-600">{type.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Users by Activity */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Active Users</h3>
            <div className="space-y-3">
              {metrics.featureUsage.topUsers.slice(0, 5).map((user, idx) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.qrCodes} QR</p>
                    <p className="text-xs text-gray-600 capitalize">{user.plan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

