'use client'

import { useState, useEffect } from 'react'
import { QrCode, BarChart3, Edit, Trash2, Copy, Download, Eye, Check, X } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'
import { useToast } from '@/hooks/useToast'
import { QRCode, QRCodeCardProps } from '@/types'
import { useUserTimezone } from '@/hooks/useUserTimezone'
import { formatTimeAgoInTimezone } from '@/lib/date-utils'

export default function QRCodeCard({ qr, onEdit, onDelete }: QRCodeCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { showSuccess, showError } = useToast()
  const userTimezone = useUserTimezone()

  // Close actions popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActions) {
        const target = event.target as Element
        if (!target.closest('.actions-popup') && !target.closest('.actions-trigger')) {
          setShowActions(false)
        }
      }
    }

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showActions])

  const totalScans = qr.scans?.length || 0
  const recentScans = qr.scans?.filter(
    scan => new Date(scan.scannedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length || 0

  // Generate QR code image on component mount
  useEffect(() => {
    const generateQRCode = async () => {
      if (qr.content) {
        setIsGenerating(true)
        try {
              const qrImage = await QRGenerator.generateQRCode({
                type: qr.type as any,
                content: qr.content,
                size: (qr.settings?.size as number) || 256,
                color: (qr.settings?.color as { dark: string; light: string }) || { dark: '#000000', light: '#FFFFFF' },
                frame: (qr.settings?.frame as { style?: 'square' | 'rounded' | 'circle' | 'dashed'; color?: string; size?: number }) || undefined
              })
          setQrCodeImage(qrImage)
        } catch (error) {
          console.error('Error generating QR code:', error)
        } finally {
          setIsGenerating(false)
        }
      }
    }

    generateQRCode()
  }, [qr])

  const handleCopyLink = async () => {
    // For dynamic QR codes, copy the display URL; for static, copy the content
    const url = qr.isDynamic && qr.shortUrl 
      ? qr.shortUrl.replace('/r/', '/display/') 
      : qr.content
      
    if (!url) return
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setShowActions(false)
      showSuccess(
        'Link Copied',
        'The QR code display link has been copied to your clipboard.'
      )
    } catch (error) {
      showError(
        'Failed to Copy Link',
        'Unable to copy the link to your clipboard. Please try again.'
      )
    }
  }

  const handleDownload = () => {
    if (!qrCodeImage) return
    
    try {
      const link = document.createElement('a')
      link.href = qrCodeImage
      link.download = `${qr.name.replace(/\s+/g, '_')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setShowActions(false)
      showSuccess(
        'Download Started',
        `${qr.name} QR code is being downloaded.`
      )
    } catch (error) {
      showError(
        'Download Failed',
        'Unable to download the QR code. Please try again.'
      )
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
    setShowActions(false)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
    setShowActions(false)
  }

  const confirmDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{qr.name}</h3>
            {qr.isDynamic && (
              <div className="flex items-center mt-1 sm:mt-0 sm:mr-2">
                <BarChart3 className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600 font-medium">Analytics Enabled</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 capitalize">{qr.type} QR Code</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="actions-trigger p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {showActions && (
            <div className="actions-popup absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  onEdit()
                  setShowActions(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handlePreview}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <hr className="my-1" />
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="flex justify-center mb-4">
        <div className={`w-24 h-24 flex items-center justify-center ${qrCodeImage && (qr.settings as any)?.frame?.style === 'circle' ? '' : 'bg-gray-100 rounded-lg'}`}>
          {isGenerating ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : qrCodeImage ? (
            <img src={qrCodeImage} alt={qr.name} className="w-full h-full object-contain" />
          ) : (
            <QrCode className="h-12 w-12 text-gray-400" />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalScans}</p>
          <p className="text-xs text-gray-600">Total Scans</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{recentScans}</p>
          <p className="text-xs text-gray-600">This Week</p>
        </div>
      </div>


      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created {formatTimeAgoInTimezone(qr.createdAt, userTimezone)}</span>
        {qr.isDynamic && qr.shortUrl && (
          <span className="truncate max-w-32" title={qr.shortUrl}>
            {qr.shortUrl}
          </span>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-white shadow-lg max-w-lg w-full rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">QR Code Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* QR Code Display */}
              <div className="text-center mb-4">
                <div className={`${qrCodeImage && (qr.settings as any)?.frame?.style === 'circle' ? '' : 'bg-white border-2 border-gray-200 rounded-xl p-4 mb-3 shadow-sm'}`}>
                  {qrCodeImage ? (
                    <img src={qrCodeImage} alt={qr.name} className="max-w-full h-auto mx-auto max-h-48" />
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <QrCode className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* QR Code Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="font-semibold text-gray-900 mb-1">{qr.name}</h4>
                  <p className="text-sm text-gray-600 capitalize mb-2">{qr.type} QR Code</p>
                  {qr.isDynamic && (
                    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics Enabled
                    </div>
                  )}
                </div>
              </div>

              {/* Content Preview based on type */}
              {qr.type === 'contact' && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                  {(() => {
                    try {
                      const contact = JSON.parse(qr.content)
                      return (
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 w-16">Name:</span>
                            <span className="text-gray-900">{contact.firstName} {contact.lastName}</span>
                          </div>
                          {contact.email && (
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 w-16">Email:</span>
                              <span className="text-gray-900">{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 w-16">Phone:</span>
                              <span className="text-gray-900">{contact.phone}</span>
                            </div>
                          )}
                          {contact.company && (
                            <div className="flex items-center">
                              <span className="font-medium text-gray-700 w-16">Company:</span>
                              <span className="text-gray-900">{contact.company}</span>
                            </div>
                          )}
                        </div>
                      )
                    } catch {
                      return <p className="text-sm text-gray-500">Contact information</p>
                    }
                  })()}
                </div>
              )}

              {qr.type === 'wifi' && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <h5 className="font-medium text-gray-900">WiFi Network</h5>
                  </div>
                  {(() => {
                    try {
                      const wifi = JSON.parse(qr.content)
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Network</p>
                              <p className="text-gray-900 font-medium">{wifi.ssid}</p>
                            </div>
                          </div>
                          {wifi.security && (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Security</p>
                                <p className="text-gray-900 font-medium">{wifi.security}</p>
                              </div>
                            </div>
                          )}
                          {wifi.password && (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Password</p>
                                <p className="text-gray-900 font-medium font-mono text-xs">{wifi.password}</p>
                              </div>
                            </div>
                          )}
                          {wifi.hidden && (
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Type</p>
                                <p className="text-gray-900 font-medium">Hidden Network</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    } catch {
                      return <p className="text-sm text-gray-500">WiFi network information</p>
                    }
                  })()}
                </div>
              )}

              {qr.type === 'url' && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <h5 className="font-medium text-gray-900 mb-1">Website URL</h5>
                  <p className="text-sm text-blue-600 break-all">{qr.content}</p>
                </div>
              )}

              {qr.type === 'text' && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h5 className="font-medium text-gray-900">Plain Text</h5>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Content</p>
                        <p className="text-gray-900 font-medium break-words">{qr.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {qr.type === 'email' && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h5 className="font-medium text-gray-900">Email Address</h5>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900 font-medium">{qr.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Info */}
              {qr.isDynamic && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-1">
                    <BarChart3 className="h-4 w-4 text-blue-600 mr-2" />
                    <h5 className="font-medium text-blue-900">Analytics Enabled</h5>
                  </div>
                  <p className="text-sm text-blue-700">
                    This QR code tracks scans and provides detailed analytics.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete QR Code</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <strong>"{qr.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
