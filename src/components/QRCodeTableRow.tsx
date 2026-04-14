'use client'

import { useState, useEffect } from 'react'
import { QrCode, BarChart3, Edit, Trash2, Copy, Download, Eye, Check, X, Share2 } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'
import { useToast } from '@/hooks/useToast'
import { QRCode } from '@/types'
import MenuPreview from './MenuPreview'
import { useUserTimezone } from '@/hooks/useUserTimezone'
import { formatTimeAgoInTimezone } from '@/lib/date-utils'
import QRShareModal from './QRShareModal'

interface QRCodeTableRowProps {
  qr: QRCode
  onEdit: () => void
  onDelete: () => void
  showSelection: boolean
  isSelected: boolean
  onToggleSelection: () => void
}

const TYPE_STYLES: Record<string, string> = {
  url: 'bg-blue-100 text-blue-700',
  contact: 'bg-green-100 text-green-700',
  wifi: 'bg-purple-100 text-purple-700',
  text: 'bg-yellow-100 text-yellow-700',
  email: 'bg-orange-100 text-orange-700',
  menu: 'bg-red-100 text-red-700',
}

function getContentSnippet(qr: QRCode): string {
  if (qr.type === 'contact') {
    try {
      const c = JSON.parse(qr.content)
      const name = [c.firstName, c.lastName].filter(Boolean).join(' ')
      return c.email ? `${name} · ${c.email}` : name
    } catch {
      return 'Contact'
    }
  }
  if (qr.type === 'wifi') {
    try {
      const w = JSON.parse(qr.content)
      return `Network: ${w.ssid}`
    } catch {
      return 'WiFi'
    }
  }
  if (qr.type === 'menu') {
    try {
      const m = JSON.parse(qr.content) as MenuData
      return m.restaurantName || 'Menu'
    } catch {
      return 'Menu'
    }
  }
  return qr.content
}

