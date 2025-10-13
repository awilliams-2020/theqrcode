'use client'

import { Camera, QrCode, Image, Users, BarChart3, Star, CheckCircle2, Calendar, Smartphone, Heart } from 'lucide-react'
import Link from 'next/link'

export default function PhotographerLanding() {
  const useCases = [
    {
      icon: Image,
      title: 'Portfolio Sharing',
      description: 'Link to your online portfolio instantly. Let potential clients see your best work with one scan.'
    },
    {
      icon: Calendar,
      title: 'Booking & Contact',
      description: 'Share your booking calendar and contact info. Make it easy for clients to schedule sessions.'
    },
    {
      icon: Star,
      title: 'Reviews & Testimonials',
      description: 'Direct clients to your Google reviews or testimonial page. Build trust with social proof.'
    },
    {
      icon: Users,
      title: 'Client Gallery Access',
      description: 'Give clients private gallery access. They scan and view their photos instantly.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Client Interest',
      description: 'See which marketing materials get scanned most, what times work best, and where your clients come from.'
    },
    {
      icon: Camera,
      title: 'Perfect for Business Cards',
      description: 'Add QR codes to business cards, flyers, and portfolios. Stand out with modern, professional branding.'
    },
    {
      icon: Smartphone,
      title: 'Update Portfolio Anytime',
      description: 'Refresh your portfolio without reprinting cards. Same QR code, updated content whenever you want.'
    },
    {
      icon: Heart,
      title: 'Client Experience',
      description: 'Deliver a premium experience. Clients scan to access their photos, book sessions, and leave reviews.'
    },
    {
      icon: CheckCircle2,
      title: 'No App Required',
      description: 'Works with any smartphone camera. Clients access everything instantly – no downloads needed.'
    },
    {
      icon: Star,
      title: 'Professional Branding',
      description: 'Customize with your brand colors and logo. Create QR codes that match your style.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Link Your Content',
      description: 'Connect to your portfolio, booking page, Instagram, or client gallery system'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your photography brand logo and colors. Choose elegant frames for a professional look'
    },
    {
      number: '3',
      title: 'Print & Share',
      description: 'Add to business cards, portfolios, thank-you cards, and marketing materials'
    },
    {
      number: '4',
      title: 'Track Engagement',
      description: 'Monitor which materials generate the most bookings and optimize your marketing'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
                📸 QR Codes for Photographers
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Share Your Portfolio
                <span className="block text-purple-600 mt-2">Book More Clients</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for your portfolio, booking link, and client galleries. Track engagement with analytics. Perfect for business cards and marketing materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Create Portfolio QR Code →
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
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border-2 border-purple-200">
                <div className="text-center mb-6">
                  <Camera className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Emma Photography</h3>
                  <p className="text-gray-600">Scan to view portfolio</p>
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
            Tired of These Photography Business Challenges?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">💼 Business cards with outdated portfolio links printed on them</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📱 Potential clients struggling to find your Instagram or website</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">❓ No way to track which marketing materials bring in clients</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-purple-600 mt-12">
            QR codes solve all of this. One scan. Instant access. Update anytime.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Photography Business
            </h2>
            <p className="text-xl text-gray-600">
              From portfolios to bookings to client galleries – one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-purple-600 mb-4" />
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
              Why Photographers Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools for modern photographers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
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
              From portfolio to bookings in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
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
      <section className="px-4 py-20 bg-gradient-to-br from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Modernize Your Photography Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 400+ photographers using TheQRCode.io to share portfolios, book clients, and deliver amazing experiences.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Update portfolio without reprinting business cards</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Track which marketing brings in bookings</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg"
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
            Trusted by Professional Photographers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-purple-600 mb-2">400+</div>
              <p className="text-gray-600">Professional Photographers</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-purple-600 mb-2">25K+</div>
              <p className="text-gray-600">Portfolio Views Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-purple-600 mb-2">50%</div>
              <p className="text-gray-600">Average Booking Increase</p>
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
                QR code solutions for photographers.
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

