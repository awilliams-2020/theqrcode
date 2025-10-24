'use client'

import { useState, useEffect } from 'react'
import { X, Share2, Mail, MessageSquare, Link, Download, Copy, Check, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { QRCode, QRShareOptions, ShareTemplate, QRCodeType } from '@/types'
import { useToast } from '@/hooks/useToast'

interface QRShareModalProps {
  qrCode: QRCode
  qrCodeImage: string
  onClose: () => void
}

const SHARE_TEMPLATES: ShareTemplate[] = [
  // Business templates
  {
    id: 'business-general',
    name: 'Check this out!',
    message: "Check this out! Scan the QR code to see more.",
    category: 'business'
  },
  {
    id: 'business-menu',
    name: 'View our menu',
    message: "Hungry? Check out our latest menu updates! 📱",
    category: 'business'
  },
  {
    id: 'business-contact',
    name: 'Let\'s connect',
    message: "Let's stay in touch! Add me to your contacts.",
    category: 'business'
  },
  {
    id: 'url-visit',
    name: 'Visit our website',
    message: "Check out our website! Scan to visit us online.",
    category: 'business'
  },
  {
    id: 'url-learn',
    name: 'Learn more',
    message: "Want to know more? Scan this QR code!",
    category: 'business'
  },
  
  // WiFi templates
  {
    id: 'wifi-welcome',
    name: 'Welcome to our WiFi',
    message: "Welcome! Connect to our free WiFi network.",
    category: 'wifi'
  },
  {
    id: 'wifi-guest',
    name: 'Guest network access',
    message: "Connect to our guest network - just scan and connect!",
    category: 'wifi'
  },
  {
    id: 'wifi-simple',
    name: 'Free WiFi',
    message: "Scan to connect to our WiFi!",
    category: 'wifi'
  },
  
  // Contact templates
  {
    id: 'contact-connect',
    name: 'Let\'s stay connected',
    message: "Let's stay in touch! Save my contact info.",
    category: 'contact'
  },
  {
    id: 'contact-business',
    name: 'Business card',
    message: "Here's my contact information. Let's connect!",
    category: 'contact'
  },
  {
    id: 'contact-simple',
    name: 'Add me to contacts',
    message: "Scan to save my contact details!",
    category: 'contact'
  },
  
  // Event templates
  {
    id: 'event-rsvp',
    name: 'RSVP to our event',
    message: "Join us! Please RSVP to our upcoming event.",
    category: 'event'
  },
  {
    id: 'event-details',
    name: 'Event details',
    message: "Get all the details about our event by scanning this QR code!",
    category: 'event'
  },
  
  // Email templates
  {
    id: 'email-contact',
    name: 'Send me an email',
    message: "Have a question? Send me an email!",
    category: 'email'
  },
  {
    id: 'email-simple',
    name: 'Get in touch',
    message: "Want to get in touch? Scan to email me!",
    category: 'email'
  },
  
  // Text templates
  {
    id: 'text-info',
    name: 'Important info',
    message: "Important information! Scan to read more.",
    category: 'text'
  },
  {
    id: 'text-simple',
    name: 'Read this',
    message: "Read this message by scanning the QR code.",
    category: 'text'
  },
  
  // General templates
  {
    id: 'general-scan',
    name: 'Scan to see more',
    message: "Scan this QR code to discover more!",
    category: 'general'
  },
  {
    id: 'general-something',
    name: 'Something for you',
    message: "I have something special for you. Scan to see!",
    category: 'general'
  }
]

const getTemplatesForQRType = (type: QRCodeType): ShareTemplate[] => {
  switch (type) {
    case 'wifi':
      return SHARE_TEMPLATES.filter(t => t.category === 'wifi')
    case 'contact':
      return SHARE_TEMPLATES.filter(t => t.category === 'contact')
    case 'url':
    case 'menu':
      return SHARE_TEMPLATES.filter(t => t.category === 'business')
    case 'email':
      return SHARE_TEMPLATES.filter(t => t.category === 'email')
    case 'text':
      return SHARE_TEMPLATES.filter(t => t.category === 'text')
    default:
      return SHARE_TEMPLATES.filter(t => t.category === 'general')
  }
}

export default function QRShareModal({ qrCode, qrCodeImage, onClose }: QRShareModalProps) {
  const [message, setMessage] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<QRShareOptions['shareMethod']>('link')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [copied, setCopied] = useState(false)
  const { showSuccess, showError } = useToast()

  const templates = getTemplatesForQRType(qrCode.type as QRCodeType)
  const displayUrl = qrCode.isDynamic && qrCode.shortUrl 
    ? qrCode.shortUrl.replace('/r/', '/display/') 
    : qrCode.content

  useEffect(() => {
    // Set default message based on QR type
    const defaultTemplate = templates[0]
    if (defaultTemplate && !message) {
      setMessage(defaultTemplate.message)
    }
  }, [qrCode.type, message, templates])

  const handleTemplateSelect = (template: ShareTemplate) => {
    setMessage(template.message)
  }

  const handleSocialShare = async (platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram') => {
    const shareText = encodeURIComponent(message)
    const sharePageUrl = `${window.location.origin}/share/${qrCode.id}?msg=${encodeURIComponent(message)}`
    const shareUrl = encodeURIComponent(sharePageUrl)
    
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
        break
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        try {
          await navigator.clipboard.writeText(sharePageUrl)
          showSuccess('Link Copied', 'Link copied! You can now paste it in your Instagram story or post.')
          // Record the share action
          await recordShareAction('social')
        } catch (error) {
          showError('Copy Failed', 'Unable to copy link. Please try again.')
        }
        return
    }
    
    window.open(url, '_blank', 'width=600,height=400')
    
    // Record the share action
    await recordShareAction('social')
  }

  const handleEmailShare = async () => {
    if (!email) {
      showError('Email Required', 'Please enter an email address to share.')
      return
    }
    
    try {
      const sharePageUrl = `${window.location.origin}/share/${qrCode.id}?msg=${encodeURIComponent(message)}`
      const emailBody = encodeURIComponent(`${message}\n\nScan the QR code or visit: ${sharePageUrl}`)
      const emailSubject = encodeURIComponent(subject || `${qrCode.name} - QR Code`)
      
      const mailtoLink = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`
      window.location.href = mailtoLink
      
      showSuccess('Email Opened', 'Your email client has opened with the QR code details.')
    } catch (error) {
      showError('Email Failed', 'Unable to open email client. Please try again.')
    }
  }

  const handleSMSShare = async () => {
    try {
      const sharePageUrl = `${window.location.origin}/share/${qrCode.id}?msg=${encodeURIComponent(message)}`
      const smsBody = encodeURIComponent(`${message}\n\n${sharePageUrl}`)
      const smsLink = `sms:?body=${smsBody}`
      window.location.href = smsLink
      
      showSuccess('SMS Opened', 'Your SMS app has opened with the QR code details.')
    } catch (error) {
      showError('SMS Failed', 'Unable to open SMS app. Please try again.')
    }
  }

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/share/${qrCode.id}?msg=${encodeURIComponent(message)}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showSuccess('Link Copied', 'Share link copied to clipboard!')
    } catch (error) {
      showError('Copy Failed', 'Unable to copy link. Please try again.')
    }
  }

  const recordShareAction = async (shareMethod: string) => {
    try {
      await fetch('/api/v1/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCodeId: qrCode.id,
          message,
          shareMethod,
          email: selectedMethod === 'email' ? email : undefined,
          subject: selectedMethod === 'email' ? subject : undefined,
        }),
      })
    } catch (error) {
      console.error('Error recording share action:', error)
      // Don't show error to user as this is just analytics
    }
  }

  const handleDownload = () => {
    try {
      const link = document.createElement('a')
      link.href = qrCodeImage
      link.download = `${qrCode.name.replace(/\s+/g, '_')}_with_message.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showSuccess('Download Started', 'QR code is being downloaded.')
    } catch (error) {
      showError('Download Failed', 'Unable to download the QR code. Please try again.')
    }
  }

  const handleShare = async () => {
    if (!message.trim()) {
      showError('Message Required', 'Please enter a message to share with your QR code.')
      return
    }

    try {
      switch (selectedMethod) {
        case 'social':
          // Social sharing will be handled by individual buttons
          break
        case 'email':
          await handleEmailShare()
          await recordShareAction('email')
          break
        case 'sms':
          await handleSMSShare()
          await recordShareAction('sms')
          break
        case 'link':
          await handleCopyLink()
          await recordShareAction('link')
          break
        case 'download':
          handleDownload()
          await recordShareAction('download')
          break
      }
    } catch (error) {
      showError('Share Failed', 'Unable to share. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Share2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Share QR Code</h3>
              <p className="text-sm text-gray-600">{qrCode.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* QR Code Preview */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center">
              <img src={qrCodeImage} alt={qrCode.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">This QR code will be shared with your custom message.</p>
            </div>
          </div>

          {/* Message Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Quick Templates</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="text-left p-3 text-sm border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{template.name}</div>
                  <div className="text-gray-600 truncate">{template.message}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a custom message to share with your QR code..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {message.length}/500 characters
              </span>
            </div>
          </div>

          {/* Share Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">How would you like to share?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Social Sharing */}
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedMethod('social')}
                  className={`w-full p-3 rounded-lg border-2 transition-colors ${
                    selectedMethod === 'social' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Share2 className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Social Media</span>
                </button>
                {selectedMethod === 'social' && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleSocialShare('facebook')}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="p-2 text-blue-400 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSocialShare('linkedin')}
                      className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSocialShare('instagram')}
                      className="p-2 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors"
                      title="Share on Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <button
                onClick={() => setSelectedMethod('email')}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Email</span>
              </button>

              {/* SMS */}
              <button
                onClick={() => setSelectedMethod('sms')}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'sms' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">SMS</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => setSelectedMethod('link')}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'link' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {copied ? <Check className="h-5 w-5 mx-auto mb-1 text-green-600" /> : <Copy className="h-5 w-5 mx-auto mb-1 text-gray-600" />}
                <span className={`text-sm font-medium ${copied ? 'text-green-900' : 'text-gray-900'}`}>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              {/* Download */}
              <button
                onClick={() => setSelectedMethod('download')}
                className={`w-full p-3 rounded-lg border-2 transition-colors ${
                  selectedMethod === 'download' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Download className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Download</span>
              </button>
            </div>
          </div>

          {/* Email Configuration */}
          {selectedMethod === 'email' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject (optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={`${qrCode.name} - QR Code`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            {selectedMethod === 'social' ? (
              <div className="text-sm text-gray-600">Select a social platform above</div>
            ) : (
              <button
                onClick={handleShare}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {selectedMethod === 'link' ? 'Copy Link' : 
                 selectedMethod === 'email' ? 'Open Email' :
                 selectedMethod === 'sms' ? 'Open SMS' :
                 selectedMethod === 'download' ? 'Download' : 'Share'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
