'use client'

import { QrCode, Palette, Download, BarChart3, Shield, Zap, CheckCircle2, Wifi, Mail, User, FileText, Clock, Users, Award } from 'lucide-react'
import Link from 'next/link'
import PublicQRGenerator from '../PublicQRGenerator'

export default function QRGeneratorLanding() {
  const features = [
    {
      icon: QrCode,
      title: 'Multiple QR Types',
      description: 'Create QR codes for URLs, WiFi networks, contacts (vCard), email, text, and more.'
    },
    {
      icon: Palette,
      title: 'Custom Styling',
      description: 'Choose colors, add logos, select frame styles. Make your QR codes match your brand.'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Download in PNG, SVG, or PDF format. Perfect for print or digital use.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track scans with location, device, and timing data. See what\'s working.'
    },
    {
      icon: Zap,
      title: 'Instant Generation',
      description: 'Create QR codes in seconds. No waiting, no hassle, just results.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime. Your data is safe with us.'
    }
  ]

  const qrTypes = [
    { icon: QrCode, name: 'URL', description: 'Link to websites or landing pages' },
    { icon: FileText, name: 'Plain Text', description: 'Any text content or message' },
    { icon: Wifi, name: 'WiFi', description: 'Share network access instantly' },
    { icon: User, name: 'vCard', description: 'Share contact information' },
    { icon: Mail, name: 'Email', description: 'Pre-filled email messages' },
  ]

  const benefits = [
    'No credit card required to start',
    '14-day free trial on all plans',
    'Unlimited scans on paid plans',
    'Download high-resolution QR codes',
    'Real-time analytics dashboard',
    'Priority customer support',
    'API access for automation'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Generator */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              ✨ Free QR Code Generator
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Beautiful QR Codes
              <span className="block text-blue-600 mt-2">in Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Generate professional QR codes for your business. Add custom colors, logos, and track performance with advanced analytics. Start free, no credit card required.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Embedded QR Generator */}
          <PublicQRGenerator 
            title="Generate Your QR Code Now"
            description="Create and download your custom QR code for free"
            allowedTypes={['url', 'text', 'wifi', 'contact']}
          />
        </div>
      </section>

      {/* QR Types Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Create QR Codes for Anything
            </h2>
            <p className="text-xl text-gray-600">
              Support for all major QR code types and formats
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {qrTypes.map((type, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
                <type.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Professional features for businesses, marketers, and creators
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose TheQRCode.io?
              </h2>
              <p className="text-xl text-blue-100 mb-8 hidden">
                Join thousands of businesses using our platform to create, manage, and track their QR codes.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Start Your Free Trial</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <span className="text-gray-700">Sign up in 30 seconds</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <span className="text-gray-700">Create your first QR code</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <span className="text-gray-700">Track analytics in real-time</span>
                </li>
              </ul>
              <button
                onClick={() => window.location.href = '/auth/signup?plan=pro&utm_source=google&utm_medium=cpc&utm_campaign=qr-generator'}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
              >
                Get Started Free →
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Reliability Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Built for Reliability & Trust
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Your QR codes are secure with 256-bit encryption and enterprise-grade infrastructure.</p>
            </div>
            <div className="p-8">
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-gray-600">Reliable service with monitoring and automatic failover for maximum availability.</p>
            </div>
            <div className="p-8">
              <Award className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free to Start</h3>
              <p className="text-gray-600">No credit card required. Create unlimited QR codes and upgrade when you need more features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Create Your First QR Code?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/auth/signup?plan=pro&utm_source=google&utm_medium=cpc&utm_campaign=qr-generator'}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Free Trial →
            </button>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors bg-white"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6" />
                <span className="text-xl font-bold">TheQRCode.io</span>
              </div>
              <p className="text-gray-400">
                Professional QR code generation with analytics.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/qr-code-generator" className="text-gray-400 hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 TheQRCode.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

