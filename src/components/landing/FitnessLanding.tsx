'use client'

import { Dumbbell, QrCode, Calendar, Users, BarChart3, Clock, CheckCircle2, TrendingUp, Smartphone, Heart } from 'lucide-react'
import Link from 'next/link'

export default function FitnessLanding() {
  const useCases = [
    {
      icon: Calendar,
      title: 'Class Schedules',
      description: 'Share your weekly class schedule instantly. Update times and locations without reprinting flyers.'
    },
    {
      icon: Users,
      title: 'Client Check-In',
      description: 'Let clients scan to check into sessions. Track attendance automatically and build client profiles.'
    },
    {
      icon: Heart,
      title: 'Contact & Booking',
      description: 'Share your contact info and booking link instantly. Make it easy for prospects to reach you.'
    },
    {
      icon: TrendingUp,
      title: 'Social Media Links',
      description: 'Direct followers to your Instagram, YouTube workouts, and testimonials with one scan.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Client Engagement',
      description: 'See which clients are most engaged, what times work best, and which marketing materials get scanned most.'
    },
    {
      icon: Clock,
      title: 'Update Schedules Instantly',
      description: 'Class cancelled? Time changed? Update your QR code content immediately without reprinting posters.'
    },
    {
      icon: Smartphone,
      title: 'Perfect for Gyms',
      description: 'Place QR codes on equipment, mirrors, and walls. Share workout tips, form videos, and class info.'
    },
    {
      icon: Users,
      title: 'Build Your Community',
      description: 'Direct clients to your private Facebook group, WhatsApp community, or member portal.'
    },
    {
      icon: CheckCircle2,
      title: 'No App Required',
      description: 'Works with any smartphone camera. Clients scan and connect instantly – no downloads needed.'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Track which marketing efforts work. See scan data by location, time, and campaign.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Choose Your Content',
      description: 'Link to your class schedule, booking page, contact info, or social media profiles'
    },
    {
      number: '2',
      title: 'Customize Your QR Code',
      description: 'Add your fitness brand logo and colors. Choose a frame style that matches your vibe'
    },
    {
      number: '3',
      title: 'Print & Display',
      description: 'Add to flyers, posters, business cards, and gym equipment. High-resolution formats included'
    },
    {
      number: '4',
      title: 'Track & Optimize',
      description: 'Monitor engagement, identify your best clients, and optimize your marketing strategy'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
                💪 QR Codes for Fitness Trainers
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Share Your Schedule
                <span className="block text-green-600 mt-2">Grow Your Fitness Business</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for class schedules, booking links, and contact info. Track client engagement with analytics. Update anytime without reprinting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  Create Fitness QR Code →
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200">
                <div className="text-center mb-6">
                  <Dumbbell className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">FitLife Training</h3>
                  <p className="text-gray-600">Scan for schedule & booking</p>
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
            Struggling to Fill Your Classes?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📱 Clients constantly asking "What time is your next class?"</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📄 Reprinting flyers every time your schedule changes</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">❓ No idea which marketing channels bring in new clients</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-green-600 mt-12">
            QR codes solve all of this. One scan. Instant access. Real-time updates.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow Your Fitness Business
            </h2>
            <p className="text-xl text-gray-600">
              From schedules to bookings to social media – all in one QR code
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-green-600 mb-4" />
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
              Why Fitness Trainers Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Save time, attract more clients, and grow your business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-green-600 mb-4" />
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
              From setup to client tracking in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Grow Your Fitness Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 300+ fitness trainers using TheQRCode.io to share schedules, track clients, and boost bookings.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Update your schedule without reprinting flyers</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Track which marketing brings in new clients</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg"
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
            Trusted by Fitness Professionals Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-green-600 mb-2">300+</div>
              <p className="text-gray-600">Fitness Trainers</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-green-600 mb-2">15K+</div>
              <p className="text-gray-600">Client Interactions Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-green-600 mb-2">40%</div>
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
                QR code solutions for fitness professionals.
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

