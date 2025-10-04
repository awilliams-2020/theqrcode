'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Download, Copy, ExternalLink, Globe, Smartphone, Monitor, Tablet, MapPin, Clock } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'

export default function DemoPage() {
  const [qrData, setQrData] = useState<{
    content: string
    type: 'url' | 'wifi' | 'contact' | 'text'
    size: number
    color: { dark: string; light: string }
  }>({
    content: 'https://theqrcode.io',
    type: 'url',
    size: 256,
    color: { dark: '#000000', light: '#FFFFFF' }
  })
  const [qrImage, setQrImage] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  // Mock analytics data
  const mockAnalytics = {
    totalScans: 1247,
    uniqueScans: 892,
    countries: 12,
    devices: 3,
    topLocations: [
      { country: 'United States', city: 'New York', scans: 342, flag: '🇺🇸' },
      { country: 'United Kingdom', city: 'London', scans: 198, flag: '🇬🇧' },
      { country: 'Canada', city: 'Toronto', scans: 156, flag: '🇨🇦' },
      { country: 'Germany', city: 'Berlin', scans: 124, flag: '🇩🇪' },
      { country: 'Australia', city: 'Sydney', scans: 98, flag: '🇦🇺' },
    ],
    deviceBreakdown: [
      { type: 'Mobile', count: 847, percentage: 68, icon: Smartphone, color: 'bg-blue-500' },
      { type: 'Desktop', count: 312, percentage: 25, icon: Monitor, color: 'bg-green-500' },
      { type: 'Tablet', count: 88, percentage: 7, icon: Tablet, color: 'bg-purple-500' },
    ],
    recentScans: [
      { time: '2 minutes ago', location: 'New York, US', device: 'iPhone 15' },
      { time: '5 minutes ago', location: 'London, UK', device: 'Samsung Galaxy' },
      { time: '8 minutes ago', location: 'Toronto, CA', device: 'iPad Pro' },
      { time: '12 minutes ago', location: 'Berlin, DE', device: 'MacBook Pro' },
      { time: '15 minutes ago', location: 'Sydney, AU', device: 'Pixel 8' },
    ]
  }

  const generateQRCode = async () => {
    if (!qrData.content.trim()) return
    
    setIsGenerating(true)
    try {
      const image = await QRGenerator.generateQRCode({
        type: qrData.type,
        content: qrData.content,
        size: qrData.size,
        color: qrData.color
      })
      setQrImage(image)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [qrData])

  const handleDownload = () => {
    if (qrImage) {
      const link = document.createElement('a')
      link.href = qrImage
      link.download = 'qr-demo.png'
      link.click()
    }
  }

  const handleCopy = async () => {
    if (qrImage) {
      try {
        const response = await fetch(qrImage)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy image:', error)
      }
    }
  }

  const demoExamples = [
    {
      title: 'Website URL',
      content: 'https://theqrcode.io',
      type: 'url' as const,
      description: 'Perfect for linking to your website'
    },
    {
      title: 'WiFi Network',
      content: JSON.stringify({
        ssid: 'Demo WiFi',
        password: 'password123',
        security: 'WPA'
      }),
      type: 'wifi' as const,
      description: 'Share WiFi credentials easily'
    },
    {
      title: 'Contact Card',
      content: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1-555-0123'
      }),
      type: 'contact' as const,
      description: 'Share contact information'
    },
    {
      title: 'Plain Text',
      content: 'This is a demo QR code for QR Analytics!',
      type: 'text' as const,
      description: 'Store any text information'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Try QR Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate QR codes instantly and see how powerful our analytics can be for your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* QR Generator */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              QR Code Generator
            </h2>
            
            <div className="space-y-6">
              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={qrData.content}
                  onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  rows={3}
                  placeholder="Enter your content here..."
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Type
                </label>
                <select
                  value={qrData.type}
                  onChange={(e) => setQrData({ ...qrData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="url">Website URL</option>
                  <option value="text">Plain Text</option>
                  <option value="wifi">WiFi Network</option>
                  <option value="contact">Contact Card</option>
                </select>
              </div>

              {/* Quick Examples */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Examples
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {demoExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setQrData({
                        ...qrData,
                        content: example.content,
                        type: example.type
                      })}
                      className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {example.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {example.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {qrData.size}px
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="32"
                      value={qrData.size}
                      onChange={(e) => setQrData({
                        ...qrData,
                        size: parseInt(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={qrData.color.dark}
                      onChange={(e) => setQrData({
                        ...qrData,
                        color: { ...qrData.color, dark: e.target.value }
                      })}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Preview & Download
            </h2>
            
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-8 mb-6">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : qrImage ? (
                  <img
                    src={qrImage}
                    alt="Generated QR Code"
                    className="max-w-full h-auto mx-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleDownload}
                  disabled={!qrImage}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!qrImage}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="mt-12 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Powerful Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Track every scan with detailed insights and real-time data
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{mockAnalytics.totalScans.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Scans</div>
              <div className="text-xs text-green-600 mt-1">↑ 12% this week</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{mockAnalytics.uniqueScans.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Unique Scans</div>
              <div className="text-xs text-green-600 mt-1">↑ 8% this week</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{mockAnalytics.countries}</div>
              <div className="text-sm text-gray-600">Countries</div>
              <div className="text-xs text-gray-500 mt-1">Global reach</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{mockAnalytics.devices}</div>
              <div className="text-sm text-gray-600">Device Types</div>
              <div className="text-xs text-gray-500 mt-1">Cross-platform</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Locations */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Globe className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Top Locations</h3>
              </div>
              <div className="space-y-4">
                {mockAnalytics.topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{location.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">{location.city}</div>
                        <div className="text-sm text-gray-600">{location.country}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{location.scans}</div>
                      <div className="text-xs text-gray-600">scans</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Smartphone className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Device Breakdown</h3>
              </div>
              <div className="space-y-4">
                {mockAnalytics.deviceBreakdown.map((device, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <device.icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{device.type}</span>
                      </div>
                      <span className="text-sm text-gray-600">{device.count} ({device.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${device.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Recent Scans</h3>
            </div>
            <div className="space-y-3">
              {mockAnalytics.recentScans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{scan.location}</div>
                      <div className="text-sm text-gray-600">{scan.device}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{scan.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to track your QR codes?</h3>
            <p className="mb-6 text-blue-100">
              Get detailed insights about every scan of your QR codes with real-time analytics
            </p>
            <button
              onClick={() => router.push('/auth/signup')}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <span>Start Free Trial</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
