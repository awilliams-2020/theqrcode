'use client'

import { Music, QrCode, Calendar, Users, BarChart3, Mic2, CheckCircle2, TrendingUp, Smartphone, Heart } from 'lucide-react'
import Link from 'next/link'

export default function MusicianLanding() {
  const useCases = [
    {
      icon: Music,
      title: 'EPK & Portfolio',
      description: 'Share your Electronic Press Kit, music samples, videos, and bio instantly with venue owners and promoters.'
    },
    {
      icon: Calendar,
      title: 'Booking & Contact',
      description: 'Let venues and clients book you easily. Share your availability and rates with one scan.'
    },
    {
      icon: Users,
      title: 'Social Media & Streaming',
      description: 'Direct fans to Spotify, Apple Music, Instagram, TikTok, and YouTube. Grow your following at gigs.'
    },
    {
      icon: Mic2,
      title: 'Set Lists & Requests',
      description: 'Share your set list with audiences. Let them request songs or tip you via Venmo/PayPal.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Fan Engagement',
      description: 'See which venues generate the most interest, what times fans engage, and which platforms they prefer.'
    },
    {
      icon: TrendingUp,
      title: 'Update EPK Anytime',
      description: 'New single released? Press coverage? Update your EPK without reprinting business cards.'
    },
    {
      icon: Smartphone,
      title: 'Perfect for Gigs',
      description: 'Display QR codes on stage, merch tables, and equipment cases. Fans scan while you perform.'
    },
    {
      icon: Users,
      title: 'Build Your Fanbase',
      description: 'Capture fan contact info. Build your email list for tour announcements and new releases.'
    },
    {
      icon: CheckCircle2,
      title: 'Professional Image',
      description: 'Stand out with modern, branded QR codes. Look more established than other artists.'
    },
    {
      icon: Heart,
      title: 'Connect with Fans',
      description: 'Make it easy for fans to follow, stream, and support you. Turn attendees into superfans.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Link Your Content',
      description: 'EPK, booking page, Spotify, Instagram, or create a landing page with everything'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your artist logo or album art. Choose frames that match your music style'
    },
    {
      number: '3',
      title: 'Display at Shows',
      description: 'Add to business cards, posters, merch, and stage equipment'
    },
    {
      number: '4',
      title: 'Track Growth',
      description: 'Monitor which gigs generate the most followers and bookings'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-6">
                🎵 QR Codes for Musicians & DJs
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Share Your Music
                <span className="block text-violet-600 mt-2">Book More Gigs</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for your EPK, booking info, streaming links, and social media. Track fan engagement with analytics. Perfect for musicians, DJs, and bands.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-lg hover:bg-violet-700 transition-colors shadow-lg"
                >
                  Create Music QR Code →
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
                  <span>Perfect for indie artists</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-xl border-2 border-violet-200">
                <div className="text-center mb-6">
                  <Music className="h-16 w-16 text-violet-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">DJ Luna</h3>
                  <p className="text-gray-600">Scan for music & booking</p>
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
            Struggling to Grow Your Music Career?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📱 Fans asking "What's your Instagram?" during sets</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">💼 Outdated EPKs printed on business cards you can't update</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📊 No way to track which gigs bring in new followers</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-violet-600 mt-12">
            One QR code connects fans to everything. Listen. Follow. Book.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Music Career
            </h2>
            <p className="text-xl text-gray-600">
              From EPKs to streaming to bookings – all in one QR code
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-violet-600 mb-4" />
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
              Why Musicians Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools for independent artists
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-violet-50 to-purple-50 p-8 rounded-xl border border-violet-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-violet-600 mb-4" />
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
              From setup to growing your fanbase in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-violet-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-violet-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-violet-600 to-purple-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Grow Your Music Career?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 250+ musicians and DJs using TheQRCode.io to share music, book gigs, and build their fanbase.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Share streaming links and grow your following</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Track which gigs bring the most bookings</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-colors shadow-lg"
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
            Trusted by Independent Musicians
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-violet-600 mb-2">250+</div>
              <p className="text-gray-600">Musicians & DJs</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-violet-600 mb-2">20K+</div>
              <p className="text-gray-600">Fan Interactions Per Month</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-violet-600 mb-2">65%</div>
              <p className="text-gray-600">More Streaming Followers</p>
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
                QR code solutions for musicians.
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

