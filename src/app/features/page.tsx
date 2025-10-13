import { Metadata } from 'next'
import Link from 'next/link'
import { QrCode, BarChart3, Zap, Shield, Palette, Download, Users, Globe, Smartphone, Wifi, Mail, User, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features - QR Code Generator with Advanced Analytics',
  description: 'Discover all the powerful features of TheQRCode.io including QR code generation, analytics, customization, API access, and more.',
  keywords: ['QR code features', 'QR code analytics', 'QR code customization', 'QR code API', 'QR code tracking'],
  openGraph: {
    title: 'Features - QR Code Generator with Advanced Analytics',
    description: 'Discover all the powerful features of TheQRCode.io including QR code generation, analytics, customization, and API access.',
    type: 'website',
  },
}

const features = [
  {
    icon: QrCode,
    title: 'Multiple QR Code Types',
    description: 'Generate QR codes for URLs, WiFi networks, contact cards, text, and email addresses.',
    details: ['URL QR codes', 'WiFi QR codes', 'Contact (vCard) QR codes', 'Text QR codes', 'Email QR codes'],
    available: 'All Plans'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Tracking',
    description: 'Track QR code scans with detailed insights including device type, location, and timing data.',
    details: ['Real-time scan tracking', 'Device analytics', 'Geographic data', 'Time-based reports', 'Scan history'],
    available: 'Free+'
  },
  {
    icon: Palette,
    title: 'Custom Styling',
    description: 'Customize QR codes with colors, frames, and branding for consistent visual identity.',
    details: ['Custom colors', 'Frame styles', 'Size options', 'Download formats', 'Brand consistency'],
    available: 'Starter+'
  },
  {
    icon: Zap,
    title: 'Dynamic QR Codes',
    description: 'Create dynamic QR codes that can be updated after creation without changing the physical code.',
    details: ['Update content remotely', 'Track individual codes', 'Short URL generation', 'Real-time updates', 'Flexible content'],
    available: 'All Plans'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with data protection and reliable infrastructure.',
    details: ['Data encryption', 'Secure storage', 'Reliable infrastructure', 'Privacy protection', 'Secure API'],
    available: 'All Plans'
  },
  {
    icon: Download,
    title: 'Download Options',
    description: 'Download QR codes in multiple formats for various use cases and applications.',
    details: ['PNG format', 'High resolution', 'Print-ready', 'Multiple sizes', 'Format options'],
    available: 'All Plans'
  },
  {
    icon: Globe,
    title: 'Global Analytics',
    description: 'Track QR code performance with comprehensive analytics and reporting capabilities.',
    details: ['Scan analytics', 'Performance metrics', 'Usage reports', 'Export data', 'Detailed insights'],
    available: 'Starter+'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'QR codes optimized for mobile scanning with perfect readability on all devices.',
    details: ['Mobile-first design', 'Cross-platform compatibility', 'Touch-friendly', 'Responsive', 'Mobile scanning'],
    available: 'All Plans'
  },
  {
    icon: Users,
    title: 'API Access',
    description: 'Full API access for developers to integrate QR code generation into applications.',
    details: ['RESTful API', 'Developer tools', 'API documentation', 'Webhook support', 'Integration ready'],
    available: 'Pro'
  },
  {
    icon: Settings,
    title: 'Bulk Operations',
    description: 'Create and manage multiple QR codes at once with bulk generation and management tools.',
    details: ['Bulk creation', 'Batch processing', 'CSV import/export', 'Mass updates', 'Efficient workflows'],
    available: 'Pro'
  }
]

const qrTypes = [
  {
    icon: Globe,
    title: 'URL QR Codes',
    description: 'Create QR codes that link to websites, landing pages, or online content.',
    useCases: ['Website promotion', 'Landing pages', 'Product pages', 'Social media profiles'],
    available: 'All Plans'
  },
  {
    icon: Wifi,
    title: 'WiFi QR Codes',
    description: 'Generate QR codes that automatically connect devices to WiFi networks.',
    useCases: ['Guest WiFi access', 'Office networks', 'Public hotspots', 'Event WiFi'],
    available: 'All Plans'
  },
  {
    icon: User,
    title: 'Contact QR Codes',
    description: 'Create vCard QR codes for easy contact information sharing.',
    useCases: ['Business cards', 'Networking events', 'Contact sharing', 'Lead generation'],
    available: 'All Plans'
  },
  {
    icon: Mail,
    title: 'Email QR Codes',
    description: 'Generate QR codes that open email clients with pre-filled information.',
    useCases: ['Contact forms', 'Newsletter signups', 'Support requests', 'Feedback collection'],
    available: 'Starter+'
  },
  {
    icon: Smartphone,
    title: 'Text QR Codes',
    description: 'Generate QR codes that display plain text when scanned.',
    useCases: ['Instructions', 'Messages', 'Notes', 'Information sharing'],
    available: 'All Plans'
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Every Need
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic QR code generation to advanced analytics and team collaboration, 
              TheQRCode.io provides everything you need for successful QR code campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* QR Code Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              QR Code Types
            </h2>
            <p className="text-xl text-gray-600">
              Generate different types of QR codes for various use cases
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {qrTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <type.icon className="h-12 w-12 text-blue-600" />
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    {type.available}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {type.description}
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Use Cases:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {type.useCases.map((useCase, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create, customize, and track QR codes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <feature.icon className="h-10 w-10 text-blue-600 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="text-sm text-blue-600 font-medium">
                      {feature.available}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              API & Integration Features
            </h2>
            <p className="text-xl text-gray-600">
              Powerful APIs for developers and enterprise integrations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                RESTful API
              </h3>
              <p className="text-gray-700 mb-6">
                Complete API access for QR code generation, management, and analytics. 
                Perfect for integrating QR codes into your applications.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Generate QR codes programmatically</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Manage QR codes with CRUD operations</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Access comprehensive analytics data</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">API key management and authentication</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Bulk QR code operations</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Business Features
              </h3>
              <p className="text-gray-700 mb-6">
                Advanced features for business customers with higher volume needs 
                and integration requirements.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Webhook support for real-time notifications</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">White-label options and custom branding</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Custom integrations and support</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 font-medium">Priority support and dedicated assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and discover how powerful QR code generation can be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?plan=pro"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
