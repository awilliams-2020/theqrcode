'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, ExternalLink, BarChart3 } from 'lucide-react'
import { QRGenerator } from '@/lib/qr-generator'

interface PageProps {
  params: Promise<{
    shortCode: string
  }>
}

export default function QRCodeDisplayPage({ params }: PageProps) {
  const [qrCodeData, setQrCodeData] = useState<any>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchQRCodeData = async () => {
      try {
        const { shortCode } = await params
        // Fetch QR code info
        const infoResponse = await fetch(`/api/qr-info/${shortCode}`)
        
        if (infoResponse.status === 404) {
          setError('QR code not found')
          setLoading(false)
          return
        }

        if (!infoResponse.ok) {
          throw new Error('Failed to fetch QR code data')
        }

        const infoData = await infoResponse.json()
        setQrCodeData(infoData)
        
        // Generate QR code client-side with styling options
        const settings = infoData.settings as any
        
        // Use window.location to determine the correct base URL for the current environment
        const isDev = typeof window !== 'undefined' && window.location.hostname === 'dev.theqrcode.io'
        const baseUrl = isDev ? 'https://dev.theqrcode.io' : (process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io')
        
        const qrContent = infoData.isDynamic 
          ? `${baseUrl}/r/${shortCode}` 
          : infoData.content
        
        const qrImage = await QRGenerator.generateQRCode({
          type: infoData.type as any,
          content: qrContent,
          size: settings?.size || 256,
          color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
          frame: settings?.frame || undefined,
          styling: settings?.styling || undefined,
          logo: (settings?.logo as any)?.enabled ? {
            dataUrl: (settings.logo as any).dataUrl,
            size: (settings.logo as any).size
          } : undefined
        })
        
        setQrCodeImage(qrImage)
      } catch (err) {
        console.error('Error fetching QR code data:', err)
        setError('Failed to load QR code')
      } finally {
        setLoading(false)
      }
    }

    fetchQRCodeData()
  }, [params])

  const handleScan = async () => {
    try {
      const { shortCode } = await params
      // Track the scan first
      await fetch(`/api/track/${shortCode}`, { method: 'POST' })
      
      // Then redirect to the actual content
      if (qrCodeData?.type === 'url' || qrCodeData?.type === 'email') {
        let redirectUrl = qrCodeData.content
        
        // Ensure the URL has a protocol for URL types
        if (qrCodeData.type === 'url' && !redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
          redirectUrl = `https://${redirectUrl}`
        }
        
        // Add mailto: prefix for email types
        if (qrCodeData.type === 'email' && !redirectUrl.startsWith('mailto:')) {
          redirectUrl = `mailto:${redirectUrl}`
        }
        
        window.location.href = redirectUrl
      } else if (qrCodeData?.type === 'wifi') {
        // For WiFi QR codes, show connection instructions
        // The user is already on the display page with WiFi info
        // Mobile devices should automatically detect the WiFi QR format
        console.log('WiFi QR code scanned - connection instructions displayed')
      } else {
        // For text, etc., stay on display page
        // (they're already on the right page)
      }
    } catch (error) {
      console.error('Error tracking scan:', error)
    }
  }

  const handleDownloadContact = async () => {
    try {
      const { shortCode } = await params
      // Track the download
      await fetch(`/api/track/${shortCode}`, { method: 'POST' })
      
      // Create a blob and trigger download that should open native contacts app
      if (qrCodeData?.type === 'contact' && qrCodeData?.content) {
        const contactData = JSON.parse(qrCodeData.content)
        const vCard = formatContactVCard(contactData)
        
        // Create a blob with the vCard data
        const blob = new Blob([vCard], { type: 'text/vcard' })
        const url = URL.createObjectURL(blob)
        
        // Create a temporary link element
        const link = document.createElement('a')
        link.href = url
        link.download = `${contactData.firstName || 'contact'}.vcf`
        
        // Add to DOM, click, and remove
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the URL
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (error) {
      console.error('Error opening contact:', error)
    }
  }

  const formatContactVCard = (contactData: any): string => {
    const {
      firstName,
      lastName,
      organization,
      phone,
      email,
      url,
      address
    } = contactData

    let vcard = 'BEGIN:VCARD\n'
    vcard += 'VERSION:3.0\n'
    vcard += `FN:${firstName} ${lastName}\n`
    vcard += `N:${lastName};${firstName};;;\n`
    
    if (organization) vcard += `ORG:${organization}\n`
    if (phone) vcard += `TEL:${phone}\n`
    if (email) vcard += `EMAIL:${email}\n`
    if (url) vcard += `URL:${url}\n`
    if (address) vcard += `ADR:;;${address};;;;\n`
    
    vcard += 'END:VCARD'
    return vcard
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR code...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
          <p className="text-gray-600">
            Scan this QR code with your camera to access the content
          </p>
        </div>

        <div className="mb-6">
          <div className={`rounded-lg p-6 mb-4 ${qrCodeImage && (qrCodeData?.settings as any)?.frame?.style === 'circle' ? '' : 'bg-gray-100'}`}>
            <div className={`w-48 h-48 mx-auto flex items-center justify-center ${qrCodeImage && (qrCodeData?.settings as any)?.frame?.style === 'circle' ? '' : 'bg-white rounded-lg border-2 border-gray-200'}`}>
              {qrCodeImage ? (
                <img 
                  src={qrCodeImage} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <QrCode className="h-24 w-24 text-gray-400" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Point your camera at the QR code above
          </p>
        </div>

        <div className="space-y-3">
          {qrCodeData?.type === 'contact' ? (
            <div className="space-y-2">
              <button
                onClick={handleDownloadContact}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Download Contact</span>
              </button>
              <p className="text-xs text-gray-500 text-center">
                Tap to download the contact file, then open it to add to your contacts
              </p>
            </div>
          ) : qrCodeData?.type === 'url' || qrCodeData?.type === 'email' ? (
            <button
              onClick={handleScan}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Link</span>
            </button>
          ) : null}
          
          {qrCodeData?.type === 'contact' && qrCodeData?.content ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {(() => {
                try {
                  const contactData = JSON.parse(qrCodeData.content)
                  return (
                    <div className="text-left">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-blue-600 font-semibold text-lg">
                            {contactData.firstName?.[0]}{contactData.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {contactData.firstName} {contactData.lastName}
                          </h3>
                          {contactData.organization && (
                            <p className="text-gray-600 font-medium">{contactData.organization}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {contactData.email && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="text-gray-900 font-medium">{contactData.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {contactData.phone && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="text-gray-900 font-medium">{contactData.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {contactData.url && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Website</p>
                              <p className="text-gray-900 font-medium">{contactData.url}</p>
                            </div>
                          </div>
                        )}
                        
                        {contactData.address && (
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="text-gray-900 font-medium">{contactData.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                } catch (error) {
                  return (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Contact information not available</p>
                    </div>
                  )
                }
              })()}
            </div>
          ) : qrCodeData?.type === 'wifi' && qrCodeData?.content ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              {(() => {
                try {
                  const wifiData = JSON.parse(qrCodeData.content)
                  return (
                    <div className="text-left">
                      {/* WiFi Header with SVG icon */}
                      <div className="flex items-center mb-5">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">WiFi Network</h3>
                          <p className="text-gray-600 text-sm">{wifiData.ssid}</p>
                        </div>
                      </div>
                      
                      {/* WiFi Details with colored icons */}
                      <div className="space-y-4">
                        {/* Network Name */}
                        <div className="flex items-center py-3 border-b border-gray-100">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Network Name</p>
                            <p className="text-sm font-medium text-gray-900">{wifiData.ssid}</p>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(wifiData.ssid)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                            title="Copy network name"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Password */}
                        {wifiData.password && wifiData.security !== 'nopass' && (
                          <div className="flex items-center py-3 border-b border-gray-100">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Password</p>
                              <p className="text-sm font-medium text-gray-900 font-mono">{wifiData.password}</p>
                            </div>
                            <button
                              onClick={() => navigator.clipboard.writeText(wifiData.password)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                              title="Copy password"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        )}
                        
                        {/* Security Type */}
                        {wifiData.security && (
                          <div className="flex items-center py-3 border-b border-gray-100">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Security Type</p>
                              <p className="text-sm font-medium text-gray-900">{wifiData.security}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Hidden Network */}
                        {wifiData.hidden && (
                          <div className="flex items-center py-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">Network Type</p>
                              <p className="text-sm font-medium text-gray-900">Hidden Network</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Connection Instructions */}
                      <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Connection Instructions</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>1. Go to your device's WiFi settings</p>
                          <p>2. Look for "{wifiData.ssid}" in the network list</p>
                          <p>3. Enter the password when prompted</p>
                          {wifiData.password && wifiData.security !== 'nopass' && (
                            <p className="mt-2 font-medium">💡 Tip: You can copy the password above to paste it easily!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                } catch (error) {
                  return (
                    <div className="text-center py-4">
                      <p className="text-gray-500">WiFi network information not available</p>
                    </div>
                  )
                }
              })()}
            </div>
          ) : qrCodeData?.type === 'text' && qrCodeData?.content ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="text-left">
                {/* Text Header with icon */}
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Plain Text</h3>
                    <p className="text-gray-600 text-sm">Text content from QR code</p>
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Content</p>
                      <p className="text-gray-900 font-medium break-words whitespace-pre-wrap">{qrCodeData.content}</p>
                    </div>
                  </div>
                </div>
                
                {/* Copy Button */}
                <button
                  onClick={() => navigator.clipboard.writeText(qrCodeData.content)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Text</span>
                </button>
              </div>
            </div>
          ) : qrCodeData?.type === 'email' && qrCodeData?.content ? (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="text-left">
                {/* Email Header with icon */}
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Email Address</h3>
                    <p className="text-gray-600 text-sm">Contact information from QR code</p>
                  </div>
                </div>
                
                {/* Email Content */}
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900 font-medium">{qrCodeData.content}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(qrCodeData.content)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Email</span>
                  </button>
                  <button
                    onClick={() => window.location.href = `mailto:${qrCodeData.content}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          ) : qrCodeData?.type === 'url' && qrCodeData?.content && (
            <div className="text-xs text-gray-500">
              <p>This QR code will take you to:</p>
              <p className="font-mono text-blue-600 truncate">{qrCodeData.content}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics enabled</span>
          </div>
          <div className="text-center text-xs text-gray-400">
            Powered by <a href="https://theqrcode.io" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-500 hover:text-blue-600 transition-colors">TheQRCode.io</a>
          </div>
        </div>
      </div>
    </div>
  )
}