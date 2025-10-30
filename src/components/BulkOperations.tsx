'use client'

import { useState, useEffect } from 'react'
import { Trash2, Download, Check, X, AlertTriangle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { QRCode } from '@/types'
import { useSimpleTranslation } from '@/hooks/useSimpleTranslation'

interface BulkOperationsProps {
  qrCodes: QRCode[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkDownload: (ids: string[]) => Promise<void>
  currentPlan: string
  isTrialActive?: boolean
}

export default function BulkOperations({
  qrCodes,
  selectedIds,
  onSelectionChange,
  onBulkDelete,
  onBulkDownload,
  currentPlan,
  isTrialActive
}: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { showSuccess, showError, showWarning } = useToast()
  const { t } = useSimpleTranslation()

  // Check if user has Pro plan access
  const hasProAccess = currentPlan === 'pro' || currentPlan === 'business' || (isTrialActive && (currentPlan === 'pro' || currentPlan === 'business'))

  // Select all QR codes
  const handleSelectAll = () => {
    if (selectedIds.length === qrCodes.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(qrCodes.map(qr => qr.id))
    }
  }

  // Toggle individual QR code selection
  const handleToggleSelection = (qrId: string) => {
    if (selectedIds.includes(qrId)) {
      onSelectionChange(selectedIds.filter(id => id !== qrId))
    } else {
      onSelectionChange([...selectedIds, qrId])
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    setIsProcessing(true)
    try {
      await onBulkDelete(selectedIds)
      showSuccess(
        t('qrCodesDeleted'),
        t('bulkDeleteSuccess', { count: selectedIds.length.toString() })
      )
      onSelectionChange([])
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Bulk delete error:', error)
      showError(t('deleteFailed'), t('bulkDeleteFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle bulk download
  const handleBulkDownload = async () => {
    if (selectedIds.length === 0) return

    setIsProcessing(true)
    try {
      await onBulkDownload(selectedIds)
      showSuccess(
        t('downloadStarted'),
        t('bulkDownloadMessage', { count: selectedIds.length.toString() })
      )
    } catch (error) {
      console.error('Bulk download error:', error)
      showError(t('downloadFailed'), t('bulkDownloadFailed'))
    } finally {
      setIsProcessing(false)
    }
  }

  // Don't render if user doesn't have Pro access
  if (!hasProAccess) {
    return null
  }

  return (
    <>
      {/* Bulk Operations Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {t('qrCodesSelected', { count: selectedIds.length.toString() })}
                </span>
              </div>
              <button
                onClick={() => onSelectionChange([])}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
{t('clearSelection')}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleBulkDownload}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{t('download')}</span>
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === qrCodes.length && qrCodes.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {t('selectAll')} ({qrCodes.length})
              </span>
            </label>
          </div>
        </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {t('deleteQRCodes')}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t('actionCannotBeUndone')}
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              {t('bulkDeleteConfirm', { count: selectedIds.length.toString() })} 
              {t('bulkDeleteConfirmMessage')}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
{t('cancel')}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('deleting')}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>{t('delete')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
