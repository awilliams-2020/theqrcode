'use client'

import React, { useState, useEffect } from 'react'
import { Check, Zap, X, TrendingUp, Users, Database, BarChart3, Image, Palette, Shield, Headphones, Code, Building2 } from 'lucide-react'
import { trackSignup, trackLandingPage } from '@/lib/matomo-tracking'

interface PricingPageProps {
  session: any
}

interface UserSubscription {
  plan: string
  status: string
  trialEndsAt?: Date | null
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out QR codes',
    features: [
      '10 QR codes',
      '1,000 scans per month',
      'Basic analytics',
      'URL, Text, WiFi, Contact types',
      'Basic customization',
    ],
    buttonText: 'Get Started',
    featured: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    description: 'Great for small businesses',
    features: [
      '100 QR codes',
      '10,000 scans per month',
      'Advanced analytics',
      'All QR code types',
      'Custom styling',
      'Email support',
    ],
    buttonText: 'Subscribe',
    featured: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'For developers and growing companies',
    features: [
      '500 QR codes',
      '500,000 scans per month',
      'Real-time analytics',
      'All QR code types',
      'Advanced customization',
      'Priority support',
      'REST API access — 5,000 req/hr',
      'API key authentication',
      'MCP server (Claude, Cursor)',
      'Bulk generation endpoint',
    ],
    buttonText: 'Subscribe',
    featured: true,
  },
]

// Detailed feature comparison
// Based on actual constants in the codebase
const featureCategories = [
  {
    name: 'QR Code Creation',
    icon: Image,
    features: [
      { name: 'QR codes per account', free: '10', starter: '100', pro: '500' },
      { name: 'URL QR codes', free: true, starter: true, pro: true },
      { name: 'Text QR codes', free: true, starter: true, pro: true },
      { name: 'WiFi QR codes', free: true, starter: true, pro: true },
      { name: 'Contact/VCard QR codes', free: true, starter: true, pro: true },
      { name: 'Email QR codes', free: false, starter: true, pro: true },
      { name: 'Menu QR codes', free: false, starter: true, pro: true },
    ]
  },
  {
    name: 'Dynamic QR Codes & Analytics',
    icon: BarChart3,
    features: [
      { name: 'Basic analytics', free: true, starter: true, pro: true },
      { name: 'Dynamic QR codes', free: true, starter: true, pro: true },
      { name: 'Device analytics', free: false, starter: true, pro: true },
      { name: 'Location tracking', free: false, starter: true, pro: true },
      { name: 'Time-based analytics', free: false, starter: true, pro: true },
      { name: 'Real-time dashboards', free: false, starter: false, pro: true },
      { name: 'Data export (CSV)', free: false, starter: false, pro: true },
    ]
  },
  {
    name: 'Customization',
    icon: Palette,
    features: [
      { name: 'Basic color customization', free: false, starter: true, pro: true },
      { name: 'Custom colors', free: false, starter: true, pro: true },
      { name: 'Size customization', free: false, starter: true, pro: true },
      { name: 'Logo embedding', free: false, starter: true, pro: true },
      { name: 'Advanced styling (dots, corners)', free: false, starter: false, pro: true },
      { name: 'SVG & PDF downloads', free: false, starter: false, pro: true },
    ]
  },
  {
    name: 'Performance & Limits',
    icon: TrendingUp,
    features: [
      { name: 'Scans per month', free: '1,000', starter: '10,000', pro: '500,000' },
      { name: 'Bulk operations', free: false, starter: false, pro: true },
    ]
  },
  {
    name: 'Support',
    icon: Shield,
    features: [
      { name: 'Email support', free: 'Community', starter: 'Business days', pro: 'Priority' },
      { name: 'GDPR compliance', free: true, starter: true, pro: true },
    ]
  },
  {
    name: 'API & Developer',
    icon: Code,
    features: [
      { name: 'Public API (no auth)', free: '100 req/hr', starter: '100 req/hr', pro: '100 req/hr' },
      { name: 'Authenticated REST API', free: false, starter: false, pro: true },
      { name: 'API rate limit (authenticated)', free: false, starter: false, pro: '5,000 req/hr' },
      { name: 'API key management', free: false, starter: false, pro: true },
      { name: 'MCP server (Claude, Cursor, AI agents)', free: false, starter: false, pro: true },
      { name: 'Bulk generation endpoint', free: false, starter: false, pro: true },
      { name: 'OpenAPI spec', free: true, starter: true, pro: true },
    ]
  },
]

