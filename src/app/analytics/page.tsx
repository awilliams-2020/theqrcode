'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3, Activity, Globe, Smartphone, TrendingUp, Wifi } from 'lucide-react'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import RealtimeAnalytics from '@/components/RealtimeAnalytics'

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('advanced')
  const [userPlan, setUserPlan] = useState<string>('free')
  const [isTrialActive, setIsTrialActive] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('active')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Fetch user subscription info
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/user/subscription')
        if (response.ok) {
          const data = await response.json()
          
          // The API returns { subscription: { plan, status, trialEndsAt } }
          if (data.subscription) {
            setUserPlan(data.subscription.plan || 'free')
            setIsTrialActive(data.subscription.status === 'trialing')
            setSubscriptionStatus(data.subscription.status || 'active')
          } else {
            // No subscription found, default to free plan
            setUserPlan('free')
            setIsTrialActive(false)
            setSubscriptionStatus('active')
          }
        }
      } catch (error) {
        console.error('Error fetching user plan:', error)
      }
    }

    fetchUserPlan()
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const hasAnalyticsAccess = userPlan === 'starter' || userPlan === 'pro' || userPlan === 'business' || isTrialActive
  
  // Live Analytics is only available for trialing users or pro+ users with active status
  const hasLiveAnalyticsAccess = isTrialActive || (subscriptionStatus === 'active' && (userPlan === 'pro' || userPlan === 'business'))

  const tabs = [
    {
      id: 'advanced',
      name: 'Advanced Analytics',
      icon: BarChart3,
      description: 'Detailed insights and trends'
    },
    {
      id: 'live',
      name: 'Live Analytics',
      icon: Activity,
      description: 'Real-time monitoring',
      requiresUpgrade: !hasLiveAnalyticsAccess
    }
  ]

  


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Track your QR code performance with detailed insights and real-time data
          </p>
        </div>
      </div>

      {/* Access Control */}
      {!hasAnalyticsAccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Not Available</h2>
            <p className="text-gray-600 mb-6">
              Advanced analytics are available with Starter, Pro, or Business plans.
            </p>
            <button
              onClick={() => router.push('/pricing')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      )}

      {hasAnalyticsAccess && (
        <>
          {/* Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                      {(tab as any).requiresUpgrade && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-2">
                          Pro+
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Advanced Analytics</h2>
                      <p className="text-sm text-gray-600">Comprehensive insights into your QR code performance</p>
                    </div>
                  </div>
                  <AdvancedAnalytics userPlan={userPlan} isTrialActive={isTrialActive} />
                </div>
              </div>
            )}

            {activeTab === 'live' && (
              <>
                {hasLiveAnalyticsAccess ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Live Analytics</h2>
                          <p className="text-sm text-gray-600">Real-time monitoring of QR code activity</p>
                        </div>
                      </div>
                      <RealtimeAnalytics userPlan={userPlan} isTrialActive={isTrialActive} subscriptionStatus={subscriptionStatus} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="text-center mb-8">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Live Analytics</h3>
                      <p className="text-lg text-gray-600 mb-6">
                        Monitor your QR codes in real-time with live scanning data, instant notifications, and dynamic performance metrics.
                      </p>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Wifi className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Real-time Monitoring</h4>
                          <p className="text-sm text-gray-600">See scans as they happen with live updates and instant notifications.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Live Performance</h4>
                          <p className="text-sm text-gray-600">Track performance metrics and engagement in real-time.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Globe className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Geographic Tracking</h4>
                          <p className="text-sm text-gray-600">Monitor where your QR codes are being scanned worldwide.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Smartphone className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Device Analytics</h4>
                          <p className="text-sm text-gray-600">See which devices and browsers your users prefer.</p>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade section */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Live Analytics with Pro+</h4>
                      <p className="text-gray-600 mb-4">
                        Upgrade to Pro or Business to unlock live analytics plus advanced features, custom branding, and priority support.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                          onClick={() => router.push('/pricing')}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Upgrade to Pro →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
