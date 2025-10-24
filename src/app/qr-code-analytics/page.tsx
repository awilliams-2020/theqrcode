import type { Metadata } from 'next'
import { BarChart3, TrendingUp, Globe, Smartphone, Clock, Users, MapPin, Activity, Target, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'QR Code Analytics - Track & Analyze QR Code Performance | TheQRCode.io',
  description: 'Powerful QR code analytics to track scans, monitor performance, and understand your audience. Get detailed insights with location data, device breakdowns, and real-time monitoring.',
  keywords: ['qr code analytics', 'qr code tracking', 'qr code insights', 'qr code metrics', 'qr code performance', 'qr code monitoring'],
  openGraph: {
    title: 'QR Code Analytics - Track & Analyze QR Code Performance',
    description: 'Powerful QR code analytics to track scans, monitor performance, and understand your audience. Get detailed insights with location data, device breakdowns, and real-time monitoring.',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-analytics',
  },
  alternates: {
    canonical: '/qr-code-analytics',
  },
}

const analyticsFeatures = [
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics Dashboard',
    description: 'Get detailed insights into your QR code performance with interactive charts, trends, and comprehensive metrics.',
    highlights: ['Interactive charts', 'Performance trends', 'Custom date ranges', 'Visual data representation']
  },
  {
    icon: Globe,
    title: 'Geographic Tracking',
    description: 'See exactly where your QR codes are being scanned with detailed location data and country/city breakdowns.',
    highlights: ['Country tracking', 'City-level data', 'Geographic heatmaps', 'Regional insights']
  },
  {
    icon: Smartphone,
    title: 'Device & Browser Analytics',
    description: 'Understand your audience better with detailed device type, browser, and operating system breakdowns.',
    highlights: ['Device types', 'Browser analytics', 'OS breakdown', 'Mobile vs desktop']
  },
  {
    icon: Clock,
    title: 'Time-based Insights',
    description: 'Track when your QR codes are most active with hourly, daily, and weekly performance patterns.',
    highlights: ['Peak hours analysis', 'Daily trends', 'Weekly patterns', 'Seasonal insights']
  },
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description: 'Monitor QR code scans as they happen with live tracking and instant notifications for Pro users.',
    highlights: ['Live scan tracking', 'Real-time updates', 'Instant notifications', 'Dynamic monitoring']
  },
  {
    icon: Users,
    title: 'Audience Insights',
    description: 'Understand your QR code visitors with unique visitor tracking and engagement metrics.',
    highlights: ['Unique visitors', 'Return rate analysis', 'Engagement metrics', 'User behavior']
  }
]

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Basic analytics for getting started',
    features: [
      'Basic scan count',
      'Limited historical data',
      'Standard QR code types'
    ],
    analytics: [
      'Basic scan tracking',
      'Simple performance metrics'
    ]
  },
  {
    name: 'Starter',
    price: '$9',
    period: 'per month',
    description: 'Advanced analytics for small businesses',
    features: [
      'Advanced analytics dashboard',
      'Geographic tracking',
      'Device & browser breakdowns',
      'Custom date ranges',
      'Export data (CSV)',
      'Email support'
    ],
    analytics: [
      'Detailed insights & charts',
      'Location data & mapping',
      'Device & browser analytics',
      'Time-based analysis',
      'Performance metrics'
    ]
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'Professional analytics with real-time data',
    features: [
      'Everything in Starter',
      'Real-time analytics',
      'Live scan monitoring',
      'Advanced reporting',
      'API access',
      'Priority support',
      'Custom dashboards'
    ],
    analytics: [
      'Real-time monitoring',
      'Live notifications',
      'Advanced reporting',
      'API integration',
      'Custom analytics views'
    ],
    popular: true
  }
]

const benefits = [
  {
    icon: TrendingUp,
    title: 'Optimize Marketing Campaigns',
    description: 'Identify which QR codes perform best and optimize your marketing strategies based on real data.'
  },
  {
    icon: Target,
    title: 'Understand Your Audience',
    description: 'Learn about your customers through detailed demographic and behavioral analytics.'
  },
  {
    icon: Zap,
    title: 'Make Data-Driven Decisions',
    description: 'Access comprehensive insights to make informed decisions about your QR code campaigns.'
  }
]

export default function QRCodeAnalyticsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="h-4 w-4 mr-2" />
              Advanced QR Code Analytics
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful QR Code Analytics
              <span className="block text-blue-600">That Drive Results</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Track every scan, understand your audience, and optimize your QR code campaigns with comprehensive analytics. 
              Get detailed insights into location data, device types, timing patterns, and much more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link 
                href="#features"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
              >
                View Features
              </Link>
            </div>
          </div>

          {/* Analytics Preview Dashboard */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-5xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard Preview</h3>
              <p className="text-gray-600">See the comprehensive insights you'll get with our analytics platform</p>
            </div>
            
            {/* Mock Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600 mb-1">1,247</div>
                <div className="text-sm text-gray-600">Total Scans</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-1">892</div>
                <div className="text-sm text-gray-600">Unique Visitors</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <Globe className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600 mb-1">23</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-6 text-center">
                <Activity className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-orange-600 mb-1">342</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>

            {/* Mock Charts */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Scan Trends (Last 7 Days)</h4>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {[45, 67, 89, 34, 78, 123, 156].map((height, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-500 rounded-t w-full transition-all duration-1000"
                        style={{ height: `${height}px` }}
                      />
                      <div className="text-xs text-gray-500 mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Device Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium">Mobile</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                      </div>
                      <span className="text-sm text-gray-600">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium">Desktop</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
                      </div>
                      <span className="text-sm text-gray-600">32%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Analytics Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to track, analyze, and optimize your QR code performance. 
              From basic metrics to advanced insights, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyticsFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why QR Code Analytics Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just create QR codes—understand their impact with powerful analytics that drive business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Analytics Plans for Every Need
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your analytics requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-xl ${
                  plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Analytics Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Analytics Features</h4>
                    <ul className="space-y-3">
                      {plan.analytics.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/auth/signup?plan=${plan.name.toLowerCase()}`}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Unlock Powerful QR Code Analytics?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using our analytics platform to optimize their QR code campaigns and drive better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white border border-blue-400 rounded-lg hover:bg-blue-400 transition-colors font-semibold text-lg"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-6 w-6" />
                <span className="text-xl font-bold">TheQRCode.io</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional QR code analytics platform for businesses of all sizes.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/qr-code-generator" className="text-gray-400 hover:text-white transition-colors">
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link href="/qr-code-analytics" className="text-gray-400 hover:text-white transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/qr-code-api" className="text-gray-400 hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 TheQRCode.io. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
