'use client'

import { useState, useEffect } from 'react'
import { QrCode, Download } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'

interface PublicQRGeneratorProps {
  defaultType?: 'url' | 'wifi' | 'contact' | 'text'
  title?: string
  description?: string
  allowedTypes?: Array<'url' | 'wifi' | 'contact' | 'text'>
}

export default function PublicQRGenerator({ 
  defaultType = 'url',
  title = 'Generate Your QR Code',
  description = 'Create a QR code instantly and download it for free',
  allowedTypes = ['url', 'text']
}: PublicQRGeneratorProps) {
  const getDefaultContent = (type: 'url' | 'wifi' | 'contact' | 'text') => {
    switch (type) {
      case 'url':
        return 'https://theqrcode.io'
      case 'text':
        return 'Hello, World!'
      case 'wifi':
        return 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
      case 'contact':
        return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
      default:
        return ''
    }
  }

  const [qrData, setQrData] = useState<{
    content: string
    type: 'url' | 'wifi' | 'contact' | 'text'
    size: number
    color: { dark: string; light: string }
  }>({
    content: getDefaultContent(defaultType),
    type: defaultType,
    size: 256,
    color: { dark: '#000000', light: '#FFFFFF' }
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
      link.download = `qrcode-${Date.now()}.png`
      link.click()
    }
  }

  const allQrTypes = [
    {
      title: 'Website URL',
      type: 'url' as const,
      description: 'Link to websites and landing pages',
      emoji: '🔗'
    },
    {
      title: 'Plain Text',
      type: 'text' as const,
      description: 'Any text content',
      emoji: '📝'
    },
    {
      title: 'WiFi Network',
      type: 'wifi' as const,
      description: 'Share WiFi access instantly',
      emoji: '📶'
    },
    {
      title: 'Contact (vCard)',
      type: 'contact' as const,
      description: 'Share contact information',
      emoji: '👤'
    }
  ]

  const qrTypes = allQrTypes.filter(type => allowedTypes.includes(type.type))

  const handleTypeChange = (type: 'url' | 'text' | 'wifi' | 'contact') => {
    // Set default content based on type
    let defaultContent = ''
    if (type === 'url') {
      defaultContent = 'https://theqrcode.io'
    } else if (type === 'text') {
      defaultContent = 'Hello, World!'
    } else if (type === 'wifi') {
      defaultContent = 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
    } else if (type === 'contact') {
      defaultContent = 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
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
                    <div className="font-semibold text-xs text-gray-900">
                      {type.title}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-1">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrData.type === 'url' && 'Website URL'}
              {qrData.type === 'text' && 'Text Content'}
              {qrData.type === 'wifi' && 'WiFi Details'}
              {qrData.type === 'contact' && 'vCard Data'}
            </label>
            <textarea
              value={qrData.content}
              onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-mono text-sm"
              rows={qrData.type === 'contact' ? 5 : 3}
              placeholder={
                qrData.type === 'url' ? 'https://example.com' :
                qrData.type === 'text' ? 'Enter your text here...' :
                qrData.type === 'wifi' ? 'WIFI:T:WPA;S:NetworkName;P:Password;;' :
                'BEGIN:VCARD...'
              }
            />
            {qrData.type === 'wifi' && (
              <p className="mt-2 text-xs text-gray-600">
                Format: WIFI:T:WPA;S:NetworkName;P:Password;;
              </p>
            )}
            {qrData.type === 'contact' && (
              <p className="mt-2 text-xs text-gray-600">
                vCard format required. Edit the template above.
              </p>
            )}
          </div>

          {/* Customization */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Color
                </label>
                <input
                  type="color"
                  value={qrData.color.dark}
                  onChange={(e) => setQrData({
                    ...qrData,
                    color: { ...qrData.color, dark: e.target.value }
                  })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <input
                  type="color"
                  value={qrData.color.light}
                  onChange={(e) => setQrData({
                    ...qrData,
                    color: { ...qrData.color, light: e.target.value }
                  })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
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
              <p className="text-blue-900 font-medium mb-2">🚀 Unlock Premium Features</p>
              <ul className="text-blue-800 space-y-1 mb-3">
                <li>✓ Track scans with advanced analytics</li>
                <li>✓ Add custom logos & frames</li>
                <li>✓ Export as SVG & PDF formats</li>
                <li>✓ Create dynamic & editable QR codes</li>
                <li>✓ Team collaboration features</li>
              </ul>
              <button
                onClick={() => window.location.href = '/auth/signup'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Sign Up Free →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

