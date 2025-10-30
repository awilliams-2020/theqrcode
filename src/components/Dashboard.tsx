'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Plus, BarChart3, Download, Settings, Shield } from 'lucide-react'
import QRGeneratorModal from './QRGeneratorModal'
import QRCodeCard from './QRCodeCard'
import SelectableQRCodeCard from './SelectableQRCodeCard'
import BulkOperations from './BulkOperations'
import TrialBanner from './TrialBanner'
import { useToast } from '@/hooks/useToast'
import { useSubscriptionRefresh } from '@/hooks/useSubscriptionRefresh'
import { useSimpleTranslation } from '@/hooks/useSimpleTranslation'
import { QRCode, QRCodeFormData, Subscription, DashboardProps } from '@/types'
import { createQRCode, updateQRCode, deleteQRCode } from '@/utils/api'
import { captureException } from '@/lib/sentry'

export default function Dashboard({ qrCodes, subscription, totalScans, limits, currentPlan, isTrialActive, planDisplayName }: DashboardProps) {
  const router = useRouter()
  const { refreshSubscription } = useSubscriptionRefresh()
  const { t } = useSimpleTranslation()
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null)
  const [selectedQRIds, setSelectedQRIds] = useState<string[]>([])
  const [showBulkMode, setShowBulkMode] = useState(false)
  
  // Auto-enable bulk mode for Pro users when they have QR codes
  useEffect(() => {
    const hasProAccess = currentPlan === 'pro' || currentPlan === 'business' || (isTrialActive && (currentPlan === 'pro' || currentPlan === 'business'))
    if (hasProAccess && qrCodes.length > 0) {
      setShowBulkMode(true)
    }
  }, [currentPlan, isTrialActive, qrCodes.length])
  const { showSuccess, showError, showWarning } = useToast()

  // Handle Stripe checkout success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')
    const sessionId = urlParams.get('session_id')

    if (success === 'true' && sessionId) {
      showSuccess(
        t('success'),
        t('subscriptionActivatedMessage')
      )
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      // Refresh subscription data to get updated plan
      refreshSubscription()
    } else if (canceled === 'true') {
      showWarning(
        t('checkoutCanceled'),
        t('checkoutCanceledMessage')
      )
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [showSuccess, showWarning, refreshSubscription])


  const handleEditQR = (qr: QRCode) => {
    setSelectedQR(qr)
    setShowGenerator(true)
  }

  const handleCloseGenerator = () => {
    setShowGenerator(false)
    setSelectedQR(null)
  }

  // Bulk operations functions
  const handleBulkDelete = async (qrIds: string[]) => {
    try {
      // Delete QR codes one by one (could be optimized with a bulk API call)
      for (const qrId of qrIds) {
        await deleteQRCode(qrId)
      }
      
      // Refresh the page to update the QR codes list
      window.location.reload()
    } catch (error) {
      console.error('Bulk delete error:', error)
      throw error
    }
  }

  const handleBulkDownload = async (qrIds: string[]) => {
    try {
      // Download each QR code individually
      for (const qrId of qrIds) {
        const qr = qrCodes.find(q => q.id === qrId)
        if (qr) {
          // Generate QR code image and download
          const { QRGenerator } = await import('@/lib/qr-generator')
          const qrImage = await QRGenerator.generateQRCode({
            type: qr.type as any,
            content: qr.content,
            size: (qr.settings?.size as number) || 256,
            color: (qr.settings?.color as { dark: string; light: string }) || { dark: '#000000', light: '#FFFFFF' },
            frame: (qr.settings?.frame as { style?: 'square' | 'rounded' | 'circle' | 'dashed'; color?: string; size?: number }) || undefined,
            styling: (qr.settings?.styling as any) || undefined
          })
          
          const link = document.createElement('a')
          link.href = qrImage
          link.download = `${qr.name.replace(/\s+/g, '_')}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    } catch (error) {
      console.error('Bulk download error:', error)
      throw error
    }
  }


  const handleSaveQR = async (qrData: QRCodeFormData) => {
    const isEdit = !!qrData.id
    try {
      const response = isEdit 
        ? await updateQRCode(qrData.id!, qrData)
        : await createQRCode(qrData)

      if (!response.success) {
        // Only check for limit errors on create operations, not edits
        if (!isEdit && response.error?.includes('limit reached')) {
          showWarning(
            'QR Code Limit Reached',
            t('qrCodeLimitReached', { plan: currentPlan })
          )
          return
        }
        
        throw new Error(response.error || `Failed to ${isEdit ? 'update' : 'save'} QR code`)
      }

      showSuccess(
        isEdit ? t('qrCodeUpdated') : t('qrCodeCreated'),
        t('qrCodeSaveSuccess', { name: qrData.name, action: isEdit ? t('updated') : t('saved') })
      )
      
      // Refresh the page to show the updated QR code
      window.location.reload()
    } catch (error) {
      captureException(error, { component: 'Dashboard', action: 'save-qr-code', isEdit })
      showError(
        t('failedToSaveQRCode'),
        t('unexpectedErrorOccurred')
      )
    }
  }

  const handleDeleteQR = async (qrId: string) => {
    try {
      const response = await deleteQRCode(qrId)

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete QR code')
      }

      showSuccess(
        t('qrCodeDeleted'),
        t('qrCodeDeleteSuccess')
      )

      // Refresh the page to update the QR codes list
      window.location.reload()
    } catch (error) {
      captureException(error, { component: 'Dashboard', action: 'delete-qr-code', qrId })
      showError(
        t('failedToDeleteQRCode'),
        t('unexpectedErrorOccurred')
      )
    }
  }


  const usagePercentage = {
    qrCodes: limits.qrCodes === -1 ? 0 : (qrCodes.length / limits.qrCodes) * 100,
    scans: limits.scans === -1 ? 0 : (totalScans / limits.scans) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trial Status Banner */}
        <TrialBanner 
          trialEndsAt={subscription?.trialEndsAt} 
          status={subscription?.status || 'active'}
          currentPlan={currentPlan}
          onUpgrade={async () => {
            try {
              const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plan: 'pro' }),
              })
              const data = await response.json()
              if (response.ok && data.url) {
                window.location.href = data.url
              } else {
                throw new Error(data.error || 'Failed to create checkout session')
              }
            } catch (error) {
              console.error('Error creating checkout:', error)
              captureException(error, { component: 'Dashboard', action: 'create-checkout', plan: 'pro' })
              showError(t('checkoutFailed'), t('unableToStartCheckout'))
            }
          }}
          onViewPlans={() => window.location.href = '/pricing'}
        />
        
        {/* Current Plan Indicator */}
        {planDisplayName && (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('currentPlan')}</h3>
                  <p className="text-sm text-gray-600">
                    {planDisplayName} • {limits.qrCodes === -1 ? t('unlimited') : `${limits.qrCodes.toLocaleString()}`} {t('qrCodes')} • {limits.scans === -1 ? t('unlimited') : `${limits.scans.toLocaleString()}`} {t('scansPerMonth')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isTrialActive && (
                    <div className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                      {t('trialActive')}
                    </div>
                  )}
                  {currentPlan === 'free' && (
                    <button
                      onClick={() => window.location.href = '/pricing'}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>{t('viewPlans')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">{t('totalQRCodes')}</p>
                <p className="text-2xl font-bold text-gray-900">{qrCodes.length}</p>
                {limits.qrCodes !== -1 && (
                  <p className="text-xs text-gray-700">
                    {limits.qrCodes - qrCodes.length} {t('remaining')}
                  </p>
                )}
              </div>
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
            {limits.qrCodes !== -1 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(usagePercentage.qrCodes, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">{t('qrTotalScans')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalScans.toLocaleString()}</p>
                {limits.scans !== -1 && (
                  <p className="text-xs text-gray-700">
                    {limits.scans - totalScans} {t('remaining')}
                  </p>
                )}
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            {limits.scans !== -1 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(usagePercentage.scans, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">{t('dynamicQRCodes')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {qrCodes.filter(qr => qr.isDynamic).length}
                </p>
                <p className="text-xs text-gray-700">{t('withAnalytics')}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">{t('avgScansPerQR')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {qrCodes.length > 0 ? Math.round(totalScans / qrCodes.length) : 0}
                </p>
                <p className="text-xs text-gray-700">{t('thisMonth')}</p>
              </div>
              <Download className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>


        {/* QR Codes Grid */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('yourQRCodes')}</h2>
                <p className="text-sm text-gray-800 mt-1">
                  {t('manageAndTrackQRCodes')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {(currentPlan === 'starter' || currentPlan === 'pro' || currentPlan === 'business' || (isTrialActive && (currentPlan === 'starter' || currentPlan === 'pro' || currentPlan === 'business'))) && (
                  <button
                    onClick={() => router.push('/analytics')}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium self-start sm:self-center"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{t('viewAnalytics')}</span>
                  </button>
                )}
                
                
                <button
                  onClick={() => {
                    setSelectedQR(null)
                    setShowGenerator(true)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium self-start sm:self-center"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('qrGenerate')}</span>
                </button>
              </div>
            </div>
          </div>
          
          {qrCodes.length === 0 ? (
            <div className="p-12 text-center">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noQRCodesYet')}</h3>
              <p className="text-gray-800">
                {t('createFirstQRCodeMessage')}
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Bulk Operations Component */}
              <BulkOperations
                qrCodes={qrCodes}
                selectedIds={selectedQRIds}
                onSelectionChange={setSelectedQRIds}
                onBulkDelete={handleBulkDelete}
                onBulkDownload={handleBulkDownload}
                currentPlan={currentPlan}
                isTrialActive={isTrialActive}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qrCodes.map((qr) => (
                  showBulkMode ? (
                    <SelectableQRCodeCard
                      key={qr.id}
                      qr={qr}
                      onEdit={() => handleEditQR(qr)}
                      onDelete={() => handleDeleteQR(qr.id)}
                      onShare={() => {}} // Share functionality is handled within QRCodeCard
                      isSelected={selectedQRIds.includes(qr.id)}
                      onToggleSelection={() => {
                        if (selectedQRIds.includes(qr.id)) {
                          setSelectedQRIds(selectedQRIds.filter(id => id !== qr.id))
                        } else {
                          setSelectedQRIds([...selectedQRIds, qr.id])
                        }
                      }}
                      showSelection={showBulkMode}
                    />
                  ) : (
                    <QRCodeCard
                      key={qr.id}
                      qr={qr}
                      onEdit={() => handleEditQR(qr)}
                      onDelete={() => handleDeleteQR(qr.id)}
                      onShare={() => {}} // Share functionality is handled within QRCodeCard
                    />
                  )
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* QR Generator Modal */}
      {showGenerator && (
        <QRGeneratorModal
          qrCode={selectedQR}
          onSave={handleSaveQR}
          onCancel={handleCloseGenerator}
          currentPlan={currentPlan}
          isTrialActive={isTrialActive}
        />
      )}

    </div>
  )
}
