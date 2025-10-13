'use client'

import { Heart, QrCode, Users, Calendar, Gift, MapPin, CheckCircle2, Camera, Music, Wine } from 'lucide-react'
import Link from 'next/link'

export default function WeddingLanding() {
  const useCases = [
    {
      icon: Calendar,
      title: 'Digital RSVP',
      description: 'Let guests RSVP instantly by scanning. Track responses in real-time. No more chasing RSVPs.'
    },
    {
      icon: Gift,
      title: 'Wedding Registry',
      description: 'Share registry links easily. Place QR codes on invitations and thank-you cards.'
    },
    {
      icon: Camera,
      title: 'Photo Sharing',
      description: 'Let guests upload photos to a shared album. Capture every moment from every perspective.'
    },
    {
      icon: MapPin,
      title: 'Venue Information',
      description: 'Share venue address, parking info, and directions with a simple scan. Perfect for out-of-town guests.'
    }
  ]

  const features = [
    {
      icon: Users,
      title: 'Simplify Guest Management',
      description: 'Track RSVPs, meal preferences, and plus-ones automatically. No spreadsheets required.'
    },
    {
      icon: Heart,
      title: 'Modern & Elegant',
      description: 'Customize QR codes with your wedding colors and theme. Add your initials or wedding date.'
    },
    {
      icon: Music,
      title: 'Song Requests',
      description: 'Let guests request songs for the reception. Make your playlist unforgettable.'
    },
    {
      icon: Wine,
      title: 'Event Schedule',
      description: 'Share ceremony times, cocktail hour, and reception details. Keep everyone informed.'
    },
    {
      icon: CheckCircle2,
      title: 'Easy for Guests',
      description: 'No app downloads. Works on all phones. Even grandma can scan and RSVP easily.'
    },
    {
      icon: Camera,
      title: 'Collect Memories',
      description: 'Create a shared photo album. Get all guest photos in one place instantly.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Choose Your Use Case',
      description: 'RSVP, registry, photos, venue info, or all of the above. Create multiple QR codes for different purposes'
    },
    {
      number: '2',
      title: 'Customize Design',
      description: 'Add your wedding colors, initials, or date. Choose elegant frames that match your theme'
    },
    {
      number: '3',
      title: 'Add to Invitations',
      description: 'Print on invitations, programs, table cards, and signs. Digital or physical formats'
    },
    {
      number: '4',
      title: 'Track Responses',
      description: 'Monitor RSVPs in real-time. Send reminders to guests who haven\'t responded'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold mb-6">
                💕 QR Codes for Weddings
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Simplify Your Wedding
                <span className="block text-pink-600 mt-2">with Smart QR Codes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create beautiful QR codes for RSVPs, registries, photo sharing, and venue info. Track responses in real-time. Make your wedding planning effortless.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-pink-600 text-white text-lg font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-lg"
                >
                  Create Wedding QR Code →
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
                  <span>Perfect for DIY brides</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-xl border-2 border-pink-200">
                <div className="text-center mb-6">
                  <Heart className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah & John</h3>
                  <p className="text-gray-600">Scan to RSVP & View Details</p>
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
            Overwhelmed with Wedding Planning?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📧 Chasing guests for RSVPs via email, text, and phone</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📝 Managing spreadsheets for meal choices and plus-ones</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📸 Guest photos scattered across different phones and social media</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-pink-600 mt-12">
            QR codes automate all of this. Scan, RSVP, done.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Big Day
            </h2>
            <p className="text-xl text-gray-600">
              From invitations to the reception – one platform handles it all
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <useCase.icon className="h-12 w-12 text-pink-600 mb-4" />
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
              Why Wedding Planners Love Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Less stress, more magic on your special day
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-xl border border-pink-200 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-pink-600 mb-4" />
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
              From design to RSVP tracking in under 10 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                  <div className="h-12 w-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-pink-300">
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
      <section className="px-4 py-20 bg-gradient-to-br from-pink-600 to-rose-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Simplify Your Wedding?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 1,000+ couples using TheQRCode.io for stress-free wedding planning. Create your first QR code in minutes.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Automate RSVP tracking and guest management</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Customize with your wedding colors and theme</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Free plan available, upgrade only if you need</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-lg font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-colors shadow-lg"
            >
              Create Your Wedding QR Code →
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Trusted by Happy Couples Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-pink-600 mb-2">1,000+</div>
              <p className="text-gray-600">Weddings Planned</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-pink-600 mb-2">95%</div>
              <p className="text-gray-600">RSVP Response Rate</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-pink-600 mb-2">50K+</div>
              <p className="text-gray-600">Guest Interactions</p>
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
                QR code solutions for weddings.
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

