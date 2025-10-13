'use client'

import { useState, useEffect, useRef } from 'react'

interface WiFiData {
  ssid: string
  password: string
  security: 'WPA' | 'WPA2' | 'WEP' | 'nopass'
  hidden?: boolean
}

interface WiFiInputProps {
  value: string
  onChange: (value: string) => void
}

export default function WiFiInput({ value, onChange }: WiFiInputProps) {
  const getInitialWifiData = (): WiFiData => {
    // Parse existing value if available
    if (value && value.trim()) {
      try {
        const parsed = JSON.parse(value)
        return {
          ssid: parsed.ssid || '',
          password: parsed.password || '',
          security: parsed.security || 'WPA',
          hidden: parsed.hidden || false
        }
      } catch {
        // Try parsing WiFi string format
        const match = value.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*)?;?;/)
        if (match) {
          return {
            ssid: match[2] || '',
            password: match[3] || '',
            security: (match[1] || 'WPA') as WiFiData['security'],
            hidden: match[4] === 'true'
          }
        }
      }
    }
    return {
      ssid: '',
      password: '',
      security: 'WPA',
      hidden: false
    }
  }

  const [wifiData, setWifiData] = useState<WiFiData>(getInitialWifiData)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // Skip onChange on initial mount to prevent re-render during render
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    // Update parent with JSON string
    onChange(JSON.stringify(wifiData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wifiData])

  const handleChange = (field: keyof WiFiData, val: string | boolean) => {
    setWifiData(prev => {
      const updated = { ...prev, [field]: val }
      // Clear password if security type is set to nopass
      if (field === 'security' && val === 'nopass') {
        updated.password = ''
      }
      return updated
    })
  }

  const requiresPassword = wifiData.security !== 'nopass'

  return (
    <div className="space-y-4">
      {/* Network Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Network Name (SSID) *
        </label>
        <input
          type="text"
          value={wifiData.ssid}
          onChange={(e) => handleChange('ssid', e.target.value)}
          placeholder="e.g., My WiFi Network"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Security Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Security Type *
        </label>
        <select
          value={wifiData.security}
          onChange={(e) => handleChange('security', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WPA2">WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open Network)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Most modern networks use WPA/WPA2
        </p>
      </div>

      {/* Password */}
      {requiresPassword && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password {requiresPassword && '*'}
          </label>
          <input
            type="text"
            value={wifiData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter network password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            The password will be embedded in the QR code
          </p>
        </div>
      )}

      {/* Hidden Network */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="hidden-network"
          checked={wifiData.hidden || false}
          onChange={(e) => handleChange('hidden', e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="hidden-network" className="text-sm text-gray-700 cursor-pointer">
          Hidden network (not broadcasting SSID)
        </label>
      </div>

      {/* Info Box */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Users can connect to your WiFi network by simply scanning this QR code
        </p>
      </div>
    </div>
  )
}

