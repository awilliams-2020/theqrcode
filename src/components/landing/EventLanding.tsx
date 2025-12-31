'use client'

import { Calendar, QrCode, Users, BarChart3, Clock, CheckCircle2, TrendingUp, Smartphone, Ticket, MapPin, Mail, Zap } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function EventLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('events');
  const useCases = [
    {
      icon: Ticket,
      title: 'Event Registration',
      description: 'Create QR codes for event registration pages. Track sign-ups in real-time and manage attendee lists effortlessly.'
    },
    {
      icon: Users,
      title: 'Check-In & Attendance',
      description: 'Streamline event check-in with QR codes. Scan tickets at the door for instant verification and attendance tracking.'
    },
    {
      icon: Mail,
      title: 'Event Marketing',
      description: 'Promote events with QR codes on flyers, posters, and social media. Track which marketing channels drive the most registrations.'
    },
    {
      icon: MapPin,
      title: 'Event Information',
      description: 'Share event details, schedules, venue maps, and parking information. Update information anytime without reprinting materials.'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Registration Tracking',
      description: 'Monitor event registrations as they happen. See who\'s signing up, when they register, and which marketing channels work best.'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Track QR code scans, registration rates, check-in times, and attendee engagement. Make data-driven decisions for future events.'
    },
    {
      icon: Clock,
      title: 'Update Event Details Anytime',
      description: 'Changed the schedule? New speaker? Update your event information instantly. Same QR code, updated content - no reprinting needed.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-Optimized Experience',
      description: 'Perfect for mobile users. Attendees can register, check in, and access event information seamlessly on any device.'
    },
    {
      icon: CheckCircle2,
      title: 'No App Downloads Required',
      description: 'Works with built-in camera apps. Attendees just scan and go - no complicated setup or app installations needed.'
    },
    {
      icon: Users,
      title: 'Streamline Event Management',
      description: 'Reduce manual check-ins and registration processing. Automate attendee management and focus on delivering great events.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Your Event QR Code',
      description: 'Link to your event registration page, landing page, or event information. Customize with your event branding and colors.'
    },
    {
      number: '2',
      title: 'Add to Marketing Materials',
      description: 'Print QR codes on tickets, flyers, posters, email campaigns, and social media. One code works across all channels.'
    },
    {
      number: '3',
      title: 'Track Registrations & Check-Ins',
      description: 'Monitor real-time registrations and check-ins. See which marketing channels drive the most sign-ups.'
    },
    {
      number: '4',
      title: 'Update Anytime',
      description: 'Need to change event details? Update your QR code destination instantly. Same code, new information - no reprinting.'
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
                🎉 QR Code Activations for Events
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                QR Code Activations for Events
                <span className="block text-purple-600 mt-2">Registration & Check-In Made Easy</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create QR codes for event registration, check-in, marketing, and attendee engagement. Track registrations in real-time and manage events effortlessly. Perfect for conferences, workshops, corporate events, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    trackCTA('Create Event QR Code', 'hero', 'starter');
                    window.location.href = '/auth/signup?plan=starter';
                  }}
                  className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Create Event QR Code →
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
                  <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Event Registration</h3>
                  <p className="text-gray-600">Scan to register for our event</p>
                </div>
                <div className="aspect-square bg-white rounded-xl flex items-center justify-center border-2 border-gray-200">
                  <QrCode className="h-48 w-48 text-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Event Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From conferences to workshops, corporate events to community gatherings - QR codes streamline event management
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Event Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage successful events with QR codes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with event QR codes in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Events?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join event organizers using QR codes to simplify registration, check-in, and attendee management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                trackCTA('Start Free Trial', 'cta', 'starter');
                window.location.href = '/auth/signup?plan=starter';
              }}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Start Free Trial
            </button>
            <Link
              href="/contact"
              className="px-8 py-4 bg-purple-500 text-white border border-purple-400 rounded-lg hover:bg-purple-400 transition-colors font-semibold text-lg"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}