export default function QRCodeTableRow({
  qr,
  onEdit,
  onDelete,
  showSelection,
  isSelected,
  onToggleSelection,
}: QRCodeTableRowProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const { showSuccess, showError } = useToast()
  const userTimezone = useUserTimezone()

  const totalScans = qr.scans?.length || 0
  const recentScans =
    qr.scans?.filter(
      (scan) => new Date(scan.scannedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0

  useEffect(() => {
    const generate = async () => {
      if (!qr.content) return
      setIsGenerating(true)
      try {
        const qrContent = qr.isDynamic && qr.shortUrl ? qr.shortUrl : qr.content
        const img = await QRGenerator.generateQRCode({
          type: qr.type as any,
          content: qrContent,
          size: (qr.settings?.size as number) || 256,
          color: (qr.settings?.color as { dark: string; light: string }) || {
            dark: '#000000',
            light: '#FFFFFF',
          },
          frame:
            (qr.settings?.frame as {
              style?: 'square' | 'rounded' | 'circle' | 'dashed'
              color?: string
              size?: number
            }) || undefined,
          styling: (qr.settings?.styling as any) || undefined,
          logo: (qr.settings?.logo as any)?.enabled
            ? {
                dataUrl: (qr.settings.logo as any).dataUrl,
                size: (qr.settings.logo as any).size,
              }
            : undefined,
        })
        setQrCodeImage(img)
      } catch (error) {
        console.error('Error generating QR code:', error)
      } finally {
        setIsGenerating(false)
      }
    }
    generate()
  }, [qr])

  const handleCopyLink = async () => {
    const url =
      qr.isDynamic && qr.shortUrl ? qr.shortUrl.replace('/r/', '/display/') : qr.content
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showSuccess('Link Copied', 'The QR code display link has been copied to your clipboard.')
    } catch {
      showError('Failed to Copy Link', 'Unable to copy the link to your clipboard. Please try again.')
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
      showSuccess('Download Started', `${qr.name} QR code is being downloaded.`)
    } catch {
      showError('Download Failed', 'Unable to download the QR code. Please try again.')
    }
  }

  const typeStyle = TYPE_STYLES[qr.type] ?? 'bg-gray-100 text-gray-700'
  const contentSnippet = getContentSnippet(qr)

  const QRThumbnail = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => {
    const dims = size === 'md' ? 'w-14 h-14' : 'w-10 h-10'
    return (
      <div className={`${dims} flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 shrink-0`}>
        {isGenerating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
        ) : qrCodeImage ? (
          <img src={qrCodeImage} alt={qr.name} className="w-full h-full object-contain rounded-lg" />
        ) : (
          <QrCode className={`${size === 'md' ? 'h-7 w-7' : 'h-5 w-5'} text-gray-400`} />
        )}
      </div>
    )
  }

  return (
    <>
      {/*
       * Responsive strategy (best practice: CSS block display transform)
       * Mobile/tablet (< lg): each <tr> renders as a card (block display)
       * Desktop (lg+): standard table-row layout
       */}
      <tr
        className={`
          block lg:table-row
          border border-gray-200 lg:border-0 lg:border-b lg:border-gray-100
          rounded-xl lg:rounded-none
          mb-3 lg:mb-0
          bg-white lg:bg-transparent
          overflow-hidden lg:overflow-visible
          shadow-sm lg:shadow-none
          hover:shadow-md lg:hover:shadow-none lg:hover:bg-gray-50
          transition-all
          ${isSelected ? 'border-blue-400 lg:border-blue-100 bg-blue-50 lg:bg-blue-50' : ''}
        `}
      >
        {/* ── Checkbox: desktop column / embedded in header on mobile ── */}
        {showSelection && (
          <td className="hidden lg:table-cell px-4 py-4 w-8 align-middle">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelection}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </td>
        )}

        {/* ── QR thumbnail: desktop column only ── */}
        <td className="hidden lg:table-cell px-4 py-4 w-12 align-middle">
          <QRThumbnail size="sm" />
        </td>

        {/* ── Name: always visible ──
            Mobile: shows QR thumbnail + checkbox + name + type + content
            Desktop: shows name + analytics badge only
        */}
        <td className="block lg:table-cell px-4 pt-4 pb-3 lg:py-4 align-middle">
          <div className="flex items-start gap-3">
            {/* Mobile: checkbox before QR */}
            {showSelection && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelection}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0 lg:hidden"
              />
            )}
            {/* Mobile: QR thumbnail (hidden on desktop, has its own column there) */}
            <div className="lg:hidden">
              <QRThumbnail size="md" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 break-words">{qr.name}</span>
                {qr.isDynamic && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium whitespace-nowrap">
                    <BarChart3 className="h-3 w-3" />
                    Analytics
                  </span>
                )}
              </div>
              {/* Mobile: type badge only */}
              <div className="lg:hidden flex flex-wrap items-center gap-2 mt-1.5">
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium capitalize shrink-0 ${typeStyle}`}>
                  {qr.type}
                </span>
              </div>
            </div>
          </div>
        </td>

        {/* ── Type: desktop only ── */}
        <td className="hidden lg:table-cell px-4 py-4 align-middle">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${typeStyle}`}>
            {qr.type}
          </span>
        </td>

        {/* ── Stats: inline-block on mobile so all three sit in a row ──
            Each takes 1/3 width on mobile with a top border acting as a divider row.
            On desktop they're normal table-cells.
        */}
        <td className="inline-block lg:table-cell w-1/3 lg:w-auto px-2 lg:px-4 py-3 lg:py-4 text-center lg:text-right border-t border-gray-100 lg:border-t-0 align-middle">
          <p className="text-xs text-gray-400 uppercase font-medium tracking-wide lg:hidden">Scans</p>
          <p className="text-sm font-semibold text-gray-900">{totalScans.toLocaleString()}</p>
        </td>

        <td className="inline-block lg:table-cell w-1/3 lg:w-auto px-2 lg:px-4 py-3 lg:py-4 text-center lg:text-right border-t border-gray-100 lg:border-t-0 align-middle">
          <p className="text-xs text-gray-400 uppercase font-medium tracking-wide lg:hidden">This Week</p>
          <p className="text-sm font-semibold text-blue-600">{recentScans.toLocaleString()}</p>
        </td>

        <td
          className="inline-block lg:table-cell w-1/3 lg:w-auto px-2 lg:px-4 py-3 lg:py-4 text-center lg:text-left border-t border-gray-100 lg:border-t-0 align-middle"
          suppressHydrationWarning
        >
          <p className="text-xs text-gray-400 uppercase font-medium tracking-wide lg:hidden">Created</p>
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {formatTimeAgoInTimezone(qr.createdAt, userTimezone)}
          </p>
        </td>

        {/* ── Actions ──
            Mobile: full-width row with icon + text label for touch-friendly targets (min 44px)
            Desktop: compact icon-only buttons in a row
        */}
        <td className="block lg:table-cell px-4 py-3 lg:py-4 border-t border-gray-100 lg:border-t-0 align-middle">
          <div className="flex items-center justify-around lg:justify-start lg:gap-1">
            <button
              onClick={onEdit}
              title="Edit"
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-0 px-1 py-2 lg:p-1.5 text-gray-500 lg:text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg lg:rounded transition-colors min-w-[44px] lg:min-w-0"
            >
              <Edit className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="text-xs lg:hidden">Edit</span>
            </button>
            <button
              onClick={() => setShowPreview(true)}
              title="Preview"
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-0 px-1 py-2 lg:p-1.5 text-gray-500 lg:text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:rounded transition-colors min-w-[44px] lg:min-w-0"
            >
              <Eye className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="text-xs lg:hidden">Preview</span>
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              title="Share"
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-0 px-1 py-2 lg:p-1.5 text-gray-500 lg:text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:rounded transition-colors min-w-[44px] lg:min-w-0"
            >
              <Share2 className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="text-xs lg:hidden">Share</span>
            </button>
            <button
              onClick={handleCopyLink}
              title={copied ? 'Copied!' : 'Copy Link'}
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-0 px-1 py-2 lg:p-1.5 text-gray-500 lg:text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:rounded transition-colors min-w-[44px] lg:min-w-0"
            >
              {copied ? (
                <Check className="h-5 w-5 lg:h-4 lg:w-4 text-green-600" />
              ) : (
                <Copy className="h-5 w-5 lg:h-4 lg:w-4" />
              )}
              <span className="text-xs lg:hidden">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              title="Download"
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-0 px-1 py-2 lg:p-1.5 text-gray-500 lg:text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:rounded transition-colors min-w-[44px] lg:min-w-0"
            >
              <Download className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="text-xs lg:hidden">Download</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete"
              className="flex flex-col lg:flex-row items-center gap-1 lg:gap-0 px-1 py-2 lg:p-1.5 text-gray-500 lg:text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg lg:rounded transition-colors min-w-[44px] lg:min-w-0"
            >
              <Trash2 className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="text-xs lg:hidden">Delete</span>
            </button>
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
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-3 shadow-sm">
                      {qrCodeImage ? (
                        <img src={qrCodeImage} alt={qr.name} className="max-w-full h-auto mx-auto max-h-48" />
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <QrCode className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
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
                  {qr.type === 'menu' ? (
                    <MenuPreview content={qr.content} className="mb-4" />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1 uppercase font-medium tracking-wide">Content</p>
                      <p className="text-sm text-gray-800 break-all">{contentSnippet}</p>
                    </div>
                  )}
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
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>&quot;{qr.name}&quot;</strong>? This action cannot be undone.
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
                    onClick={() => {
                      onDelete()
                      setShowDeleteConfirm(false)
                    }}
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
        </td>
      </tr>
    </>
  )
}

