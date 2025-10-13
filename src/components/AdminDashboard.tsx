'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, QrCode, BarChart3, Shield, TrendingUp, MessageSquare, Activity } from 'lucide-react'
import AdminMetrics from './AdminMetrics'
import AdminFeedback from './AdminFeedback'
import AdminMonitoring from './AdminMonitoring'

interface AdminStats {
  totalUsers: number
  totalQRCodes: number
  totalScans: number
}

interface RecentUser {
  id: string
  name: string | null
  email: string
  createdAt: Date
  plan: string
  qrCodeCount: number
  apiKeyCount: number
  isAdmin: boolean
}

interface AdminDashboardProps {
  stats: AdminStats
  recentUsers: RecentUser[]
}

export default function AdminDashboard({ stats, recentUsers }: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'feedback' | 'monitoring'>('overview')
  const tabNavRef = useRef<HTMLDivElement>(null)

  // Remove focus when clicking outside the tab navigation
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabNavRef.current && !tabNavRef.current.contains(event.target as Node)) {
        // If click is outside tab nav, blur any focused element within it
        const focusedElement = document.activeElement as HTMLElement
        if (tabNavRef.current.contains(focusedElement)) {
          focusedElement.blur()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-red-600" />
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600 mt-2">
                System overview and user management
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div ref={tabNavRef} className="mb-6 border-b border-gray-200 -mx-4 sm:mx-0">
          <div className="overflow-x-auto scrollbar-hide px-4 sm:px-0">
            <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-2 sm:px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span>Overview</span>
                </div>
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`pb-3 px-2 sm:px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${
                  activeTab === 'metrics'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TrendingUp className="h-4 w-4 flex-shrink-0" />
                  <span>Business Metrics</span>
                </div>
                {activeTab === 'metrics' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`pb-3 px-2 sm:px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${
                  activeTab === 'feedback'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span>User Feedback</span>
                </div>
                {activeTab === 'feedback' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`pb-3 px-2 sm:px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${
                  activeTab === 'monitoring'
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span>System Monitoring</span>
                </div>
                {activeTab === 'monitoring' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Total QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQRCodes.toLocaleString()}</p>
              </div>
              <QrCode className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalScans.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
            <p className="text-sm text-gray-800 mt-1">
              Latest user registrations
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Codes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Keys
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.plan === 'free' ? 'bg-gray-100 text-gray-800' :
                        user.plan === 'starter' ? 'bg-blue-100 text-blue-800' :
                        user.plan === 'pro' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.qrCodeCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.apiKeyCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {/* Business Metrics Tab */}
        {activeTab === 'metrics' && (
          <AdminMetrics />
        )}

        {/* User Feedback Tab */}
        {activeTab === 'feedback' && (
          <AdminFeedback />
        )}

        {/* System Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <AdminMonitoring />
        )}
      </div>
    </div>
  )
}

