'use client'

import { useState, useEffect, useCallback } from 'react'
import { QrCode, Download, Copy, X, Save, Check, Utensils } from 'lucide-react'
import { QRGenerator as QRGen } from '@/lib/qr-generator'
import { QRCodeOptions, MenuData } from '@/types'
import { QRCode, QRGeneratorModalProps, QRCodeFormData, QRStylingOptions } from '@/types'
import { getPlanFeatures } from '@/utils/plan-utils'
import { QR_CODE_SIZES, FRAME_SIZES, LOGO_CONSTRAINTS, QR_DOT_TYPES, QR_CORNER_SQUARE_TYPES, QR_CORNER_DOT_TYPES, QR_BACKGROUND_TYPES } from '@/constants'
import MenuBuilder from './MenuBuilder'
import WiFiInput from './WiFiInput'
import VCardInput from './VCardInput'

export default function QRGeneratorModal({ qrCode, onSave, onCancel, currentPlan = 'free', isTrialActive = false }: QRGeneratorModalProps) {
  const [formData, setFormData] = useState({
    name: qrCode?.name || '',
    type: qrCode?.type || 'url',
    content: qrCode?.content || '',
    isDynamic: qrCode?.isDynamic || false,
    size: (qrCode?.settings?.size as number) || QR_CODE_SIZES.DEFAULT,
    color: (qrCode?.settings?.color as { dark: string; light: string }) || { dark: '#000000', light: '#FFFFFF' },
    frame: {
      style: (qrCode?.settings?.frame as any)?.style || 'square',
      color: (qrCode?.settings?.frame as any)?.color || '#000000',
      size: (qrCode?.settings?.frame as any)?.size || FRAME_SIZES.DEFAULT
    },
    styling: (qrCode?.settings?.styling as QRStylingOptions) || { 
      dotsType: 'rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      backgroundType: 'solid'
    },
    logo: {
      enabled: (qrCode?.settings?.logo as any)?.enabled || false,
      file: null as File | null
    }
  })

  const [qrImage, setQrImage] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [showMenuBuilder, setShowMenuBuilder] = useState(false)

  // Plan-based feature access
  const planFeatures = getPlanFeatures(currentPlan as any, isTrialActive)

  // Reset type to 'url' if free user has email type selected
  useEffect(() => {
    if (!planFeatures.hasAllQRTypes && formData.type === 'email') {
      setFormData(prev => ({ ...prev, type: 'url' }))
    }
  }, [planFeatures.hasAllQRTypes, formData.type])

  const allDemoExamples = [
    {
      title: 'Website URL',
      content: 'https://theqrcode.io',
      type: 'url' as const,
      description: 'Perfect for linking to your website'
    },
    {
      title: 'WiFi Network',
      content: JSON.stringify({
        ssid: 'Coffee Shop WiFi',
        password: 'Welcome2024',
        security: 'WPA',
        hidden: false
      }),
      type: 'wifi' as const,
      description: 'Share WiFi credentials easily'
    },
    {
      title: 'Contact Card',
      content: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0123',
        email: 'john@example.com',
        organization: 'Example Corp',
        title: 'CEO'
      }),
      type: 'contact' as const,
      description: 'Share contact information'
    },
    {
      title: 'Plain Text',
      content: 'Hello, this is a QR code!',
      type: 'text' as const,
      description: 'Store any text information'
    },
    {
      title: 'Email Address',
      content: 'contact@example.com',
      type: 'email' as const,
      description: 'Quick email contact'
    }
  ]

  // Filter demo examples based on plan
  const demoExamples = planFeatures.hasAllQRTypes 
    ? allDemoExamples 
    : allDemoExamples.filter(example => example.type !== 'email')

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > LOGO_CONSTRAINTS.MAX_SIZE_MB * 1024 * 1024) {
        alert(`Logo file must be smaller than ${LOGO_CONSTRAINTS.MAX_SIZE_MB}MB`)
        return
      }
      
      setLogoFile(file)
      setFormData({
        ...formData,
        logo: {
          ...formData.logo,
          enabled: true,
          file: file
        }
      })
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview('')
    setFormData({
      ...formData,
      logo: {
        ...formData.logo,
        enabled: false,
        file: null
      }
    })
  }

  const generateQRCode = useCallback(async () => {
    if (!formData.content) return
    
    setIsGenerating(true)
    try {
        const options: QRCodeOptions = {
          type: formData.type as any,
          content: formData.content,
          size: formData.size,
          color: formData.color,
          frame: formData.frame,
          styling: formData.styling,
          logo: formData.logo.enabled && logoFile ? {
            file: logoFile,
            size: Math.min(formData.size * LOGO_CONSTRAINTS.MAX_SIZE_PERCENT, LOGO_CONSTRAINTS.MAX_PIXELS)
          } : undefined
        }
      
      const qrDataURL = await QRGen.generateQRCode(options)
      setQrImage(qrDataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
    }, [formData, logoFile])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const qrData: QRCodeFormData = {
        ...formData,
        settings: {
          size: formData.size,
          color: formData.color,
          frame: formData.frame,
          styling: formData.styling
        },
        id: qrCode?.id
      }
      await onSave(qrData)
    } catch (error) {
      console.error('Error saving QR code:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async (format: 'png' | 'svg' | 'pdf' = 'png') => {
    if (!qrImage) return

    try {
      let downloadData = qrImage
      
      if (format === 'svg') {
        const options = {
          type: formData.type as any,
          content: formData.content,
          size: formData.size,
          color: formData.color,
          frame: formData.frame,
          logo: formData.logo.enabled && logoFile ? {
            file: logoFile,
            size: Math.min(formData.size * 0.25, 64)
          } : undefined
        }
        
        downloadData = await QRGen.generateSVG(options)
        
        // Create blob from SVG string
        const blob = new Blob([downloadData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${formData.name.replace(/\s+/g, '_') || 'qrcode'}.svg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // For PDF, we'll convert the PNG to PDF
        // This is a simplified implementation - in production you might want to use a library like jsPDF
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          
          // Convert to PDF (simplified - just download as PNG for now)
          const link = document.createElement('a')
          link.href = canvas.toDataURL('image/png')
          link.download = `${formData.name.replace(/\s+/g, '_') || 'qrcode'}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
        img.src = qrImage
      } else {
        // PNG download
        const link = document.createElement('a')
        link.href = downloadData
        link.download = `${formData.name.replace(/\s+/g, '_') || 'qrcode'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading QR code:', error)
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
        // Fallback: copy the data URL
        navigator.clipboard.writeText(qrImage)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleQuickExample = (example: typeof demoExamples[0]) => {
    setFormData({
      ...formData,
      content: example.content,
      type: example.type
    })
  }

  const handleMenuSave = (menuData: MenuData) => {
    setFormData({
      ...formData,
      content: JSON.stringify(menuData)
    })
    setShowMenuBuilder(false)
  }

  const handleMenuBuilderCancel = () => {
    setShowMenuBuilder(false)
    // If there's no existing menu content, revert to URL type
    if (!formData.content || formData.content.trim() === '') {
      setFormData({ ...formData, type: 'url' })
    }
  }

  // Show menu builder if menu type is selected
  if (showMenuBuilder && formData.type === 'menu') {
    let existingMenuData: MenuData | undefined
    
    // Try to parse existing content as menu data
    if (formData.content && formData.content.trim()) {
      try {
        const parsed = JSON.parse(formData.content)
        // Validate it's actually menu data (has categories array)
        if (parsed && Array.isArray(parsed.categories)) {
          existingMenuData = parsed as MenuData
        }
      } catch (error) {
        // Invalid JSON or not menu data, start fresh
        console.log('Content is not valid menu data, starting fresh')
      }
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] flex flex-col">
          <MenuBuilder
            initialData={existingMenuData}
            onSave={handleMenuSave}
            onCancel={handleMenuBuilderCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {qrCode ? 'Edit QR Code' : 'Create New QR Code'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8 mb-5">
            {/* QR Generator */}
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="My QR Code"
                />
              </div>

              {/* Content Input */}
              {formData.type === 'menu' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Content
                  </label>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {formData.content ? 'Menu configured' : 'No menu configured'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMenuBuilder(true)}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      {formData.content ? 'Edit Menu' : 'Build Menu'}
                    </button>
                  </div>
                </div>
              ) : formData.type === 'wifi' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    WiFi Configuration
                  </label>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <WiFiInput
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                    />
                  </div>
                </div>
              ) : formData.type === 'contact' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Contact Card
                  </label>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <VCardInput
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    rows={3}
                    placeholder="Enter your content here..."
                  />
                </div>
              )}

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Type
                  {currentPlan !== 'pro' && currentPlan !== 'business' && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Pro+ for Menu Builder
                    </span>
                  )}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value
                    if (newType === 'menu' && currentPlan !== 'pro' && currentPlan !== 'business') {
                      // Don't allow menu type for non-pro users
                      return
                    }
                    
                    // When switching to a different type, validate content compatibility
                    let newContent = formData.content
                    
                    if (newType === 'menu') {
                      // Check if content is valid menu data
                      try {
                        const parsed = JSON.parse(formData.content || '{}')
                        if (!parsed.categories || !Array.isArray(parsed.categories)) {
                          // Not valid menu data, clear it
                          newContent = ''
                        }
                      } catch {
                        // Invalid JSON, clear it
                        newContent = ''
                      }
                      setShowMenuBuilder(true)
                    } else if (newType === 'wifi') {
                      // Initialize empty WiFi data if content is not WiFi format
                      try {
                        const parsed = JSON.parse(formData.content || '{}')
                        if (!parsed.ssid) {
                          newContent = JSON.stringify({
                            ssid: '',
                            password: '',
                            security: 'WPA',
                            hidden: false
                          })
                        }
                      } catch {
                        newContent = JSON.stringify({
                          ssid: '',
                          password: '',
                          security: 'WPA',
                          hidden: false
                        })
                      }
                    } else if (newType === 'contact') {
                      // Initialize empty VCard data if content is not VCard format
                      try {
                        const parsed = JSON.parse(formData.content || '{}')
                        if (!parsed.phone) {
                          newContent = JSON.stringify({
                            firstName: '',
                            lastName: '',
                            phone: '',
                            email: '',
                            organization: '',
                            title: '',
                            address: '',
                            website: ''
                          })
                        }
                      } catch {
                        newContent = JSON.stringify({
                          firstName: '',
                          lastName: '',
                          phone: '',
                          email: '',
                          organization: '',
                          title: '',
                          address: '',
                          website: ''
                        })
                      }
                    }
                    
                    setFormData({ ...formData, type: newType, content: newContent })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value="url">Website URL</option>
                  <option value="text">Plain Text</option>
                  <option value="wifi">WiFi Network</option>
                  <option value="contact">Contact Card</option>
                  {planFeatures.hasAllQRTypes && <option value="email">Email Address</option>}
                  {(currentPlan === 'pro' || currentPlan === 'business') && <option value="menu">Restaurant Menu</option>}
                </select>
                {currentPlan !== 'pro' && currentPlan !== 'business' && (
                  <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Upgrade to Pro</strong> to access the Menu Builder and create beautiful digital restaurant menus
                    </p>
                    <button
                      onClick={() => window.location.href = '/pricing'}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      View Plans →
                    </button>
                  </div>
                )}
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
                      onClick={() => handleQuickExample(example)}
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
                {/* Size Customization */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {formData.size}px
                      {!planFeatures.hasSizeCustomization && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Starter+
                        </span>
                      )}
                    </label>
                    <input
                      type="range"
                      min={QR_CODE_SIZES.MIN}
                      max={QR_CODE_SIZES.MAX}
                      step={QR_CODE_SIZES.STEP}
                      value={formData.size}
                      onChange={(e) => setFormData({
                        ...formData,
                        size: parseInt(e.target.value)
                      })}
                      disabled={!planFeatures.hasSizeCustomization}
                      className={`w-full ${!planFeatures.hasSizeCustomization ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {!planFeatures.hasSizeCustomization && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Upgrade to Starter</strong> to customize QR code size ({QR_CODE_SIZES.MIN}px - {QR_CODE_SIZES.MAX}px)
                        </p>
                        <button
                          onClick={() => window.location.href = '/pricing'}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Plans →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Customization */}
                {planFeatures.hasColorCustomization ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          QR Code Color
                        </label>
                        <input
                          type="color"
                          value={formData.color.dark}
                          onChange={(e) => setFormData({
                            ...formData,
                            color: { ...formData.color, dark: e.target.value }
                          })}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={formData.color.light}
                          onChange={(e) => setFormData({
                            ...formData,
                            color: { ...formData.color, light: e.target.value }
                          })}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Color Customization</h4>
                        <p className="text-sm text-gray-600">Customize QR code and background colors</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Starter+
                      </span>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Upgrade to Starter</strong> to customize QR code colors and create branded QR codes
                      </p>
                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Plans →
                      </button>
                    </div>
                  </div>
                )}

                {/* Advanced Customization */}
                {planFeatures.hasProFeatures ? (
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">QR Code Styling</h4>
                        {!planFeatures.hasProFeatures && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Pro
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {/* Dot Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dot Style
                          </label>
                          <select
                            value={formData.styling.dotsType || 'rounded'}
                            onChange={(e) => setFormData({
                              ...formData,
                              styling: {
                                ...formData.styling,
                                dotsType: e.target.value as any
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Object.entries(QR_DOT_TYPES).map(([key, value]) => (
                              <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Corner Square Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Corner Square Style
                          </label>
                          <select
                            value={formData.styling.cornersSquareType || 'extra-rounded'}
                            onChange={(e) => setFormData({
                              ...formData,
                              styling: {
                                ...formData.styling,
                                cornersSquareType: e.target.value as any
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Object.entries(QR_CORNER_SQUARE_TYPES).map(([key, value]) => (
                              <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Corner Dot Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Corner Dot Style
                          </label>
                          <select
                            value={formData.styling.cornersDotType || 'dot'}
                            onChange={(e) => setFormData({
                              ...formData,
                              styling: {
                                ...formData.styling,
                                cornersDotType: e.target.value as any
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Object.entries(QR_CORNER_DOT_TYPES).map(([key, value]) => (
                              <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Background Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Style
                          </label>
                          <select
                            value={formData.styling.backgroundType || 'solid'}
                            onChange={(e) => setFormData({
                              ...formData,
                              styling: {
                                ...formData.styling,
                                backgroundType: e.target.value as any,
                                // Reset gradient settings when changing type
                                gradientColorStops: e.target.value === 'solid' ? undefined : 
                                  formData.styling.gradientColorStops || [
                                    { offset: 0, color: formData.color.light },
                                    { offset: 1, color: '#F3F4F6' }
                                  ]
                              }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Object.entries(QR_BACKGROUND_TYPES).map(([key, value]) => (
                              <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase().replace('-', ' ').replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Gradient Settings */}
                        {(formData.styling.backgroundType === 'linear-gradient' || formData.styling.backgroundType === 'radial-gradient') && (
                          <div className="space-y-3 border-t pt-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gradient Direction (degrees)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={formData.styling.gradientDirection || 0}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  styling: {
                                    ...formData.styling,
                                    gradientDirection: parseInt(e.target.value)
                                  }
                                })}
                                className="w-full"
                              />
                              <div className="text-xs text-gray-500 text-center mt-1">
                                {formData.styling.gradientDirection || 0}°
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gradient Colors
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Start Color</label>
                                  <input
                                    type="color"
                                    value={formData.styling.gradientColorStops?.[0]?.color || formData.color.light}
                                    onChange={(e) => {
                                      const stops = formData.styling.gradientColorStops || [
                                        { offset: 0, color: formData.color.light },
                                        { offset: 1, color: '#F3F4F6' }
                                      ]
                                      stops[0].color = e.target.value
                                      setFormData({
                                        ...formData,
                                        styling: {
                                          ...formData.styling,
                                          gradientColorStops: [...stops]
                                        }
                                      })
                                    }}
                                    className="w-full h-8 border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">End Color</label>
                                  <input
                                    type="color"
                                    value={formData.styling.gradientColorStops?.[1]?.color || '#F3F4F6'}
                                    onChange={(e) => {
                                      const stops = formData.styling.gradientColorStops || [
                                        { offset: 0, color: formData.color.light },
                                        { offset: 1, color: '#F3F4F6' }
                                      ]
                                      stops[1].color = e.target.value
                                      setFormData({
                                        ...formData,
                                        styling: {
                                          ...formData.styling,
                                          gradientColorStops: [...stops]
                                        }
                                      })
                                    }}
                                    className="w-full h-8 border border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Logo Embedding</h4>
                        {!planFeatures.hasProFeatures && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Pro
                          </span>
                        )}
                      </div>
                      
                      {!formData.logo.enabled ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-600">Upload Logo</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden">
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{logoFile?.name}</p>
                            <p className="text-xs text-gray-500">
                              {(logoFile?.size && (logoFile.size / 1024).toFixed(1))} KB
                            </p>
                          </div>
                          <button
                            onClick={removeLogo}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Advanced QR Code Styling & Logo Embedding</h4>
                      {!planFeatures.hasProFeatures && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Professional QR code styling with custom dot patterns, corner designs, gradient backgrounds, and logo embedding
                    </p>
                    
                    {/* Preview of styling options */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 bg-white border border-gray-200 rounded-lg opacity-60">
                        <div className="text-xs font-medium text-gray-700 mb-1">Dot Styles</div>
                        <div className="text-xs text-gray-500">Square, Rounded, Classy, etc.</div>
                      </div>
                      <div className="p-2 bg-white border border-gray-200 rounded-lg opacity-60">
                        <div className="text-xs font-medium text-gray-700 mb-1">Corner Styles</div>
                        <div className="text-xs text-gray-500">Custom corner square & dots</div>
                      </div>
                      <div className="p-2 bg-white border border-gray-200 rounded-lg opacity-60">
                        <div className="text-xs font-medium text-gray-700 mb-1">Gradient Backgrounds</div>
                        <div className="text-xs text-gray-500">Linear & radial gradients</div>
                      </div>
                      <div className="p-2 bg-white border border-gray-200 rounded-lg opacity-60">
                        <div className="text-xs font-medium text-gray-700 mb-1">Logo Embedding</div>
                        <div className="text-xs text-gray-500">Professional logo integration</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.location.href = '/pricing'}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Upgrade to Pro →
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic QR Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDynamic"
                  checked={formData.isDynamic}
                  onChange={(e) => setFormData({ ...formData, isDynamic: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isDynamic" className="ml-2 text-sm text-gray-700">
                  Enable analytics tracking (Dynamic QR Code)
                </label>
              </div>
            </div>

            {/* QR Code Preview */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Preview & Download</h3>
              
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

                {formData.isDynamic && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Analytics Enabled</h4>
                    <p className="text-sm text-blue-700">
                      This QR code will track scans and provide detailed analytics including location, device type, and timing data.
                    </p>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {planFeatures.hasProFeatures ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">Download Formats</h4>
                      <div className="flex space-x-3 justify-center">
                        <button
                          onClick={() => handleDownload('png')}
                          disabled={!qrImage}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>PNG</span>
                        </button>
                        <button
                          onClick={() => handleDownload('svg')}
                          disabled={!qrImage}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>SVG</span>
                        </button>
                        <button
                          onClick={() => handleDownload('pdf')}
                          disabled={!qrImage}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => handleDownload('png')}
                        disabled={!qrImage}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download PNG</span>
                      </button>
                      <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          {planFeatures.hasProFeatures ? 'SVG & PDF downloads available' : 'Get SVG & PDF downloads with Pro'}
                        </p>
                        {!planFeatures.hasProFeatures && (
                          <button
                            onClick={() => window.location.href = '/pricing'}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Upgrade to Pro →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleCopy}
                    disabled={!qrImage}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.content || isSaving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSaving ? 'Saving...' : (qrCode ? 'Update' : 'Save') + ' QR Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
