'use client'

import { GraduationCap, QrCode, Users, Wifi, Clock, CheckCircle2, Smartphone, BookOpen, Calendar, Globe, Award } from 'lucide-react'
import Link from 'next/link'
import { useLandingPageTracking } from '@/hooks/useLandingPageTracking'

export default function EducationLanding() {
  const { trackCTA, trackDemo } = useLandingPageTracking('education');
  const useCases = [
    {
      icon: Wifi,
      title: 'Student WiFi Access',
      description: 'Share secure WiFi credentials instantly. No more students asking for the password or IT support tickets.'
    },
    {
      icon: BookOpen,
      title: 'Digital Resources',
      description: 'Link to online textbooks, course materials, and learning resources. Students access content instantly.'
    },
    {
      icon: Calendar,
      title: 'Assignment Submissions',
      description: 'Direct students to homework portals, assignment instructions, and submission forms.'
    },
    {
      icon: Globe,
      title: 'Parent Communication',
      description: 'Connect parents to school portals, event information, and communication platforms.'
    }
  ]

  const features = [
    {
      icon: Users,
      title: 'Enhanced Student Engagement',
      description: 'Make technology accessible and familiar. Students are already comfortable with QR codes.'
    },
    {
      icon: Clock,
      title: 'Save Class Time',
      description: 'Reduce time spent on technical setup. More time for actual learning and instruction.'
    },
    {
      icon: Smartphone,
      title: 'Device Accessibility',
      description: 'Works on any smartphone or tablet. No special apps or technical knowledge required.'
    },
    {
      icon: Award,
      title: 'Modern Learning Environment',
      description: 'Showcase your institution\'s commitment to technology integration and innovation.'
    },
    {
      icon: CheckCircle2,
      title: 'Universal Access',
      description: 'Ensures all students can access digital resources regardless of technical expertise.'
    },
    {
      icon: GraduationCap,
      title: 'Edu-Friendly Features',
      description: 'Bulk creation for multiple classrooms and analytics to track resource usage and engagement.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Your QR Code',
      description: 'Generate QR codes for WiFi networks, course materials, or assignment portals'
    },
    {
      number: '2',
      title: 'Customize for Your School',
      description: 'Add school branding, colors, and frame styles that match your institution\'s identity'
    },
    {
      number: '3',
      title: 'Deploy Across Campus',
      description: 'Display QR codes in classrooms, libraries, cafeterias, and common areas'
    },
    {
      number: '4',
      title: 'Monitor Educational Impact',
      description: 'Track usage analytics to understand how students engage with digital resources'
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
                🎓 QR Codes for Education
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Engage Students with
                <span className="block text-green-600 mt-2">Smart Technology</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline WiFi access, share digital resources, and create engaging learning experiences with QR codes. Perfect for schools, universities, and educational institutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => {
                    trackCTA('Create Education QR Code', 'hero', 'starter');
                    window.location.href = '/auth/signup?plan=starter';
                  }}
                  className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
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
                  <span>Bulk classroom creation</span>
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
                  <GraduationCap className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Student WiFi</h3>
                  <p className="text-gray-600">Scan to connect to school WiFi</p>
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
            Common Educational Challenges
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📶 Students constantly asking for WiFi passwords, wasting class time</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">📚 Difficulty sharing digital resources and course materials efficiently</p>
            </div>
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-lg text-gray-700">⏰ IT departments overwhelmed with simple student access requests</p>
            </div>
          </div>
          <p className="text-2xl font-semibold text-green-600 mt-12">
            QR codes eliminate these distractions and create a seamless learning environment.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Educational QR Code Applications
            </h2>
            <p className="text-xl text-gray-600">
              From WiFi access to digital learning – transform your educational experience
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
              Why Educational Institutions Choose Our QR Codes
            </h2>
            <p className="text-xl text-gray-600">
              Designed for the unique needs of schools and learning environments
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
              Quick Implementation Process
            </h2>
            <p className="text-xl text-gray-600">
              Get your educational QR codes running in classrooms within minutes
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
              Transform Your Learning Environment
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join educational institutions using QR codes to enhance student engagement and streamline operations.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Bulk creation for multiple classrooms and departments</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span>Reduce IT support requests and class interruptions</span>
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
                QR code solutions for educational institutions.
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
