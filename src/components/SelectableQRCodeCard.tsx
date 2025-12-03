'use client'

import { useState, useEffect } from 'react'
import { QrCode, BarChart3, Edit, Trash2, Copy, Download, Eye, Check, X, Share2, Settings } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'
import { useToast } from '@/hooks/useToast'
import { QRCode, SelectableQRCodeCardProps } from '@/types'
import { useUserTimezone } from '@/hooks/useUserTimezone'
import { formatTimeAgoInTimezone } from '@/lib/date-utils'
import QRShareModal from './QRShareModal'


export default function SelectableQRCodeCard({ 
  qr, 
  onEdit, 
  onDelete, 
  onShare, 
  isSelected, 
  onToggleSelection, 
  showSelection 
}: SelectableQRCodeCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
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
          // For dynamic QR codes, use the shortUrl if available for tracking
          const qrContent = (qr.isDynamic && qr.shortUrl) 
            ? qr.shortUrl 
            : qr.content
          
          const qrImage = await QRGenerator.generateQRCode({
            type: qr.type as any,
            content: qrContent,
            size: (qr.settings?.size as number) || 256,
            color: (qr.settings?.color as { dark: string; light: string }) || { dark: '#000000', light: '#FFFFFF' },
            frame: (qr.settings?.frame as { style?: 'square' | 'rounded' | 'circle' | 'dashed'; color?: string; size?: number }) || undefined,
            styling: (qr.settings?.styling as any) || undefined,
            logo: (qr.settings?.logo as any)?.enabled ? {
              dataUrl: (qr.settings.logo as any).dataUrl,
              size: (qr.settings.logo as any).size
            } : undefined
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

  const handleShare = () => {
    setShowShareModal(true)
    setShowActions(false)
  }

  const confirmDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger selection if clicking on interactive elements
    const target = e.target as Element
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return
    }
    
    if (showSelection) {
      onToggleSelection()
    }
  }

  return (
    <div 
      className={`bg-white border rounded-lg p-6 transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 hover:shadow-lg'
      }`}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {showSelection && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 min-w-0">{qr.name}</h3>
              {qr.isDynamic && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0 whitespace-nowrap">
                  Dynamic
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 capitalize">{qr.type} QR Code</p>
        </div>
        
        {/* Actions Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
            className="actions-trigger p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Actions"
          >
            <Settings className="h-5 w-5" />
          </button>
          
          {/* Actions Dropdown */}
          {showActions && (
            <div className="actions-popup absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePreview()
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyLink()
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Image */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {isGenerating ? (
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : qrCodeImage ? (
            <img
              src={qrCodeImage}
              alt={`QR Code for ${qr.name}`}
              className="w-32 h-32 rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{totalScans}</p>
          <p className="text-sm text-gray-600">Total Scans</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">{recentScans}</p>
          <p className="text-sm text-gray-600">This Week</p>
        </div>
      </div>


      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Created {formatTimeAgoInTimezone(qr.createdAt, userTimezone)}
        </span>
      </div>

      {/* Preview Modal */}
      {showPreview && qrCodeImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{qr.name}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={qrCodeImage}
                alt={`QR Code for ${qr.name}`}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete QR Code</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{qr.name}</strong>? This will permanently remove the QR code and all associated analytics data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

      {/* Share Modal */}
      {showShareModal && qrCodeImage && (
        <QRShareModal
          qrCode={qr}
          qrCodeImage={qrCodeImage}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}
