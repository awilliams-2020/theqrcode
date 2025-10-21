'use client'

import { Home, QrCode, Users, FileText, BarChart3, Calendar, CheckCircle2, TrendingUp, Smartphone, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function OpenHouseLanding() {
  const useCases = [
    {
      icon: Home,
      title: 'Virtual Tours',
      description: 'Share 3D tours and video walkthroughs. Let buyers explore before they visit in person.'
    },
    {
      icon: FileText,
      title: 'Property Details',
      description: 'Share listing details, comps, neighborhood info, and schools instantly. No more printing dozens of flyers.'
    },
    {
      icon: Users,
      title: 'Lead Capture',
      description: 'Collect visitor information automatically. Know who attended and follow up with hot leads.'
    },
    {
      icon: Calendar,
      title: 'Schedule Showings',
      description: 'Let interested buyers book private showings directly from their phone.'
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Track Open House Traffic',
      description: 'See exactly how many people scanned, what time they visited, and which listings get the most interest.'
    },
    {
      icon: TrendingUp,
      title: 'Qualify Leads Faster',
      description: 'Identify serious buyers based on engagement. Know who viewed details multiple times.'
    },
    {
      icon: Smartphone,
      title: 'Contactless Experience',
      description: 'Modern, COVID-safe way to share information. Buyers appreciate the convenience.'
    },
    {
      icon: MapPin,
      title: 'Perfect for Yard Signs',
      description: 'Display QR codes on yard signs, window posters, and directional signs. Drive-by traffic can access info.'
    },
    {
      icon: CheckCircle2,
      title: 'Update Anytime',
      description: 'Price drop? Open house cancelled? Update instantly without removing signs.'
    },
    {
      icon: FileText,
      title: 'Professional Packets',
      description: 'Provide comprehensive information without printing costs. Eco-friendly and cost-effective.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Listing Page',
      description: 'Add property details, photos, virtual tour, and contact form'
    },
    {
      number: '2',
      title: 'Generate QR Code',
      description: 'Add your agency branding and professional styling'
    },
    {
      number: '3',
      title: 'Display at Open House',
      description: 'Print on yard signs, flyers, business cards, and door hangers'
    },
    {
      number: '4',
      title: 'Track & Follow Up',
      description: 'Monitor visitor engagement and follow up with interested buyers'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold mb-6">
                🏠 QR Codes for Open Houses
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Track Every Open House
                <span className="block text-blue-600 mt-2">Capture Every Lead</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for open house listings, virtual tours, and lead capture. Track visitor engagement in real-time. Know exactly who's interested before you follow up.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=starter'}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Create Open House QR →
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
                  <span>Track every visitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl border-2 border-slate-200">
                <div className="text-center mb-6">
                  <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Open House Saturday</h3>
                  <p className="text-gray-600">Scan for details & virtual tour</p>
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
            Frustrated with Traditional Open Houses?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📋 Manually collecting names on sign-in sheets that get lost</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">💰 Printing hundreds of expensive color flyers that get thrown away</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">❓ No way to know which visitors are actually serious buyers</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-blue-600 mt-12">
            QR codes modernize open houses. Track. Qualify. Convert. All automated.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Successful Open Houses
            </h2>
            <p className="text-xl text-gray-600">
              From virtual tours to lead capture to follow-up
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
              Why Top Agents Use QR Codes at Open Houses
            </h2>
            <p className="text-xl text-gray-600">
              Convert more visitors into buyers with data-driven insights
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
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
              From listing to lead tracking in under 10 minutes
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
      <section className="px-4 py-20 bg-gradient-to-br from-blue-600 to-slate-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Close More Deals?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 150+ agents using TheQRCode.io to track open house visitors and convert leads faster.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Automatically capture and qualify every visitor</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Track engagement and follow up with hot leads</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-slate-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-slate-700 transition-colors shadow-lg"
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
            Trusted by Top Real Estate Agents
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">150+</div>
              <p className="text-gray-600">Agents Using Open House QR Codes</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">5K+</div>
              <p className="text-gray-600">Open House Visitors Tracked</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-blue-600 mb-2">40%</div>
              <p className="text-gray-600">Higher Lead Conversion Rate</p>
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
                QR code solutions for open houses.
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

