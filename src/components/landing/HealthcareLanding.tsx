'use client'

import { Heart, QrCode, Users, Shield, Clock, CheckCircle2, Smartphone, FileText, Calendar, Stethoscope, Activity } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function HealthcareLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('healthcare');
  const useCases = [
    {
      icon: Users,
      title: 'Patient Check-ins',
      description: 'Streamline patient arrival with QR code check-ins. Reduce waiting room congestion and staff workload.'
    },
    {
      icon: FileText,
      title: 'Intake Forms',
      description: 'Share digital forms and questionnaires securely. Patients complete forms before arriving.'
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      description: 'Direct patients to online scheduling. Reduce phone calls and improve appointment management.'
    },
    {
      icon: Activity,
      title: 'Health Information',
      description: 'Share educational materials, medication guides, and post-care instructions.'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'HIPAA-Compliant Security',
      description: 'Enterprise-grade security with data encryption and secure storage for sensitive healthcare information.'
    },
    {
      icon: Clock,
      title: 'Reduce Wait Times',
      description: 'Patients complete forms and check-in before arriving. Smoother experiences for everyone.'
    },
    {
      icon: Smartphone,
      title: 'Contactless Experience',
      description: 'Minimize physical contact with shared surfaces. Better for patient safety and comfort.'
    },
    {
      icon: Stethoscope,
      title: 'Staff Efficiency',
      description: 'Reduce administrative burden. Staff focus on patient care, not paperwork.'
    },
    {
      icon: CheckCircle2,
      title: 'No App Downloads',
      description: 'Works with built-in camera apps. No technical barriers for patients of any age.'
    },
    {
      icon: Activity,
      title: 'Real-time Updates',
      description: 'Update forms, instructions, and information instantly without reprinting materials.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Set Up Your QR Code',
      description: 'Create QR codes linking to patient forms, check-in portals, or appointment booking systems'
    },
    {
      number: '2',
      title: 'Customize for Your Practice',
      description: 'Add your clinic branding, choose colors, and frame styles that reflect your professional image'
    },
    {
      number: '3',
      title: 'Display Strategically',
      description: 'Place QR codes in waiting rooms, on appointment cards, or in patient communications'
    },
    {
      number: '4',
      title: 'Track Patient Engagement',
      description: 'Monitor usage patterns and optimize your patient experience based on real data'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                🏥 QR Codes for Healthcare
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Streamline Patient
                <span className="block text-blue-600 mt-2">Check-ins & Forms</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Reduce wait times with HIPAA-compliant QR codes for patient check-ins, intake forms, and appointment booking. Improve patient experience while reducing administrative workload.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    trackCTA('Create Healthcare QR Code', 'hero', 'starter');
                    window.location.href = '/auth/signup?plan=starter';
                  }}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
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
                  <span>HIPAA-compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border-2 border-blue-200">
                <div className="text-center mb-6">
                  <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Check-in</h3>
                  <p className="text-gray-600">Scan to check in for your appointment</p>
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
            Common Healthcare Challenges
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⏰ Long wait times due to manual check-in and form completion</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📋 Staff overwhelmed with administrative tasks instead of patient care</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">🦠 Patients concerned about touching shared surfaces and forms</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-blue-600 mt-12">
            QR codes reduce wait times and improve patient satisfaction.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Healthcare QR Code Solutions
            </h2>
            <p className="text-xl text-gray-600">
              From check-ins to patient education – streamline your practice
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
              Why Healthcare Providers Choose Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Secure, efficient, and designed for healthcare environments
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
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
              Simple Implementation Process
            </h2>
            <p className="text-xl text-gray-600">
              Get your healthcare QR codes up and running in minutes
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
      <section className="px-4 py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Improve Your Patient Experience Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join healthcare providers using QR codes to streamline operations and enhance patient care.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>HIPAA-compliant security and data protection</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Reduce wait times and administrative burden</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>14-day free trial, cancel anytime</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/auth/signup?plan=starter'}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
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
                QR code solutions for healthcare providers.
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
