import type { Metadata } from 'next'
import { QrCode, CheckCircle, ArrowRight, Download, Palette, BarChart3, Wifi, Mail, User, FileText } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Create a QR Code - Step by Step Guide | TheQRCode.io',
  description: 'Learn how to create QR codes in 3 simple steps. Complete tutorial with examples for URLs, WiFi, contacts, and text. Start creating QR codes today!',
  keywords: ['how to create qr code', 'qr code tutorial', 'qr code guide', 'create qr code step by step', 'qr code instructions'],
}

export default function HowToCreateQRCodePage() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your QR Code Type',
      description: 'Select the type of content you want to encode in your QR code.',
      icon: QrCode,
      details: [
        'URL QR Code - Link to websites or landing pages',
        'Text QR Code - Any plain text message',
        'WiFi QR Code - Share network access credentials',
        'Contact QR Code - Share contact information (vCard)'
      ],
      examples: [
        { type: 'URL', example: 'https://theqrcode.io' },
        { type: 'Text', example: 'Welcome to our store!' },
        { type: 'WiFi', example: 'Network: MyWiFi, Password: secret123' },
        { type: 'Contact', example: 'John Doe, john@example.com, +1234567890' }
      ]
    },
    {
      number: 2,
      title: 'Enter Your Content',
      description: 'Input the information you want to encode in your QR code.',
      icon: FileText,
      details: [
        'For URLs: Enter the complete website address',
        'For Text: Type your message or information',
        'For WiFi: Enter network name and password',
        'For Contact: Fill in name, phone, email, and other details'
      ],
      tips: [
        'Make sure URLs include https:// for security',
        'Keep text messages concise for better scanning',
        'Double-check WiFi credentials before generating',
        'Include all important contact information'
      ]
    },
    {
      number: 3,
      title: 'Customize & Generate',
      description: 'Customize the appearance and generate your QR code.',
      icon: Palette,
      details: [
        'Choose colors that match your brand',
        'Add your logo to the center (Pro feature)',
        'Select frame styles and corner designs',
        'Choose the size for your use case'
      ],
      tips: [
        'Use high contrast colors for better scanning',
        'Test your QR code before printing',
        'Consider the scanning distance when choosing size',
        'Save in high resolution for print materials'
      ]
    },
    {
      number: 4,
      title: 'Download & Use',
      description: 'Download your QR code and start using it.',
      icon: Download,
      details: [
        'Download in PNG format for digital use',
        'Use SVG for scalable graphics',
        'Export as PDF for print materials',
        'Share directly via email or social media'
      ],
      tips: [
        'Test your QR code with multiple devices',
        'Place QR codes where they\'re easily accessible',
        'Include instructions for users on how to scan',
        'Monitor performance with analytics (Pro feature)'
      ]
    }
  ]

  const qrTypes = [
    {
      icon: QrCode,
      name: 'URL QR Codes',
      description: 'Perfect for linking to websites, landing pages, or online content',
      useCases: ['Restaurant menus', 'Product pages', 'Social media profiles', 'Event registration']
    },
    {
      icon: Wifi,
      name: 'WiFi QR Codes',
      description: 'Let customers connect to your WiFi network instantly',
      useCases: ['Restaurants', 'Hotels', 'Coffee shops', 'Offices']
    },
    {
      icon: User,
      name: 'Contact QR Codes',
      description: 'Share contact information easily with vCard format',
      useCases: ['Business cards', 'Networking events', 'Real estate', 'Professional services']
    },
    {
      icon: FileText,
      name: 'Text QR Codes',
      description: 'Display any text message when scanned',
      useCases: ['Instructions', 'Promotional messages', 'Emergency info', 'Access codes']
    }
  ]

  const bestPractices = [
    {
      title: 'Size & Placement',
      description: 'Make your QR code large enough to scan easily',
      tips: [
        'Minimum 2x2 inches (5x5 cm) for print',
        'Place at eye level when possible',
        'Ensure good lighting for scanning',
        'Leave white space around the QR code'
      ]
    },
    {
      title: 'Color & Contrast',
      description: 'Use high contrast colors for better scanning',
      tips: [
        'Dark QR code on light background works best',
        'Avoid red and green color combinations',
        'Test with different lighting conditions',
        'Consider colorblind accessibility'
      ]
    },
    {
      title: 'Testing & Quality',
      description: 'Always test your QR codes before using them',
      tips: [
        'Test with multiple devices and apps',
        'Try scanning from different distances',
        'Check in various lighting conditions',
        'Verify the content is correct'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Create a QR Code
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to create professional QR codes in just 4 simple steps. 
            Perfect for businesses, events, and personal use.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Step-by-Step Tutorial
          </h2>
          <div className="space-y-12">
            {steps?.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <step.icon className="w-8 h-8 text-blue-600" />
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">What to do:</h4>
                        <ul className="space-y-2">
                          {step.details?.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
                        <ul className="space-y-2">
                          {step.tips?.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {step.examples && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Examples:</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {step.examples?.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="bg-white p-3 rounded border">
                              <div className="font-medium text-blue-600 text-sm">{example.type}</div>
                              <div className="text-gray-700 text-sm">{example.example}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Types */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of QR Codes You Can Create
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qrTypes?.map((type, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <type.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Use Cases:</h4>
                  <ul className="space-y-1">
                    {type.useCases?.map((useCase, useCaseIndex) => (
                      <li key={useCaseIndex} className="text-sm text-gray-600">• {useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Practices for QR Codes
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {bestPractices?.map((practice, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{practice.title}</h3>
                <p className="text-gray-600 mb-4">{practice.description}</p>
                <ul className="space-y-2">
                  {practice.tips?.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your QR Code?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Follow our tutorial and create your first QR code in minutes. No signup required!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/qr-code-generator" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Create QR Code Now
            </Link>
            <Link 
              href="/help" 
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors text-lg"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Get More Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
