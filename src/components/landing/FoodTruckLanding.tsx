'use client'

import { Truck, QrCode, MapPin, Menu, BarChart3, Star, CheckCircle2, Calendar, Smartphone, Users } from 'lucide-react'
import Link from 'next/link'

export default function FoodTruckLanding() {
  const useCases = [
    {
      icon: Menu,
      title: 'Digital Menus',
      description: 'Update your menu and prices instantly. No more reprinting menu boards for daily specials.'
    },
    {
      icon: MapPin,
      title: 'Location Sharing',
      description: 'Share your current location and weekly schedule. Customers find you wherever you park.'
    },
    {
      icon: Star,
      title: 'Review Collection',
      description: 'Direct customers to your Google reviews while the experience is fresh. Build your reputation.'
    },
    {
      icon: Users,
      title: 'Social Media Growth',
      description: 'Connect customers to Instagram, Facebook, and TikTok. Build your following on wheels.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Customer Engagement',
      description: 'See which locations get the most menu scans, what times are busiest, and which items interest customers.'
    },
    {
      icon: Calendar,
      title: 'Update Schedule Instantly',
      description: 'Changed your location? Update your QR code in seconds. No reprinting needed.'
    },
    {
      icon: Smartphone,
      title: 'Perfect for the Truck Life',
      description: 'Display QR codes on your truck, menu boards, and packaging. Customers scan while waiting.'
    },
    {
      icon: Users,
      title: 'Build Loyal Followers',
      description: 'Create a community that tracks your location. They\'ll follow you anywhere.'
    },
    {
      icon: CheckCircle2,
      title: 'No Tech Skills Needed',
      description: 'Update content from your phone between orders. Simple dashboard, powerful results.'
    },
    {
      icon: Star,
      title: 'Stand Out',
      description: 'Modern, professional QR codes with your branding. Look more established than competitors.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Choose Your Content',
      description: 'Menu, location schedule, social media, or review links – or all of them'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your food truck logo and colors. Choose frames that match your brand vibe'
    },
    {
      number: '3',
      title: 'Display on Truck',
      description: 'Print on your truck, menu boards, packaging, and business cards'
    },
    {
      number: '4',
      title: 'Update on the Go',
      description: 'Change location, menu, or promotions from your phone in real-time'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-6">
                🚚 QR Codes for Food Trucks
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Update Your Menu
                <span className="block text-amber-600 mt-2">From Anywhere</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for your menu, location, reviews, and social media. Update everything from your phone. Perfect for mobile food vendors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-amber-600 text-white text-lg font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
                >
                  Create Food Truck QR Code →
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
                  <span>Update from your phone</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-xl border-2 border-yellow-200">
                <div className="text-center mb-6">
                  <Truck className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Taco Truck Express</h3>
                  <p className="text-gray-600">Scan for menu & location</p>
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
            Tired of These Food Truck Headaches?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">💸 Reprinting menu boards every time prices change</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📍 Customers constantly asking "Where will you be tomorrow?"</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⭐ Missing out on reviews because it's not convenient</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-amber-600 mt-12">
            One QR code solves everything. Scan. See menu. Find location. Leave review.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Food Truck
            </h2>
            <p className="text-xl text-gray-600">
              From menus to locations to reviews – all in your pocket
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-amber-600 mb-4" />
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
              Why Food Truck Owners Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Mobile business needs mobile solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-xl border border-yellow-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-amber-600 mb-4" />
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
              From setup to serving customers in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-amber-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-amber-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-amber-600 to-yellow-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Go Digital?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 350+ food trucks using TheQRCode.io to share menus, locations, and grow their following.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Update your menu from anywhere, anytime</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Share location schedule and collect reviews</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-lg font-semibold rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-colors shadow-lg"
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
            Trusted by Food Trucks Nationwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-amber-600 mb-2">350+</div>
              <p className="text-gray-600">Food Trucks Using Our QR Codes</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-amber-600 mb-2">75K+</div>
              <p className="text-gray-600">Menu Scans Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-amber-600 mb-2">60%</div>
              <p className="text-gray-600">More Review Growth</p>
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
                QR code solutions for food trucks.
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

