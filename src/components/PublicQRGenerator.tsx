'use client'

import { useState, useEffect } from 'react'
import { QrCode, Download } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'
import WiFiInput from './WiFiInput'
import VCardInput from './VCardInput'
import { trackEvent } from '@/lib/matomo'
import { MatomoEventCategory, MatomoEventAction, createCustomDimensions } from '@/lib/matomo-config'

interface PublicQRGeneratorProps {
  defaultType?: 'url' | 'wifi' | 'contact' | 'text' | 'email' | 'menu'
  title?: string
  description?: string
  allowedTypes?: Array<'url' | 'wifi' | 'contact' | 'text' | 'email' | 'menu'>
}

export default function PublicQRGenerator({ 
  defaultType = 'url',
  title = 'Generate Your QR Code',
  description = 'Create a QR code instantly and download it for free',
  allowedTypes = ['url', 'text']
}: PublicQRGeneratorProps) {
  const getDefaultContent = (type: 'url' | 'wifi' | 'contact' | 'text' | 'email' | 'menu') => {
    switch (type) {
      case 'url':
        return 'https://theqrcode.io'
      case 'text':
        return 'Hello, World!'
      case 'wifi':
        return 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
      case 'contact':
        return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
      case 'email':
        return 'contact@example.com'
      default:
        return ''
    }
  }

  const [qrData, setQrData] = useState<{
    content: string
    type: 'url' | 'wifi' | 'contact' | 'text' | 'email' | 'menu'
    size: number
    color: { dark: string; light: string }
    styling?: { dotsType?: string; cornersSquareType?: string; cornersDotType?: string; backgroundType?: string }
  }>({
    content: getDefaultContent(defaultType),
    type: defaultType,
    size: 256,
    color: { dark: '#000000', light: '#FFFFFF' },
    styling: undefined
  })
  
  const [qrImage, setQrImage] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRCode = async () => {
    const content = qrData.content
    
    if (!content.trim()) {
      return
    }
    
    setIsGenerating(true)
    try {
      const image = await QRGenerator.generateQRCode({
        type: qrData.type,
        content: content,
        size: qrData.size,
        color: qrData.color,
        styling: qrData.styling as any
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
      // Track PNG download
      trackEvent({
        category: MatomoEventCategory.QR_CODE,
        action: MatomoEventAction.DOWNLOAD,
        name: `download_png_${qrData.type}`,
        customDimensions: createCustomDimensions({
          QR_CODE_TYPE: qrData.type,
          LANDING_PAGE: 'qr-code-generator',
        }),
      });
      
      const link = document.createElement('a')
      link.href = qrImage
      link.download = `qrcode-${Date.now()}.png`
      link.click()
    }
  }

  const allQrTypes = [
    {
      title: 'Website URL',
      type: 'url' as const,
      description: 'Link to websites and landing pages',
      emoji: '🔗',
      planRequired: null as 'free' | 'starter' | 'pro' | null
    },
    {
      title: 'Plain Text',
      type: 'text' as const,
      description: 'Any text content',
      emoji: '📝',
      planRequired: null as 'free' | 'starter' | 'pro' | null
    },
    {
      title: 'WiFi Network',
      type: 'wifi' as const,
      description: 'Share WiFi access instantly',
      emoji: '📶',
      planRequired: null as 'free' | 'starter' | 'pro' | null
    },
    {
      title: 'Contact (vCard)',
      type: 'contact' as const,
      description: 'Share contact information',
      emoji: '👤',
      planRequired: null as 'free' | 'starter' | 'pro' | null
    },
    {
      title: 'Email Address',
      type: 'email' as const,
      description: 'Email address',
      emoji: '📧',
      planRequired: 'starter' as 'free' | 'starter' | 'pro' | null
    },
    {
      title: 'Restaurant Menu',
      type: 'menu' as const,
      description: 'Create digital restaurant menus',
      emoji: '🍽️',
      planRequired: 'pro' as 'free' | 'starter' | 'pro' | null
    }
  ]

  const qrTypes = allQrTypes.filter(type => allowedTypes.includes(type.type))

  const handleTypeChange = (type: 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'menu') => {
    // Check if type requires Pro plan (Menu)
    const typeInfo = allQrTypes.find(t => t.type === type)
    if (typeInfo?.planRequired === 'pro') {
      // Show upgrade prompt for Pro plan features
      if (window.confirm(`${typeInfo.title} QR codes are available on Pro+ plans. Would you like to sign up for a free trial?`)) {
        window.location.href = `/auth/signup?plan=pro`
      }
      return
    }
    // Note: Email (Starter+) can still be generated on public generator, badge just indicates paid feature
    
    // Track QR type selection
    trackEvent({
      category: MatomoEventCategory.QR_CODE,
      action: MatomoEventAction.CREATE,
      name: `select_type_${type}`,
      customDimensions: createCustomDimensions({
        QR_CODE_TYPE: type,
        LANDING_PAGE: 'qr-code-generator',
      }),
    });
    
    // Set default content based on type
    let defaultContent = ''
    if (type === 'url') {
      defaultContent = 'https://theqrcode.io'
    } else if (type === 'text') {
      defaultContent = 'Hello, World!'
    } else if (type === 'wifi') {
      // Default WiFi JSON format
      defaultContent = JSON.stringify({
        ssid: '',
        password: '',
        security: 'WPA',
        hidden: false
      })
    } else if (type === 'contact') {
      // Default vCard JSON format
      defaultContent = JSON.stringify({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        organization: '',
        title: '',
        address: '',
        website: '',
        image: ''
      })
    } else if (type === 'email') {
      defaultContent = 'contact@example.com'
    } else if (type === 'menu') {
      // Menu requires Pro plan, but set default anyway
      defaultContent = JSON.stringify({ categories: [] })
    }
    
    setQrData({
      ...qrData,
      type,
      content: defaultContent
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator Settings */}
        <div className="space-y-6">
          {/* QR Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select QR Code Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {qrTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => handleTypeChange(type.type)}
                  className={`p-3 text-left border-2 rounded-xl transition-all ${
                    qrData.type === type.type
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{type.emoji}</span>
                    <div className="font-semibold text-xs text-gray-900 flex-1">
                      {type.title}
                    </div>
                    {type.planRequired === 'starter' && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Starter+
                      </span>
                    )}
                    {type.planRequired === 'pro' && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Pro+
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-1">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          {qrData.type === 'wifi' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                WiFi Configuration
              </label>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <WiFiInput
                  value={qrData.content}
                  onChange={(value) => setQrData({ ...qrData, content: value })}
                />
              </div>
            </div>
          ) : qrData.type === 'contact' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contact Card
              </label>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <VCardInput
                  value={qrData.content}
                  onChange={(value) => setQrData({ ...qrData, content: value })}
                />
              </div>
            </div>
          ) : qrData.type === 'menu' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Restaurant Menu
              </label>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg">
                <div className="text-center py-4">
                  <div className="text-purple-600 font-semibold mb-2">Pro Plan Required</div>
                  <p className="text-sm text-gray-700 mb-4">
                    Restaurant Menu QR codes are available on Pro+ plans. Create beautiful, mobile-optimized menus with our built-in Menu Builder.
                  </p>
                  <button
                    onClick={() => window.location.href = '/auth/signup?plan=pro'}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Upgrade to Pro →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {qrData.type === 'url' && 'Website URL'}
                {qrData.type === 'text' && 'Text Content'}
                {qrData.type === 'email' && 'Email Address'}
              </label>
              <textarea
                value={qrData.content}
                onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                rows={3}
                placeholder={
                  qrData.type === 'url' ? 'https://example.com' :
                  qrData.type === 'email' ? 'contact@example.com' :
                  'Enter your text here...'
                }
              />
            </div>
          )}

        </div>

        {/* QR Code Preview */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-gray-50 rounded-xl p-8 mb-6 min-h-[300px] flex items-center justify-center">
              {isGenerating ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : qrImage ? (
                <img
                  src={qrImage}
                  alt="Generated QR Code"
                  className="max-w-full h-auto mx-auto"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Your QR code will appear here</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={!qrImage}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span>Download PNG</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-left">
              <p className="text-blue-900 font-medium mb-2">🚀 Unlock Pro Features</p>
              <ul className="text-blue-800 space-y-1 mb-3">
                <li>✓ Track scans with advanced analytics</li>
                <li>✓ Add custom logos & frames</li>
                <li>✓ Export as SVG & PDF formats</li>
                <li>✓ Create dynamic & editable QR codes</li>
              </ul>
              <button
                onClick={() => window.location.href = '/auth/signup?plan=pro'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Get Pro Plan →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

