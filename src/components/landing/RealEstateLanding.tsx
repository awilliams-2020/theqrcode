'use client'

import { Home, QrCode, MapPin, FileText, BarChart3, Clock, CheckCircle2, TrendingUp, Smartphone, DollarSign, Shield, Award } from 'lucide-react'
import Link from 'next/link'

export default function RealEstateLanding() {
  const useCases = [
    {
      icon: Home,
      title: 'Property Listings',
      description: 'Link to detailed property information, photos, virtual tours, and contact forms instantly.'
    },
    {
      icon: MapPin,
      title: 'Open House Signs',
      description: 'Add QR codes to yard signs and flyers. Track which properties get the most interest.'
    },
    {
      icon: FileText,
      title: 'Property Brochures',
      description: 'Share comprehensive property details without printing massive brochures. Save on printing costs.'
    },
    {
      icon: DollarSign,
      title: 'Lead Generation',
      description: 'Capture buyer information automatically. Know who visited which properties and when.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Property Interest',
      description: 'See which listings get the most scans, what times buyers are viewing, and where they\'re coming from.'
    },
    {
      icon: Clock,
      title: 'Update Listings Instantly',
      description: 'Price drop? Sold? Open house cancelled? Update your QR code content immediately without reprinting signs.'
    },
    {
      icon: TrendingUp,
      title: 'Qualify Leads Faster',
      description: 'Track engagement patterns. Know which buyers are serious based on how they interact with your listings.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-Optimized',
      description: 'Perfect viewing experience on all devices. Buyers see beautiful property details on their phones.'
    },
    {
      icon: CheckCircle2,
      title: 'Professional Branding',
      description: 'Add your logo and brand colors to QR codes. Stand out with professional, custom-designed codes.'
    },
    {
      icon: FileText,
      title: 'Comprehensive Analytics',
      description: 'Track scans by property, location, time of day, and device type. Optimize your marketing strategy.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Add Property Details',
      description: 'Enter property URL, upload photos, or create a landing page with all listing information'
    },
    {
      number: '2',
      title: 'Customize QR Code',
      description: 'Add your agency logo, choose brand colors, and select a professional frame style'
    },
    {
      number: '3',
      title: 'Print on Marketing Materials',
      description: 'Add to yard signs, flyers, business cards, and postcards. High-resolution downloads included'
    },
    {
      number: '4',
      title: 'Track & Convert Leads',
      description: 'Monitor buyer engagement, identify hot leads, and follow up at the perfect time'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                🏡 QR Codes for Real Estate
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Turn Yard Signs Into
                <span className="block text-blue-600 mt-2">Lead Generation Machines</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for property listings, open houses, and brochures. Track buyer interest with analytics. Update details instantly without reprinting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Create Property QR Code →
                </button>
                <button
                  onClick={() => window.location.href = '/qr-code-generator'}
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border-2 border-blue-200">
                <div className="text-center mb-6">
                  <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">View Property Details</h3>
                  <p className="text-gray-600">Scan for photos, tour & info</p>
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
            Frustrated with Traditional Real Estate Marketing?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">💸 Spending hundreds on flyers that go straight to the trash</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📍 No way to track which properties generate the most interest</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">🔄 Reprinting signs every time there's a price drop or open house</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-blue-600 mt-12">
            QR codes solve all of this. Track every interaction. Update instantly.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Real Estate Marketing
            </h2>
            <p className="text-xl text-gray-600">
              From listings to open houses to lead capture – one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-blue-600 mb-4" />
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
              Why Top Agents Use Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Close more deals with data-driven insights and professional marketing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
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
              From property listing to lead tracking in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Generate More Leads?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 200+ real estate agents using TheQRCode.io to track property interest and convert more buyers.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Track which properties get the most interest</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Update listing details without reprinting signs</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
            >
              Start Your Free Trial →
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Built for Real Estate Professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <Shield className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Every Lead</h3>
              <p className="text-gray-600">Monitor which properties generate the most interest and optimize your marketing strategy with real-time analytics.</p>
            </div>
            <div className="p-8">
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Update Instantly</h3>
              <p className="text-gray-600">Price changes, sold properties, or cancelled open houses? Update your QR codes without reprinting signs.</p>
            </div>
            <div className="p-8">
              <Award className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free to Start</h3>
              <p className="text-gray-600">Create your first QR code at no cost. Upgrade only when you need advanced analytics and bulk creation features.</p>
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
                QR code solutions for real estate.
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

