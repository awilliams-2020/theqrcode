'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  description: string
  category: string
  requiresFields: string[]
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Sent to new users when they sign up',
    category: 'Account',
    requiresFields: ['name']
  },
  {
    id: 'trialEnding',
    name: 'Trial Ending',
    description: 'Reminder when user trial is about to expire',
    category: 'Billing',
    requiresFields: ['name', 'daysLeft', 'qrCodeCount', 'scanCount']
  },
  {
    id: 'trialExpired',
    name: 'Trial Expired',
    description: 'Notification when trial period has ended',
    category: 'Billing',
    requiresFields: ['name', 'previousPlan', 'qrCodeCount', 'scanCount']
  },
  {
    id: 'usageInsights',
    name: 'Monthly Insights',
    description: 'Monthly usage statistics and insights',
    category: 'Engagement',
    requiresFields: ['name', 'month', 'qrCodeCount', 'scanCount', 'topQrCode', 'scanGrowth']
  },
  {
    id: 'featureAnnouncement',
    name: 'Feature Announcement',
    description: 'Announcement for new features or updates',
    category: 'Product',
    requiresFields: ['name', 'featureName', 'featureDescription', 'ctaUrl']
  },
  {
    id: 'reEngagement',
    name: 'Re-engagement',
    description: 'Email to inactive users encouraging them to return',
    category: 'Engagement',
    requiresFields: ['name', 'daysSinceLastLogin']
  },
  {
    id: 'emailVerification',
    name: 'Email Verification',
    description: 'Email verification link for new accounts',
    category: 'Account',
    requiresFields: []
  },
  {
    id: 'passwordReset',
    name: 'Password Reset',
    description: 'Password reset link when user requests it',
    category: 'Account',
    requiresFields: []
  },
  {
    id: 'otp',
    name: 'OTP Code',
    description: 'One-time password for two-factor authentication',
    category: 'Account',
    requiresFields: []
  }
]

interface TestResult {
  success: boolean
  message?: string
  error?: string
  template?: string
}

export default function EmailTester() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [testName, setTestName] = useState('Test User')
  const [additionalData, setAdditionalData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const selectedTemplateInfo = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate)

  const handleSendTest = async () => {
    if (!selectedTemplate || !testEmail) {
      setResult({
        success: false,
        error: 'Please select a template and enter an email address'
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: selectedTemplate,
          email: testEmail,
          name: testName || 'Test User',
          additionalData: additionalData
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          template: data.template
        })
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to send test email'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateAdditionalData = (field: string, value: string) => {
    setAdditionalData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const groupedTemplates = EMAIL_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, EmailTemplate[]>)

  const renderAdditionalFields = () => {
    if (!selectedTemplateInfo) return null

    return (
      <div className="space-y-4">
        {selectedTemplateInfo.requiresFields.map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              value={additionalData[field] || ''}
              onChange={(e) => updateAdditionalData(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Email Template Tester</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Test email templates by sending them to any email address
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Email Template
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">{category}</h4>
                  <div className="space-y-1">
                    {templates.map(template => (
                      <label key={template.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="template"
                          value={template.id}
                          checked={selectedTemplate === template.id}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {template.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Email Address
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Test User"
              />
            </div>
          </div>

          {/* Additional Template Fields */}
          {selectedTemplateInfo && selectedTemplateInfo.requiresFields.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Template-Specific Data
              </h4>
              {renderAdditionalFields()}
            </div>
          )}

          {/* Send Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSendTest}
              disabled={isLoading || !selectedTemplate || !testEmail}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Sending...' : 'Send Test Email'}</span>
            </button>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-md ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className={`font-medium ${
                    result.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {result.success ? 'Test Email Sent Successfully!' : 'Failed to Send Test Email'}
                  </div>
                  <div className={`text-sm mt-1 ${
                    result.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message || result.error}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
