'use client'

import { QrCode, BarChart3, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'
import PublicQRGenerator from './PublicQRGenerator'

export default function LandingPage() {
  const { trackCTA } = useLandingPageTracking('home');
  const features = [
    {
      icon: QrCode,
      title: 'Create Beautiful QR Codes',
      description: 'Generate QR codes for URLs, WiFi, contacts, and more with custom styling options.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track scans with detailed insights including location, device, and timing data.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate QR codes instantly and track scans in real-time with our optimized platform.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and 99.9% uptime guarantee.'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out QR codes',
      features: ['10 QR codes', '1,000 scans per month', 'Basic analytics', 'URL, Text, WiFi, Contact types', 'Basic customization'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Starter',
      price: '$9',
      period: 'per month',
      description: 'Great for small businesses',
      features: ['100 QR codes', '10,000 scans per month', 'Advanced analytics', 'All QR code types', 'Custom styling', 'Email support'],
      cta: 'Subscribe',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Best for growing companies',
      features: ['500 QR codes', '500,000 scans per month', 'Real-time analytics', 'All QR code types', 'Advanced customization', 'Priority support', 'API access'],
      cta: 'Subscribe',
      popular: true
    },
    {
      name: 'Business',
      price: '$99',
      period: 'per month',
      description: 'For large enterprises',
      features: ['Unlimited QR codes', 'Unlimited scans', 'Enterprise analytics', 'All QR code types', 'White label options', '24/7 support', 'Full API access', 'Custom integrations'],
      cta: 'Subscribe',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Generator */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create QR Codes
              <span className="block text-blue-600">No Signup Required</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Generate professional QR codes instantly. Track performance with analytics. 
              Perfect for restaurants, businesses, and events. Start free forever.
            </p>
          </div>

          {/* Embedded QR Generator */}
          <PublicQRGenerator 
            allowedTypes={['url', 'text', 'wifi', 'contact']}
          />

          {/* Trust Badges */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">Start creating QR codes in seconds</p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-700">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">100%</span> Free to Start
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Instant</span> Generation
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">No Credit Card</span> Required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for QR Code Marketing
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to create, customize, and analyze your QR codes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.filter(p => p.name !== 'Business').map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-blue-500 lg:scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 font-semibold flex items-center justify-center gap-2">
                    <Zap size={16} />
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6 h-12">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.price !== '$0' && (
                      <span className="text-gray-600 ml-2">/{plan.period.replace('per ', '')}</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const planId = plan.name.toLowerCase()
                      trackCTA(plan.cta, 'pricing', planId)
                      // Small delay to ensure tracking completes before navigation
                      setTimeout(() => {
                        window.location.href = `/auth/signup?plan=${planId}`
                      }, 150);
                    }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <svg className="text-green-500 flex-shrink-0 mt-0.5" width={20} height={20} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6" />
                <span className="text-xl font-bold">TheQRCode.io</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional QR code generation and analytics platform for businesses of all sizes.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/qr-code-generator" className="text-gray-400 hover:text-white transition-colors">
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-gray-400 hover:text-white transition-colors">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support & Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                    Help
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 TheQRCode.io. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
