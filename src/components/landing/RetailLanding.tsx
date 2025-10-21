'use client'

import { Store, QrCode, Tag, ShoppingBag, BarChart3, Star, CheckCircle2, TrendingUp, Smartphone, Gift } from 'lucide-react'
import Link from 'next/link'

export default function RetailLanding() {
  const useCases = [
    {
      icon: ShoppingBag,
      title: 'Product Information',
      description: 'Link to detailed product specs, ingredients, care instructions, and reviews. Reduce customer questions.'
    },
    {
      icon: Star,
      title: 'Review Collection',
      description: 'Direct happy customers to your Google or Yelp reviews. Boost your rating with simple QR codes.'
    },
    {
      icon: Gift,
      title: 'Loyalty Programs',
      description: 'Share your loyalty program signup link. Turn one-time shoppers into repeat customers.'
    },
    {
      icon: Tag,
      title: 'Special Offers',
      description: 'Share exclusive discounts and promotions. Track which offers convert best.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Customer Interest',
      description: 'See which products get scanned most, what times are busiest, and which displays work best.'
    },
    {
      icon: TrendingUp,
      title: 'Update Offers Instantly',
      description: 'Change promotions without reprinting signs. Same QR code, new offers whenever you want.'
    },
    {
      icon: Smartphone,
      title: 'Bridge Physical & Digital',
      description: 'Connect your in-store experience to your online store, social media, and email list.'
    },
    {
      icon: Store,
      title: 'Perfect for Small Shops',
      description: 'Affordable solution for boutiques, gift shops, and local retailers. No expensive tech needed.'
    },
    {
      icon: CheckCircle2,
      title: 'Customer-Friendly',
      description: 'No app downloads. Works on all phones. Even technophobe customers can scan easily.'
    },
    {
      icon: Star,
      title: 'Build Trust',
      description: 'Share your story, values, and customer reviews. Connect emotionally with shoppers.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Choose Your Purpose',
      description: 'Product info, reviews, loyalty program, social media, or special offers'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your store logo and brand colors. Choose frames that match your aesthetic'
    },
    {
      number: '3',
      title: 'Display in Store',
      description: 'Add to product displays, checkout counter, windows, and shopping bags'
    },
    {
      number: '4',
      title: 'Track & Optimize',
      description: 'Monitor which products and offers generate the most engagement'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-6">
                🛍️ QR Codes for Small Retailers
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Connect Shoppers to
                <span className="block text-cyan-600 mt-2">Your Products & Reviews</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for product info, reviews, loyalty programs, and special offers. Track customer engagement with analytics. Perfect for boutiques and local shops.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-cyan-600 text-white text-lg font-semibold rounded-lg hover:bg-cyan-700 transition-colors shadow-lg"
                >
                  Create Retail QR Code →
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
                  <span>Perfect for boutiques</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-xl border-2 border-cyan-200">
                <div className="text-center mb-6">
                  <Store className="h-16 w-16 text-cyan-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Local Boutique</h3>
                  <p className="text-gray-600">Scan for product details & reviews</p>
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
            Facing These Retail Challenges?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">❓ Customers asking the same product questions over and over</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⭐ Struggling to get customers to leave Google reviews</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📱 No way to capture customer emails for your newsletter</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-cyan-600 mt-12">
            QR codes bridge the gap between physical and digital. One scan, endless possibilities.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Retail Store
            </h2>
            <p className="text-xl text-gray-600">
              From product info to reviews to loyalty – boost sales and engagement
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-cyan-600 mb-4" />
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
              Why Small Retailers Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Affordable, powerful tools for local shops
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-xl border border-cyan-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-cyan-600 mb-4" />
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
              From setup to customer engagement in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-cyan-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-cyan-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-cyan-600 to-teal-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Boost Your Retail Sales?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 600+ small retailers using TheQRCode.io to connect with customers and increase sales.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Share product info and collect reviews effortlessly</span>
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
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-lg font-semibold rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-colors shadow-lg"
            >
              Start Your Free Trial →
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-20 bg-white hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 hidden">
            Trusted by Local Retailers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-cyan-600 mb-2">600+</div>
              <p className="text-gray-600">Small Retail Stores</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-cyan-600 mb-2">40K+</div>
              <p className="text-gray-600">Customer Scans Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-cyan-600 mb-2">25%</div>
              <p className="text-gray-600">Average Sales Increase</p>
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
                QR code solutions for retailers.
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