export default function PricingPage({ session }: PricingPageProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)
  
  // Track pricing page view
  useEffect(() => {
    trackLandingPage.viewPricing('pricing');
  }, []);

  // Fetch user's current subscription
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/user/subscription')
        .then(res => res.json())
        .then(data => {
          if (data.subscription) {
            setUserSubscription(data.subscription)
          }
        })
        .catch(error => {
          console.error('Error fetching subscription:', error)
        })
        .finally(() => {
          setIsLoadingSubscription(false)
        })
    } else {
      setIsLoadingSubscription(false)
    }
  }, [session])

  // Check if plan is current plan
  const isCurrentPlan = (planId: string) => {
    if (!userSubscription) return false
    
    // Check if it's the same plan
    if (userSubscription.plan === planId) return true
    
    // Check if user is on trial and trying to select the trial plan
    if (userSubscription.status === 'trialing' && planId === userSubscription.plan) return true
    
    return false
  }

  const getPlanButtonText = (planId: string) => {
    if (isCurrentPlan(planId)) {
      if (userSubscription?.status === 'trialing') {
        return 'Trial Active'
      }
      return 'Current Plan'
    }
    return plans.find(p => p.id === planId)?.buttonText || 'Subscribe'
  }

  const handleSubscribe = async (planId: string) => {
    const planName = plans.find(p => p.id === planId)?.name || planId;
    
    // Track signup flow
    if (!session) {
      trackSignup.clickSignupCTA(`Subscribe ${planName}`, 'pricing', 'pricing', planId);
      trackSignup.selectPlan(planId, 'pricing_page');
    } else {
      trackSignup.selectPlan(planId, 'pricing_page');
    }
    
    // If not logged in, redirect to sign up with selected plan
    if (!session) {
      window.location.href = `/auth/signup?plan=${planId}`
      return
    }

    // Don't allow subscribing to current plan
    if (isCurrentPlan(planId)) {
      return
    }

    // Free plan - redirect to dashboard
    if (planId === 'free') {
      window.location.href = '/dashboard'
      return
    }

    setLoading(planId)

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await response.json()

      if (response.ok && data.startTrial) {
        window.location.href = '/dashboard'
        return
      }
      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(null)
    }
  }

  // Helper function to render feature value
  const renderFeatureValue = (value: any) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-500 mx-auto" />
    } else if (value === false) {
      return <X className="h-5 w-5 text-gray-300 mx-auto" />
    }
    return <span className="text-sm text-gray-900 font-medium">{value}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Choose the perfect plan for your QR code needs
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105 ${
                plan.featured ? 'ring-4 ring-blue-500 lg:scale-105' : ''
              }`}
            >
              {plan.featured && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 font-semibold flex items-center justify-center gap-2">
                  <Zap size={16} />
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6 h-12">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-2">/month</span>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || isCurrentPlan(plan.id) || isLoadingSubscription}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isCurrentPlan(plan.id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : plan.featured
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? 'Loading...' : getPlanButtonText(plan.id)}
                </button>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check
                        className="text-green-500 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Feature Comparison Table */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compare Plans Side-by-Side
            </h2>
            <p className="text-xl text-gray-600">
              Detailed breakdown of features across all plans
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 w-1/3">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600 bg-blue-50">Pro</th>
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    {/* Category Header */}
                    <tr className="bg-gray-50 border-y border-gray-200">
                      <td colSpan={4} className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <category.icon className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">{category.name}</span>
                        </div>
                      </td>
                    </tr>
                    {/* Category Features */}
                    {category.features.map((feature, featureIndex) => (
                      <tr key={featureIndex} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-700">{feature.name}</td>
                        <td className="py-4 px-6 text-center">{renderFeatureValue(feature.free)}</td>
                        <td className="py-4 px-6 text-center">{renderFeatureValue(feature.starter)}</td>
                        <td className="py-4 px-6 text-center bg-blue-50/30">{renderFeatureValue(feature.pro)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA Section below table */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Ready to get started?</p>
            <div className="flex justify-center gap-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || isLoadingSubscription}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? 'Loading...' : `${plan.name} Plan`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Developer callout */}
      <div className="bg-gray-950 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-mono mb-3">
                <Code className="h-4 w-4" />
                <span>For developers</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Everything you need to build with QR codes
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Pro unlocks the authenticated REST API (5,000 req/hr), API key management,
                the MCP server for Claude and Cursor, and the bulk endpoint. The public API
                (100 req/hr, no auth) stays free on all plans.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/mcp" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  MCP setup guide →
                </a>
                <a href="/qr-code-api" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  REST API docs →
                </a>
                <a href="/ai-agents" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  AI agent integration →
                </a>
              </div>
            </div>
            <div className="shrink-0 bg-gray-900 border border-gray-700 rounded-xl p-5 text-sm font-mono">
              <p className="text-gray-500 text-xs mb-3">Public API — free, no auth</p>
              <p className="text-green-400 mb-4">POST /api/public/qr-codes</p>
              <p className="text-gray-500 text-xs mb-3">Authenticated API — Pro</p>
              <p className="text-green-400">POST /api/v1/qr-codes</p>
              <p className="text-gray-500 mt-1 text-xs">Authorization: Bearer &lt;api-key&gt;</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Can I use the API without a paid plan?
            </h3>
            <p className="text-gray-600">
              Yes. The public API at <code className="bg-gray-100 px-1 rounded text-sm">/api/public/qr-codes</code> requires
              no auth and is free on all plans at 100 requests/hour per IP. The Pro plan adds
              an authenticated endpoint with 5,000 req/hr, API key management, MCP server access,
              and the bulk endpoint.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              How do I connect Claude or Cursor to theqrcode.io?
            </h3>
            <p className="text-gray-600">
              Add <code className="bg-gray-100 px-1 rounded text-sm">https://mcp.theqrcode.io/mcp</code> as an MCP server
              in your client config. The MCP server is available on the Pro plan. See the{' '}
              <a href="/mcp" className="text-blue-600 hover:underline">MCP setup guide</a> for
              step-by-step instructions for Claude Desktop and Cursor.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Can I change plans later?
            </h3>
            <p className="text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time from your
              dashboard. Changes take effect immediately.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              What happens if I exceed my scan limit?
            </h3>
            <p className="text-gray-600">
              Your QR codes will continue to work, but analytics tracking will
              stop until you upgrade or your monthly limit resets.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Do you offer refunds?
            </h3>
            <p className="text-gray-600">
              Yes, we offer a 30-day money-back guarantee. If you're not
              satisfied, contact us for a full refund.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">
              Is there a free trial?
            </h3>
            <p className="text-gray-600">
              Yes! New users get a 14-day free trial with full access to Pro
              features. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

