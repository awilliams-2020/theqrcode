'use client'

import { Wifi, QrCode, Store, Hotel, Coffee, Building2, Shield, Zap, CheckCircle2, Users, BarChart3, Smartphone } from 'lucide-react'
import Link from 'next/link'
import PublicQRGenerator from '../PublicQRGenerator'

export default function WiFiQRLanding() {
  const useCases = [
    {
      icon: Store,
      title: 'Restaurants & Cafes',
      description: 'Let customers connect instantly while waiting for their order. Print on table cards or menus.'
    },
    {
      icon: Hotel,
      title: 'Hotels & Resorts',
      description: 'Place WiFi QR codes in rooms, lobbies, and common areas. Improve guest experience.'
    },
    {
      icon: Coffee,
      title: 'Coffee Shops',
      description: 'Display WiFi QR codes at checkout and on walls. Reduce questions from staff.'
    },
    {
      icon: Building2,
      title: 'Offices & Coworking',
      description: 'Share guest WiFi securely without revealing passwords. Perfect for visitors.'
    }
  ]

  const features = [
    {
      icon: Wifi,
      title: 'Instant Connection',
      description: 'Guests scan once and connect automatically. No typing passwords or searching for networks.'
    },
    {
      icon: Shield,
      title: 'Secure Sharing',
      description: 'Share WiFi access without exposing passwords on signs. Update anytime you need.'
    },
    {
      icon: BarChart3,
      title: 'Track Connections',
      description: 'See how many people connect, when, and from where. Optimize your guest WiFi.'
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Compatible with all smartphones. iOS, Android, and other devices connect instantly.'
    },
    {
      icon: Users,
      title: 'Better Guest Experience',
      description: 'Reduce staff interruptions and improve customer satisfaction with easy WiFi access.'
    },
    {
      icon: Zap,
      title: 'Update Anytime',
      description: 'Changed your WiFi password? Update your QR code without reprinting. Dynamic codes included.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Enter WiFi Details',
      description: 'Provide your network name (SSID), password, and security type (WPA, WEP, etc.)'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your logo, choose colors, and select a frame style to match your brand'
    },
    {
      number: '3',
      title: 'Download & Print',
      description: 'Download in high resolution PNG, SVG, or PDF. Print on cards, stickers, or posters'
    },
    {
      number: '4',
      title: 'Track Analytics',
      description: 'Monitor connections in real-time with our analytics dashboard'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Hero Section with WiFi Generator */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
              📶 WiFi QR Code Generator
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Your WiFi
              <span className="block text-purple-600 mt-2">with a Simple Scan</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Create WiFi QR codes for restaurants, hotels, offices, and events. Let guests connect instantly without typing passwords. Track connections with analytics.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>No app required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Works on all phones</span>
              </div>
            </div>
          </div>

          {/* Embedded WiFi QR Generator */}
          <PublicQRGenerator 
            defaultType="wifi"
            title="Generate Your WiFi QR Code"
            description="Create a WiFi QR code for instant network access"
            allowedTypes={['wifi', 'text']}
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Any Business
            </h2>
            <p className="text-xl text-gray-600">
              Make WiFi access effortless for your guests and customers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
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
              Why Use WiFi QR Codes?
            </h2>
            <p className="text-xl text-gray-600">
              Save time, improve experience, and track usage
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your WiFi QR Code in 4 Easy Steps
            </h2>
            <p className="text-xl text-gray-600">
              From setup to analytics in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-purple-300">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Simplify WiFi Access?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create your first WiFi QR code in 30 seconds. Start free, no credit card required.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter&utm_source=google&utm_medium=cpc&utm_campaign=wifi-qr'}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg"
            >
              Create WiFi QR Code Now →
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Trusted by Hospitality Businesses Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-purple-600 mb-2">5K+</div>
              <p className="text-gray-600">Businesses Using WiFi QR Codes</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-purple-600 mb-2">500K+</div>
              <p className="text-gray-600">Guest Connections Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
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
                Professional WiFi QR code generator.
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

