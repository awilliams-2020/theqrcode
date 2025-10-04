'use client'

import { useState } from 'react'
import { User, Mail, Calendar, AlertTriangle, Settings as SettingsIcon, ArrowLeft, CreditCard, Trash2, Download, Clock } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { formatDistanceToNow } from 'date-fns'

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
  accountCreatedAt 
}: SettingsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isExportingData, setIsExportingData] = useState(false)
  const { showSuccess, showError, showWarning } = useToast()
  const router = useRouter()

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
                        <span>Member since {accountCreatedAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </p>
                    )}
                  </div>
                </div>
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
