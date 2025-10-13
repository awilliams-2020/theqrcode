'use client'

import { Scissors, QrCode, Calendar, Star, BarChart3, Clock, CheckCircle2, TrendingUp, Smartphone, Users } from 'lucide-react'
import Link from 'next/link'

export default function SalonLanding() {
  const useCases = [
    {
      icon: Calendar,
      title: 'Online Booking',
      description: 'Let clients book appointments instantly. Reduce phone calls and no-shows with easy online scheduling.'
    },
    {
      icon: Star,
      title: 'Review Collection',
      description: 'Direct happy clients to your Google or Yelp reviews right after their appointment. Boost your rating.'
    },
    {
      icon: Users,
      title: 'Loyalty Program',
      description: 'Share your rewards program signup link. Turn first-time clients into loyal regulars.'
    },
    {
      icon: Scissors,
      title: 'Service Menu & Pricing',
      description: 'Share detailed service descriptions and pricing. Update without reprinting menu cards.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Client Engagement',
      description: 'See which services interest clients most, what times they prefer, and which marketing works.'
    },
    {
      icon: Clock,
      title: 'Fill Last-Minute Slots',
      description: 'Update QR codes with special same-day discounts. Fill empty appointment slots instantly.'
    },
    {
      icon: TrendingUp,
      title: 'Reduce No-Shows',
      description: 'Send booking confirmations and reminders. Automated follow-ups reduce cancellations.'
    },
    {
      icon: Smartphone,
      title: 'Perfect for Mirrors',
      description: 'Display QR codes on mirrors, styling stations, and reception. Clients scan while you style.'
    },
    {
      icon: CheckCircle2,
      title: 'Easy for Everyone',
      description: 'No app downloads. Works on all phones. Even your least tech-savvy clients can scan.'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Make it easy for happy clients to leave reviews. Watch your ratings climb.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Choose Your Link',
      description: 'Booking page, review site, service menu, or loyalty program signup'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your salon logo and brand colors. Choose elegant frames for a premium feel'
    },
    {
      number: '3',
      title: 'Display in Salon',
      description: 'Add to mirrors, business cards, appointment cards, and window displays'
    },
    {
      number: '4',
      title: 'Track Results',
      description: 'Monitor bookings, review growth, and client engagement over time'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold mb-6">
                💇 QR Codes for Salons & Spas
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Fill Your Appointment Book
                <span className="block text-rose-600 mt-2">Build 5-Star Reputation</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for booking, reviews, loyalty programs, and service menus. Track client engagement with analytics. Perfect for salons, spas, and beauty professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-rose-600 text-white text-lg font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-lg"
                >
                  Create Salon QR Code →
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
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl border-2 border-rose-200">
                <div className="text-center mb-6">
                  <Scissors className="h-16 w-16 text-rose-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bella Beauty Salon</h3>
                  <p className="text-gray-600">Scan to book & review</p>
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
            Facing These Salon Challenges?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📞 Spending hours answering booking calls instead of styling</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⭐ Happy clients forgetting to leave Google reviews</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📅 Last-minute cancellations leaving empty appointment slots</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-rose-600 mt-12">
            QR codes solve all of this. Book. Review. Rebook. All automated.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Salon
            </h2>
            <p className="text-xl text-gray-600">
              From booking to reviews to loyalty – grow your business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-rose-600 mb-4" />
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
              Why Salon Owners Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              More bookings, better reviews, loyal clients
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl border border-rose-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-rose-600 mb-4" />
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
              From setup to fully booked in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-rose-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-rose-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-rose-600 to-pink-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Fill Your Appointment Book?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 450+ salons and spas using TheQRCode.io to automate bookings, collect reviews, and grow their business.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Automate booking and reduce phone interruptions</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Collect 5-star reviews effortlessly</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-lg font-semibold rounded-lg hover:from-rose-700 hover:to-pink-700 transition-colors shadow-lg"
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
            Trusted by Beauty Professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-rose-600 mb-2">450+</div>
              <p className="text-gray-600">Salons & Spas</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-rose-600 mb-2">30K+</div>
              <p className="text-gray-600">Bookings Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-rose-600 mb-2">45%</div>
              <p className="text-gray-600">More 5-Star Reviews</p>
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
                QR code solutions for salons and spas.
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

