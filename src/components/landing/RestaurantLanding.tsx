'use client'

import { Utensils, QrCode, Menu, Users, BarChart3, Clock, CheckCircle2, TrendingUp, Smartphone, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function RestaurantLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('restaurants');
  const useCases = [
    {
      icon: Menu,
      title: 'Digital Menus',
      description: 'Build beautiful menus with our Pro plan menu builder or link to your PDF. Update prices and items instantly without reprinting.'
    },
    {
      icon: Utensils,
      title: 'Menu Builder (Pro)',
      description: 'Create stunning mobile-optimized menus with categories, items, prices, and descriptions. No coding required.'
    },
    {
      icon: Users,
      title: 'Guest WiFi',
      description: 'Share WiFi credentials instantly. No more writing passwords on chalkboards or napkins.'
    },
    {
      icon: TrendingUp,
      title: 'Review Collection',
      description: 'Direct customers to your Google/Yelp reviews. Boost your online reputation effortlessly.'
    }
  ]

  const features = [
    {
      icon: RefreshCw,
      title: 'Update Anytime, No Reprinting',
      description: 'Changed your menu? Updated prices? Simply update your QR code content. Same QR code, new content.'
    },
    {
      icon: BarChart3,
      title: 'Track Customer Engagement',
      description: 'See how many customers scan your menu QR codes, what times are busiest, and which items get viewed most.'
    },
    {
      icon: Clock,
      title: 'Save Staff Time',
      description: 'Reduce interruptions for WiFi passwords, menu questions, and review requests. Let QR codes do the work.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Perfect for small screens. Customers see clean, readable menus on any phone or tablet.'
    },
    {
      icon: CheckCircle2,
      title: 'No App Downloads',
      description: 'Works with built-in camera apps on iPhones and Android. Customers just scan and go.'
    },
    {
      icon: Users,
      title: 'Better Customer Experience',
      description: 'Modern, contactless experience that customers expect in 2025. Stand out from competitors.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Build Your Digital Menu',
      description: 'Use our Pro plan menu builder to create a beautiful mobile-optimized menu, or link to your existing menu PDF or website'
    },
    {
      number: '2',
      title: 'Customize Your QR Code',
      description: 'Add your restaurant logo, choose brand colors, and select a professional frame style'
    },
    {
      number: '3',
      title: 'Download & Display',
      description: 'Print on table tents, stickers, posters, or window decals. High-resolution formats included'
    },
    {
      number: '4',
      title: 'Track & Optimize',
      description: 'Monitor scans by time, location, and device. See what works and adjust your strategy'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
                🍽️ QR Codes for Restaurants
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Stop Printing New Menus
                <span className="block text-orange-600 mt-2">Update Prices Instantly</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create dynamic QR codes for your restaurant menu, WiFi, and reviews. Update content anytime without reprinting. Pro plan includes our interactive menu builder for beautiful, mobile-friendly digital menus.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    trackCTA('Create Menu QR Code', 'hero', 'starter');
                    window.location.href = '/auth/signup?plan=starter';
                  }}
                  className="px-8 py-4 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
                >
                  Create Menu QR Code →
                </button>
                <button
                  onClick={() => {
                    trackDemo();
                    window.location.href = '/qr-code-generator';
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-400 transition-colors bg-white"
                >
                  View Demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
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
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl border-2 border-orange-200">
                <div className="text-center mb-6">
                  <Menu className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">View Our Menu</h3>
                  <p className="text-gray-600">Scan to see today's specials</p>
                </div>
                <div className="aspect-square bg-white rounded-xl flex items-center justify-center border-2 border-gray-200">
                  <QrCode className="h-48 w-48 text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Tired of These Restaurant Headaches?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">💸 Spending hundreds on menu reprints every time prices change</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⏰ Staff constantly interrupted for WiFi passwords and menu questions</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📱 Customers asking "Do you have a digital menu?"</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-orange-600 mt-12">
            One QR code solves all of this. Update anytime. Never reprint.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Restaurant
            </h2>
            <p className="text-xl text-gray-600">
              From menus to WiFi to reviews – one platform handles it all
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Restaurant Owners Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Save money, save time, and improve customer experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From menu upload to tracking analytics in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Go Digital?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 500+ restaurants using TheQRCode.io. Stop reprinting menus. Start saving money today.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Update your menu anytime – never reprint again</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Track customer engagement with analytics</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors shadow-lg"
            >
              Start Your Free Trial →
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Trusted by Restaurants Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-orange-600 mb-2">500+</div>
              <p className="text-gray-600">Restaurants Using Our QR Codes</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-orange-600 mb-2">1M+</div>
              <p className="text-gray-600">Menu Scans Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-orange-600 mb-2">$5K</div>
              <p className="text-gray-600">Average Saved on Printing Annually</p>
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
                QR code solutions for restaurants.
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
            <p>© 2025 TheQRCode.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

