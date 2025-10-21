'use client'

import { Building, QrCode, Wifi, Users, Clock, CheckCircle2, Smartphone, MapPin, Calendar, Star, Globe } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function HotelsLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('hotels');
  const useCases = [
    {
      icon: Wifi,
      title: 'Guest WiFi Access',
      description: 'Provide instant WiFi connectivity for guests without sharing passwords verbally or through complex processes.'
    },
    {
      icon: MapPin,
      title: 'Hotel Information',
      description: 'Share directions, local attractions, dining recommendations, and hotel amenities information.'
    },
    {
      icon: Calendar,
      title: 'Service Requests',
      description: 'Enable guests to request room service, housekeeping, maintenance, or concierge services instantly.'
    },
    {
      icon: Star,
      title: 'Guest Feedback',
      description: 'Collect reviews and feedback by directing guests to review platforms and feedback forms.'
    }
  ]

  const features = [
    {
      icon: Users,
      title: 'Enhanced Guest Experience',
      description: 'Provide seamless, contactless access to hotel services and information. Modern guests expect this convenience.'
    },
    {
      icon: Clock,
      title: 'Reduce Front Desk Load',
      description: 'Minimize common requests for WiFi passwords, local information, and service details at the front desk.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Approach',
      description: 'Works perfectly on all guest devices. No app downloads or technical setup required.'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Link to information in multiple languages, perfect for international hotels and resorts.'
    },
    {
      icon: CheckCircle2,
      title: 'Contactless Service',
      description: 'Reduce physical contact points while maintaining excellent service quality and guest satisfaction.'
    },
    {
      icon: Building,
      title: 'Professional Presentation',
      description: 'Showcase your hotel\'s modern technology adoption and attention to guest convenience details.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Set Up QR Codes',
      description: 'Create QR codes for WiFi networks, hotel services, local information, or guest feedback systems'
    },
    {
      number: '2',
      title: 'Customize for Your Brand',
      description: 'Add hotel branding, choose colors that match your decor, and select professional frame styles'
    },
    {
      number: '3',
      title: 'Deploy Throughout Property',
      description: 'Place QR codes in guest rooms, lobbies, elevators, restaurant areas, and other key locations'
    },
    {
      number: '4',
      title: 'Monitor Guest Engagement',
      description: 'Track usage analytics to understand guest preferences and optimize your service delivery'
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
                🏨 QR Codes for Hotels
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Elevate Guest
                <span className="block text-purple-600 mt-2">Experience & Services</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline guest WiFi access, share hotel information, and provide contactless service requests with QR codes. Perfect for hotels, resorts, and hospitality businesses looking to modernize guest experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    trackCTA('Create Hotel QR Code', 'hero', 'starter');
                    window.location.href = '/auth/signup?plan=starter';
                  }}
                  className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Get Started →
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
                  <span>Bulk room deployment</span>
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
                  <Building className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Guest WiFi</h3>
                  <p className="text-gray-600">Scan to connect to hotel WiFi</p>
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
            Common Hotel Service Challenges
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📞 Front desk overwhelmed with WiFi password requests and basic service questions</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📱 Guests expecting modern, contactless access to hotel services and information</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⭐ Difficulty collecting guest feedback and reviews for service improvement</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-purple-600 mt-12">
            QR codes provide instant, contactless access to everything guests need.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hotel QR Code Applications
            </h2>
            <p className="text-xl text-gray-600">
              From WiFi access to guest services – enhance every aspect of the guest experience
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
              Why Hotels Choose Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Designed for the unique needs of hospitality and guest service excellence
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
              Quick Deployment Process
            </h2>
            <p className="text-xl text-gray-600">
              Get your hotel QR codes running across the property in hours, not days
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
              Transform Your Guest Experience
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hotels worldwide using QR codes to provide exceptional, contactless guest services.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Bulk QR code creation for multiple rooms and areas</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Reduce front desk workload and improve guest satisfaction</span>
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
                QR code solutions for hotels and hospitality.
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
