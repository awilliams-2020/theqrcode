'use client'

import { useState, useEffect, useRef } from 'react'

interface VCardData {
  firstName?: string
  lastName?: string
  phone: string
  email?: string
  organization?: string
  title?: string
  address?: string
  website?: string
}

interface VCardInputProps {
  value: string
  onChange: (value: string) => void
}

export default function VCardInput({ value, onChange }: VCardInputProps) {
  const getInitialVCardData = (): VCardData => {
    // Parse existing value if available
    if (value && value.trim()) {
      try {
        const parsed = JSON.parse(value)
        return {
          firstName: parsed.firstName || '',
          lastName: parsed.lastName || '',
          phone: parsed.phone || '',
          email: parsed.email || '',
        organization: parsed.organization || '',
        title: parsed.title || '',
        address: parsed.address || '',
        website: parsed.website || ''
        }
      } catch {
        // Try parsing vCard format
        const phoneMatch = value.match(/TEL:([^\n]*)/i)
        const emailMatch = value.match(/EMAIL:([^\n]*)/i)
        const fnMatch = value.match(/FN:([^\n]*)/i)
        const orgMatch = value.match(/ORG:([^\n]*)/i)
        const titleMatch = value.match(/TITLE:([^\n]*)/i)
        const urlMatch = value.match(/URL:([^\n]*)/i)
        
        return {
          firstName: fnMatch ? fnMatch[1].split(' ')[0] : '',
          lastName: fnMatch ? fnMatch[1].split(' ').slice(1).join(' ') : '',
          phone: phoneMatch ? phoneMatch[1] : '',
          email: emailMatch ? emailMatch[1] : '',
        organization: orgMatch ? orgMatch[1] : '',
        title: titleMatch ? titleMatch[1] : '',
        address: '',
        website: urlMatch ? urlMatch[1] : ''
        }
      }
    }
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      organization: '',
      title: '',
      address: '',
      website: ''
    }
  }

  const [vcardData, setVcardData] = useState<VCardData>(getInitialVCardData)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // Skip onChange on initial mount to prevent re-render during render
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    // Update parent with JSON string
    onChange(JSON.stringify(vcardData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vcardData])

  const handleChange = (field: keyof VCardData, val: string) => {
    setVcardData(prev => ({ ...prev, [field]: val }))
  }

  return (
    <div className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={vcardData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="John"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={vcardData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Phone Number - Required */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={vcardData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1-555-0123"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Include country code for international numbers
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={vcardData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Organization and Title */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization
          </label>
          <input
            type="text"
            value={vcardData.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            placeholder="Company Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={vcardData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Software Engineer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          value={vcardData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          value={vcardData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Main St, City, State 12345"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Info Box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Only the phone number is required. Add more details to create a complete contact card
        </p>
      </div>
    </div>
  )
}

