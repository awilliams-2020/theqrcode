'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Calendar, AlertTriangle, Settings as SettingsIcon, ArrowLeft, CreditCard, Trash2, Download, Clock, Globe, Key, Plus, Eye, EyeOff, Copy, Trash } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { formatDistanceToNow } from 'date-fns'
import { COMMON_TIMEZONES, getCurrentTimeInTimezone, formatDateInTimezone } from '@/lib/date-utils'

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Subscription {
  id: string
  plan: string
  status: string
  trialEndsAt?: Date | null
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
}

interface SettingsProps {
  user: User
  subscription: Subscription | null
  qrCodesCount: number
  totalScans: number
  limits: { qrCodes: number; scans: number }
  currentPlan: string
  isTrialActive?: boolean
  planDisplayName?: string
  accountCreatedAt?: Date
  userTimezone?: string
}

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  permissions: string[]
  rateLimit: number
  environment: string
  lastUsedAt: Date | null
  expiresAt: Date | null
  isActive: boolean
  createdAt: Date
}

export default function Settings({ 
  user, 
  subscription, 
  qrCodesCount, 
  totalScans, 
  limits, 
  currentPlan, 
  isTrialActive, 
  planDisplayName,
  accountCreatedAt,
  userTimezone = 'UTC'
}: SettingsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isExportingData, setIsExportingData] = useState(false)
  const [timezone, setTimezone] = useState(userTimezone)
  const [isUpdatingTimezone, setIsUpdatingTimezone] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  
  // API Key management state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoadingApiKeys, setIsLoadingApiKeys] = useState(false)
  const [showCreateApiKey, setShowCreateApiKey] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState('')
  const [isCreatingApiKey, setIsCreatingApiKey] = useState(false)
  const [selectedCreatePermissions, setSelectedCreatePermissions] = useState<string[]>([])
  const [selectedEnvironment, setSelectedEnvironment] = useState<'production' | 'sandbox'>('production')
  const [createdApiKey, setCreatedApiKey] = useState<{ key: string; data: ApiKey } | null>(null)
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})
  const [editingApiKey, setEditingApiKey] = useState<ApiKey | null>(null)
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false)
  
  const { showSuccess, showError, showWarning } = useToast()
  const router = useRouter()

  // Check if user has Pro plan (pro or business) or is in trial with Pro plan
  const hasApiAccess = (currentPlan === 'pro' || currentPlan === 'business') || (isTrialActive && (currentPlan === 'pro' || currentPlan === 'business'))

  // Load API keys on component mount if user has API access
  useEffect(() => {
    if (hasApiAccess) {
      loadApiKeys()
    }
  }, [hasApiAccess])

  // Update current time display every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeInTimezone(timezone))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [timezone])

  const loadApiKeys = async () => {
    setIsLoadingApiKeys(true)
    try {
      const response = await fetch('/api/v1/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.data || [])
      } else {
        throw new Error('Failed to load API keys')
      }
    } catch (error) {
      showError('Failed to Load API Keys', 'Unable to load your API keys. Please try again.')
    } finally {
      setIsLoadingApiKeys(false)
    }
  }

  const createApiKey = async () => {
    if (!newApiKeyName.trim()) {
      showError('Invalid Name', 'Please enter a name for your API key.')
      return
    }

    setIsCreatingApiKey(true)
    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newApiKeyName.trim(),
          permissions: selectedCreatePermissions.length > 0 ? selectedCreatePermissions : undefined,
          environment: selectedEnvironment,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCreatedApiKey({
          key: data.apiKey,
          data: {
            id: data.id,
            name: data.name,
            keyPrefix: data.keyPrefix,
            permissions: data.permissions,
            rateLimit: data.rateLimit,
            environment: data.environment,
            lastUsedAt: data.lastUsedAt,
            expiresAt: data.expiresAt,
            isActive: data.isActive,
            createdAt: data.createdAt
          }
        })
        setNewApiKeyName('')
        setShowCreateApiKey(false)
        await loadApiKeys() // Refresh the list
        showSuccess('API Key Created', 'Your new API key has been created successfully.')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create API key')
      }
    } catch (error) {
      showError('Failed to Create API Key', 'Unable to create API key. Please try again.')
    } finally {
      setIsCreatingApiKey(false)
    }
  }

  const deleteApiKey = async (apiKeyId: string) => {
    try {
      const response = await fetch(`/api/v1/api-keys/${apiKeyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadApiKeys() // Refresh the list
        showSuccess('API Key Deleted', 'The API key has been deleted successfully.')
      } else {
        throw new Error('Failed to delete API key')
      }
    } catch (error) {
      showError('Failed to Delete API Key', 'Unable to delete API key. Please try again.')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Copied to Clipboard', 'API key copied to clipboard.')
    } catch (error) {
      showError('Copy Failed', 'Unable to copy to clipboard. Please copy manually.')
    }
  }

  const toggleApiKeyVisibility = (apiKeyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [apiKeyId]: !prev[apiKeyId]
    }))
  }

  const editApiKey = (apiKey: ApiKey) => {
    setEditingApiKey(apiKey)
  }

  const updateApiKey = async (apiKeyId: string, updates: { name?: string; permissions?: string[] }) => {
    setIsUpdatingApiKey(true)
    try {
      const response = await fetch(`/api/v1/api-keys/${apiKeyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await loadApiKeys() // Refresh the list
        setEditingApiKey(null)
        showSuccess('API Key Updated', 'The API key has been updated successfully.')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update API key')
      }
    } catch (error) {
      showError('Failed to Update API Key', 'Unable to update API key. Please try again.')
    } finally {
      setIsUpdatingApiKey(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
      }

      showSuccess(
        'Account Deleted',
        'Your account has been deleted successfully. Redirecting to sign up...'
      )

      // Sign out and redirect to signup - keep loading state until redirect
      setTimeout(() => {
        signOut({ callbackUrl: '/auth/signup' })
      }, 2000)
      
      // Don't reset loading state on success - keep it until redirect
    } catch (error) {
      showError(
        'Failed to Delete Account',
        'An unexpected error occurred. Please try again.'
      )
      // Only reset loading state on error
      setIsDeletingAccount(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await response.json()
      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to open customer portal')
      }
    } catch (error) {
      showError(
        'Failed to Open Portal',
        'Unable to open subscription management. Please try again.'
      )
    }
  }

  const handleExportData = async () => {
    setIsExportingData(true)
    try {
      const response = await fetch('/api/user/export-data', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to export data')
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
        : `qr-analytics-data-export-${new Date().toISOString().split('T')[0]}.json`

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showSuccess(
        'Data Exported',
        'Your data has been exported successfully. Check your downloads folder.'
      )
    } catch (error) {
      showError(
        'Export Failed',
        'Failed to export your data. Please try again.'
      )
    } finally {
      setIsExportingData(false)
    }
  }

  const handleTimezoneUpdate = async (newTimezone: string) => {
    if (newTimezone === timezone) return

    setIsUpdatingTimezone(true)
    try {
      const response = await fetch('/api/user/timezone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timezone: newTimezone }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update timezone')
      }

      setTimezone(newTimezone)
      showSuccess(
        'Timezone Updated',
        'Your timezone preference has been updated successfully.'
      )
    } catch (error) {
      showError(
        'Failed to Update Timezone',
        'An unexpected error occurred. Please try again.'
      )
    } finally {
      setIsUpdatingTimezone(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  {user.image && (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-16 w-16 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {user.name || 'No name provided'}
                    </h3>
                    <p className="text-gray-600 flex items-center min-w-0">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate" title={user.email || ''}>
                        {user.email}
                      </span>
                    </p>
                    {accountCreatedAt && (
                      <p className="text-gray-500 text-sm flex items-center mt-2">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Member since {formatDateInTimezone(accountCreatedAt, timezone)}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timezone Settings */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Timezone Settings
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Current Timezone</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    All dates and times in the application will be displayed according to your selected timezone.
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Timezone
                  </label>
                  <select
                    id="timezone-select"
                    value={timezone}
                    onChange={(e) => handleTimezoneUpdate(e.target.value)}
                    disabled={isUpdatingTimezone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {COMMON_TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Time</p>
                      <p className="text-lg font-mono text-gray-900">{currentTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">Timezone</p>
                      <p className="text-sm text-gray-600">{timezone}</p>
                    </div>
                  </div>
                </div>

                {isUpdatingTimezone && (
                  <div className="mt-4 flex items-center text-blue-600">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Updating timezone...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {planDisplayName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {limits.qrCodes === -1 ? 'Unlimited' : `${limits.qrCodes.toLocaleString()}`} QR codes • {limits.scans === -1 ? 'Unlimited' : `${limits.scans.toLocaleString()}`} scans/month
                    </p>
                  </div>
                  {isTrialActive && (
                    <div className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200 self-start sm:self-center">
                      Trial Active
                    </div>
                  )}
                </div>
                
                {subscription?.stripeCustomerId && (
                  <button
                    onClick={handleManageSubscription}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Manage Subscription</span>
                  </button>
                )}
              </div>
            </div>

            {/* API Key Management - Only for Pro plans */}
            {hasApiAccess && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    API Key Management
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">API Access</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Create and manage API keys to access your QR codes and analytics programmatically.
                    </p>
                  </div>

                  {/* Create API Key Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowCreateApiKey(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create API Key</span>
                    </button>
                  </div>

                  {/* API Keys List */}
                  {isLoadingApiKeys ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-2 text-gray-600">Loading API keys...</span>
                    </div>
                  ) : apiKeys.length === 0 ? (
                    <div className="text-center py-8">
                      <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
                      <p className="text-gray-600">Create your first API key to start using the API.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                              <p className="text-sm text-gray-600">
                                Created {formatDistanceToNow(new Date(apiKey.createdAt))} ago
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => editApiKey(apiKey)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit API key"
                              >
                                <SettingsIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteApiKey(apiKey.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete API key"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">API Key:</span>
                              <div className="flex items-center space-x-2">
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                                  {apiKey.keyPrefix}••••••••
                                </code>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Rate Limit:</span>
                              <span className="text-sm font-medium text-gray-900">{apiKey.rateLimit.toLocaleString()} requests/hour</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Environment:</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                                apiKey.environment === 'sandbox' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {apiKey.environment === 'sandbox' ? 'Sandbox' : 'Production'}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Permissions:</span>
                                <span className="text-sm text-gray-900">
                                  {apiKey.permissions.length} permission{apiKey.permissions.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {apiKey.permissions.map((permission) => (
                                  <span
                                    key={permission}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {permission}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {apiKey.lastUsedAt && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Last Used:</span>
                                <span className="text-sm text-gray-900">
                                  {formatDistanceToNow(new Date(apiKey.lastUsedAt))} ago
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Usage Statistics
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">QR Codes Created</p>
                    <p className="text-2xl font-bold text-gray-900">{qrCodesCount}</p>
                    {limits.qrCodes !== -1 && (
                      <p className="text-xs text-gray-500">
                        {limits.qrCodes - qrCodesCount} remaining
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Scans</p>
                    <p className="text-2xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
                    {limits.scans !== -1 && (
                      <p className="text-xs text-gray-500">
                        {limits.scans - totalScans} remaining this month
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Data Management
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Export Your Data</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Download all your personal data including QR codes, analytics, and account information in JSON format.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExportingData}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  <span>{isExportingData ? 'Exporting...' : 'Export Data'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200">
              <div className="p-6 border-b border-red-200">
                <h2 className="text-xl font-semibold text-red-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Danger Zone
                </h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeletingAccount}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{isDeletingAccount ? 'Deleting...' : 'Delete Account'}</span>
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Out</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Sign out of your account on this device
                </p>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateApiKey && (
        <CreateApiKeyModal
          name={newApiKeyName}
          setName={setNewApiKeyName}
          selectedPermissions={selectedCreatePermissions}
          setSelectedPermissions={setSelectedCreatePermissions}
          selectedEnvironment={selectedEnvironment}
          setSelectedEnvironment={setSelectedEnvironment}
          currentPlan={currentPlan}
          isTrialActive={isTrialActive}
          onClose={() => {
            setShowCreateApiKey(false)
            setNewApiKeyName('')
            setSelectedCreatePermissions([])
            setSelectedEnvironment('production')
          }}
          onCreate={createApiKey}
          isCreating={isCreatingApiKey}
        />
      )}

      {/* API Key Created Modal */}
      {createdApiKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center mb-4">
              <Key className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                API Key Created Successfully
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Your API key has been created. <strong>Copy it now</strong> - you won't be able to see it again!
              </p>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-900 break-all">
                    {createdApiKey.key}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdApiKey.key)}
                    className="ml-2 p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Copy API key"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCreatedApiKey(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                I've Copied It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit API Key Modal */}
      {editingApiKey && (
        <EditApiKeyModal
          apiKey={editingApiKey}
          currentPlan={currentPlan}
          isTrialActive={isTrialActive}
          onClose={() => setEditingApiKey(null)}
          onUpdate={updateApiKey}
          isUpdating={isUpdatingApiKey}
        />
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone. 
              All your QR codes, analytics data, and subscription information will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeletingAccount && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isDeletingAccount ? 'Deleting Account...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Create API Key Modal Component
interface CreateApiKeyModalProps {
  name: string
  setName: (name: string) => void
  selectedPermissions: string[]
  setSelectedPermissions: (permissions: string[] | ((prev: string[]) => string[])) => void
  selectedEnvironment: 'production' | 'sandbox'
  setSelectedEnvironment: (env: 'production' | 'sandbox') => void
  currentPlan: string
  isTrialActive?: boolean
  onClose: () => void
  onCreate: () => void
  isCreating: boolean
}

function CreateApiKeyModal({ 
  name, 
  setName, 
  selectedPermissions, 
  setSelectedPermissions, 
  selectedEnvironment,
  setSelectedEnvironment,
  currentPlan, 
  isTrialActive, 
  onClose, 
  onCreate, 
  isCreating 
}: CreateApiKeyModalProps) {
  
  // Get available permissions based on plan
  const getAvailablePermissions = () => {
    const effectivePlan = currentPlan
    
    // Only show permissions for Pro plans or Pro trial plans
    if (effectivePlan === 'business' || (isTrialActive && effectivePlan === 'business')) {
      return [
        { id: 'qr:read', name: 'Read QR Codes', description: 'View and retrieve QR code data' },
        { id: 'qr:write', name: 'Write QR Codes', description: 'Create, update, and delete QR codes' },
        { id: 'analytics:read', name: 'Read Analytics', description: 'Access basic analytics data' },
        { id: 'analytics:advanced', name: 'Advanced Analytics', description: 'Access advanced analytics features' },
        { id: 'webhooks:manage', name: 'Manage Webhooks', description: 'Create and manage webhooks' },
        { id: 'team:read', name: 'Read Team Data', description: 'Access team/organization data' },
        { id: 'bulk:write', name: 'Bulk Operations', description: 'Perform bulk create/delete operations' }
      ]
    } else if (effectivePlan === 'pro' || (isTrialActive && effectivePlan === 'pro')) {
      return [
        { id: 'qr:read', name: 'Read QR Codes', description: 'View and retrieve QR code data' },
        { id: 'qr:write', name: 'Write QR Codes', description: 'Create, update, and delete QR codes' },
        { id: 'analytics:read', name: 'Read Analytics', description: 'Access basic analytics data' }
      ]
    }
    // Free plan or free trial - no API access
    return []
  }

  const availablePermissions = getAvailablePermissions()

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev: string[]) => 
      prev.includes(permissionId) 
        ? prev.filter((p: string) => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSelectAll = () => {
    setSelectedPermissions(availablePermissions.map((p: any) => p.id))
  }

  const handleSelectNone = () => {
    setSelectedPermissions([])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <Key className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Create API Key
          </h3>
        </div>

        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="api-key-name" className="block text-sm font-medium text-gray-700 mb-2">
              API Key Name
            </label>
            <input
              id="api-key-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My App Integration"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isCreating}
            />
          </div>

          {/* Environment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environment
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="env-production"
                  name="environment"
                  value="production"
                  checked={selectedEnvironment === 'production'}
                  onChange={() => setSelectedEnvironment('production')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  disabled={isCreating}
                />
                <div className="flex-1">
                  <label htmlFor="env-production" className="text-sm font-medium text-gray-900">
                    Production
                  </label>
                  <p className="text-xs text-gray-600">Create real QR codes that count towards your plan limits</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="env-sandbox"
                  name="environment"
                  value="sandbox"
                  checked={selectedEnvironment === 'sandbox'}
                  onChange={() => setSelectedEnvironment('sandbox')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  disabled={isCreating}
                />
                <div className="flex-1">
                  <label htmlFor="env-sandbox" className="text-sm font-medium text-gray-900">
                    Sandbox
                  </label>
                  <p className="text-xs text-gray-600">Test API calls without affecting production data or plan limits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Permissions
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  disabled={isCreating}
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={handleSelectNone}
                  className="text-xs text-gray-600 hover:text-gray-800"
                  disabled={isCreating}
                >
                  Select None
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`create-permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isCreating}
                  />
                  <div className="flex-1">
                    <label htmlFor={`create-permission-${permission.id}`} className="text-sm font-medium text-gray-900">
                      {permission.name}
                    </label>
                    <p className="text-xs text-gray-600">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Plan:</strong> {currentPlan === 'pro' ? 'Pro' : currentPlan === 'business' ? 'Business' : 'Free'}
                  {isTrialActive && ' (Trial)'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Available permissions are based on your subscription plan. If no permissions are selected, the API key will get default permissions for your plan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={isCreating || !name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isCreating ? 'Creating...' : 'Create API Key'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit API Key Modal Component
interface EditApiKeyModalProps {
  apiKey: ApiKey
  currentPlan: string
  isTrialActive?: boolean
  onClose: () => void
  onUpdate: (apiKeyId: string, updates: { name?: string; permissions?: string[] }) => Promise<void>
  isUpdating: boolean
}

function EditApiKeyModal({ apiKey, currentPlan, isTrialActive, onClose, onUpdate, isUpdating }: EditApiKeyModalProps) {
  const [name, setName] = useState(apiKey.name)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(apiKey.permissions)
  
  // Get available permissions based on plan
  const getAvailablePermissions = () => {
    const effectivePlan = currentPlan
    
    // Only show permissions for Pro plans or Pro trial plans
    if (effectivePlan === 'business' || (isTrialActive && effectivePlan === 'business')) {
      return [
        { id: 'qr:read', name: 'Read QR Codes', description: 'View and retrieve QR code data' },
        { id: 'qr:write', name: 'Write QR Codes', description: 'Create, update, and delete QR codes' },
        { id: 'analytics:read', name: 'Read Analytics', description: 'Access basic analytics data' },
        { id: 'analytics:advanced', name: 'Advanced Analytics', description: 'Access advanced analytics features' },
        { id: 'webhooks:manage', name: 'Manage Webhooks', description: 'Create and manage webhooks' },
        { id: 'team:read', name: 'Read Team Data', description: 'Access team/organization data' },
        { id: 'bulk:write', name: 'Bulk Operations', description: 'Perform bulk create/delete operations' }
      ]
    } else if (effectivePlan === 'pro' || (isTrialActive && effectivePlan === 'pro')) {
      return [
        { id: 'qr:read', name: 'Read QR Codes', description: 'View and retrieve QR code data' },
        { id: 'qr:write', name: 'Write QR Codes', description: 'Create, update, and delete QR codes' },
        { id: 'analytics:read', name: 'Read Analytics', description: 'Access basic analytics data' }
      ]
    }
    // Free plan or free trial - no API access
    return []
  }

  const availablePermissions = getAvailablePermissions()

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSave = async () => {
    if (!name.trim()) {
      return
    }

    await onUpdate(apiKey.id, {
      name: name.trim(),
      permissions: selectedPermissions
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-4">
          <Key className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Edit API Key: {apiKey.name}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="edit-api-key-name" className="block text-sm font-medium text-gray-700 mb-2">
              API Key Name
            </label>
            <input
              id="edit-api-key-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdating}
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="space-y-3">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`permission-${permission.id}`}
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isUpdating}
                  />
                  <div className="flex-1">
                    <label htmlFor={`permission-${permission.id}`} className="text-sm font-medium text-gray-900">
                      {permission.name}
                    </label>
                    <p className="text-xs text-gray-600">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Plan:</strong> {currentPlan === 'pro' ? 'Pro' : currentPlan === 'business' ? 'Business' : 'Free'}
                  {isTrialActive && ' (Trial)'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Available permissions are based on your subscription plan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating || !name.trim() || selectedPermissions.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isUpdating ? 'Updating...' : 'Update API Key'}
          </button>
        </div>
      </div>
    </div>
  )
}
