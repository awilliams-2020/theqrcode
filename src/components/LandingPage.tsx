'use client'

import { signIn } from 'next-auth/react'
import { QrCode, BarChart3, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
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
      features: ['500 QR codes', '50,000 scans per month', 'Real-time analytics', 'All QR code types', 'Advanced customization', 'Priority support', 'API access'],
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
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create & Track QR Codes
            <span className="block text-blue-600">with Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate beautiful QR codes and track their performance with detailed analytics. 
            Perfect for businesses, marketers, and developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/auth/signup'}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => window.location.href = '/demo'}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors"
            >
              View Demo
            </button>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
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
                      window.location.href = `/auth/signup?plan=${planId}`
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
      <footer className="px-4 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="h-6 w-6" />
            <span className="text-xl font-bold">The QR Code</span>
          </div>
          <p className="text-gray-400">
            © 2024 The QR Code. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
