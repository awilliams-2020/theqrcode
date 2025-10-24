'use client'

import { useState } from 'react'
import { QrCode, Copy, Download, Share2, BarChart3, Mail, Phone, Globe, Wifi, User } from 'lucide-react'
import { QRCode as QRCodeType } from '@/types'

interface QRShareDisplayProps {
  qrCode: QRCodeType & {
    user: {
      name: string | null
      email: string
    }
  }
  qrCodeImage: string | null
  message: string
}

export default function QRShareDisplay({ qrCode, qrCodeImage, message }: QRShareDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleDownload = () => {
    if (!qrCodeImage) return
    
    try {
      const link = document.createElement('a')
      link.href = qrCodeImage
      link.download = `${qrCode.name.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download:', error)
    }
  }

  const getQRTypeIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return <Wifi className="h-5 w-5" />
      case 'contact':
        return <User className="h-5 w-5" />
      case 'email':
        return <Mail className="h-5 w-5" />
      case 'url':
        return <Globe className="h-5 w-5" />
      default:
        return <QrCode className="h-5 w-5" />
    }
  }

  const getQRTypeLabel = (type: string) => {
    switch (type) {
      case 'wifi':
        return 'WiFi QR Code'
      case 'contact':
        return 'Contact QR Code'
      case 'email':
        return 'Email QR Code'
      case 'url':
        return 'Website QR Code'
      case 'text':
        return 'Text QR Code'
      case 'menu':
        return 'Menu QR Code'
      default:
        return 'QR Code'
    }
  }

  const displayUrl = qrCode.isDynamic && qrCode.shortUrl 
    ? qrCode.shortUrl.replace('/r/', '/display/') 
    : qrCode.content

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Shared</h1>
          <p className="text-gray-600">Shared by {qrCode.user.name || 'Anonymous'}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Message */}
          <div className="px-6 py-8 text-center border-b border-gray-100">
            <div className="max-w-md mx-auto">
              <p className="text-lg text-gray-800 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="px-6 py-8">
            <div className="flex flex-col items-center space-y-6">
              {/* QR Code Preview */}
              <div className="relative">
                <div className="bg-white border-4 border-gray-200 rounded-2xl p-6 shadow-lg">
                  {qrCodeImage ? (
                    <img 
                      src={qrCodeImage} 
                      alt={qrCode.name} 
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* QR Code Info */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {getQRTypeIcon(qrCode.type)}
                    <span className="font-semibold text-gray-900">{qrCode.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{getQRTypeLabel(qrCode.type)}</p>
                  {qrCode.isDynamic && (
                    <div className="inline-flex items-center mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics Enabled
                    </div>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              {qrCode.type === 'contact' && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                    {(() => {
                      try {
                        const contact = JSON.parse(qrCode.content)
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 w-20">Name:</span>
                              <span className="text-gray-900">{contact.firstName} {contact.lastName}</span>
                            </div>
                            {contact.email && (
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700 w-20">Email:</span>
                                <span className="text-gray-900">{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700 w-20">Phone:</span>
                                <span className="text-gray-900">{contact.phone}</span>
                              </div>
                            )}
                            {contact.company && (
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700 w-20">Company:</span>
                                <span className="text-gray-900">{contact.company}</span>
                              </div>
                            )}
                          </div>
                        )
                      } catch {
                        return <p className="text-sm text-gray-500">Contact information available</p>
                      }
                    })()}
                  </div>
                </div>
              )}

              {qrCode.type === 'wifi' && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Wifi className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-gray-900">WiFi Network</h4>
                    </div>
                    {(() => {
                      try {
                        const wifi = JSON.parse(qrCode.content)
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 w-20">Network:</span>
                              <span className="text-gray-900">{wifi.ssid}</span>
                            </div>
                            {wifi.security && (
                              <div className="flex items-center">
                                <span className="font-medium text-gray-700 w-20">Security:</span>
                                <span className="text-gray-900">{wifi.security}</span>
                              </div>
                            )}
                          </div>
                        )
                      } catch {
                        return <p className="text-sm text-gray-500">WiFi network information available</p>
                      }
                    })()}
                  </div>
                </div>
              )}

              {qrCode.type === 'url' && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Website</h4>
                    </div>
                    <p className="text-sm text-blue-600 break-all">{qrCode.content}</p>
                  </div>
                </div>
              )}

              {qrCode.type === 'text' && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Text Content</h4>
                    <p className="text-sm text-gray-700 break-words">{qrCode.content}</p>
                  </div>
                </div>
              )}

              {qrCode.type === 'email' && (
                <div className="w-full max-w-md">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Mail className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Email</h4>
                    </div>
                    <p className="text-sm text-gray-900">{qrCode.content}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDownload}
                disabled={!qrCodeImage}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                <span>Download QR Code</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            
            {displayUrl && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Direct link:</p>
                <a 
                  href={displayUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {displayUrl}
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Powered by <a href="https://theqrcode.io" className="text-blue-600 hover:text-blue-800">TheQRCode.io</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
