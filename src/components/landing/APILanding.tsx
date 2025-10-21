'use client'

import { Code, Zap, Shield, BarChart3, Webhook, CheckCircle2, Terminal, FileCode, Globe, Lock, Activity } from 'lucide-react'
import Link from 'next/link'

export default function APILanding() {
  const features = [
    {
      icon: Code,
      title: 'RESTful API',
      description: 'Clean, well-documented REST API with JSON responses. Easy to integrate with any language or framework.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: '99.9% uptime with low latency. Generate QR codes in milliseconds with our optimized infrastructure.'
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'API key authentication with enterprise-grade security with rate limiting and encryption.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Programmatic access to scan data, device info, location, and custom event tracking.'
    },
    {
      icon: Webhook,
      title: 'Real-time Webhooks',
      description: 'Get instant notifications when QR codes are scanned. Secure webhook delivery with signature verification.'
    }
  ]

  const codeExamples = [
    {
      title: 'Create QR Code',
      language: 'JavaScript',
      code: `const response = await fetch('https://api.theqrcode.io/v1/qr-codes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'url',
    content: 'https://example.com',
    name: 'My QR Code',
    settings: {
      size: 512,
      darkColor: '#000000',
      lightColor: '#ffffff'
    }
  })
});

const qrCode = await response.json();
console.log(qrCode.imageUrl);`
    },
    {
      title: 'Set Up Webhooks',
      language: 'JavaScript',
      code: `// Create webhook for real-time scan notifications
const webhook = await fetch('https://api.theqrcode.io/v1/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Scan Notifications',
    url: 'https://yourapp.com/webhook',
    events: ['scan.created', 'scan.updated']
  })
});

// Verify webhook signature in your endpoint
const signature = req.headers['x-webhook-signature'];
const payload = JSON.stringify(req.body);
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

if (signature === expectedSignature) {
  // Process the webhook event
  console.log('Scan detected:', req.body.data);
}`
    },
    {
      title: 'Get Analytics',
      language: 'Python',
      code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(
    'https://api.theqrcode.io/v1/analytics/qr-code-id',
    headers=headers,
    params={'period': '30d'}
)

analytics = response.json()
print(f"Total scans: {analytics['totalScans']}")
print(f"Top location: {analytics['topLocation']}")`
    }
  ]

  const useCases = [
    {
      icon: Globe,
      title: 'SaaS Platforms',
      description: 'Embed QR code generation into your application. Offer QR features to your users.'
    },
    {
      icon: FileCode,
      title: 'Marketing Automation',
      description: 'Generate campaign-specific QR codes automatically. Track performance in real-time.'
    },
    {
      icon: Activity,
      title: 'Event Management',
      description: 'Create tickets, badges, and check-in codes. Manage thousands of events programmatically.'
    },
    {
      icon: Lock,
      title: 'Enterprise Systems',
      description: 'Integrate with your CRM, ERP, or custom systems. White-label solutions available.'
    }
  ]

  const apiFeatures = [
    'Full CRUD operations for QR codes',
    'Real-time analytics API',
    'Custom branding and styling',
    'Multiple format exports (PNG, SVG, PDF)',
    'Rate limiting: Up to 5000 req/hour (Pro), 10000 req/hour (Business)',
    'API key authentication',
    'Real-time webhook notifications',
    'Secure webhook signature verification',
    'Comprehensive documentation',
    'Sandbox environment for testing',
    '99.9% uptime SLA',
    'Dynamic QR code updates'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-green-900/50 text-green-400 rounded-full text-sm font-semibold mb-6 border border-green-700">
                🚀 API for Developers
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                QR Code API
                <span className="block text-green-400 mt-2">Built for Scale</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Powerful REST API for generating and managing QR codes programmatically. Create, track, and analyze QR codes at scale with comprehensive analytics and real-time webhook notifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => window.location.href = '/auth/signup?plan=pro&utm_source=google&utm_medium=cpc&utm_campaign=api'}
                  className="px-8 py-4 bg-green-500 text-gray-900 text-lg font-semibold rounded-lg hover:bg-green-400 transition-colors shadow-lg"
                >
                  Get API Access →
                </button>
                <button
                  onClick={() => {
                    const section = document.getElementById('api-example');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-gray-600 text-gray-200 text-lg font-semibold rounded-lg hover:border-gray-500 transition-colors bg-gray-800"
                >
                  Try API Example
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-5 w-5 text-green-400" />
                <span className="text-gray-400 text-sm font-mono">API Request Example</span>
              </div>
              <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm border border-gray-700">
                <code className="text-green-400 font-mono">
{`POST /v1/qr-codes
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "type": "url",
  "content": "https://example.com",
  "name": "Campaign QR",
  "settings": {
    "size": 512,
    "format": "png"
  }
}

// Response: 201 Created
{
  "id": "qr_abc123",
  "imageUrl": "https://...",
  "trackingUrl": "https://...",
  "createdAt": "2024-01-15T10:30:00Z"
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-xl text-gray-300">
              Production-ready API with enterprise features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
                <feature.icon className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section id="api-example" className="px-4 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Powerful API
            </h2>
            <p className="text-xl text-gray-300">
              Get started in minutes with our intuitive API design
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{example.title}</h3>
                    <span className="text-sm text-gray-400 font-mono">{example.language}</span>
                  </div>
                </div>
                <pre className="p-6 overflow-x-auto">
                  <code className="text-green-400 text-sm font-mono">
                    {example.code}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for Your Use Case
            </h2>
            <p className="text-xl text-gray-300">
              Integrate QR codes into your application or workflow
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
                <useCase.icon className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Features List */}
      <section className="px-4 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Complete API Features
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Everything you need to build QR code functionality into your application.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {apiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Start Building Today</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-green-700">
                    <span className="text-green-400 font-semibold text-sm">1</span>
                  </div>
                  <span className="text-gray-300">Sign up for Pro plan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-green-700">
                    <span className="text-green-400 font-semibold text-sm">2</span>
                  </div>
                  <span className="text-gray-300">Generate your API key</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-green-700">
                    <span className="text-green-400 font-semibold text-sm">3</span>
                  </div>
                  <span className="text-gray-300">Make your first API call</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-green-700">
                    <span className="text-green-400 font-semibold text-sm">4</span>
                  </div>
                  <span className="text-gray-300">Scale to production</span>
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/auth/signup?plan=pro&utm_source=google&utm_medium=cpc&utm_campaign=api'}
                className="w-full px-8 py-4 bg-green-500 text-gray-900 text-lg font-semibold rounded-lg hover:bg-green-400 transition-colors shadow-lg"
              >
                Get API Access →
              </button>
              <p className="text-center text-gray-400 text-sm mt-4">
                14-day free trial • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple API Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Get started with full API access
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-2xl border-2 border-green-500 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <p className="text-gray-300 mb-6">Everything you need for API access</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-gray-300 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">500 QR codes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">500,000 scans/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Full API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Real-time webhooks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">5,000 requests/hour</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Analytics API</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Custom branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => window.location.href = '/auth/signup?plan=pro&utm_source=google&utm_medium=cpc&utm_campaign=api'}
                className="w-full px-6 py-3 bg-green-500 text-gray-900 font-semibold rounded-lg hover:bg-green-400 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get API access with a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/auth/signup?plan=pro&utm_source=google&utm_medium=cpc&utm_campaign=api'}
              className="px-8 py-4 bg-green-500 text-gray-900 text-lg font-semibold rounded-lg hover:bg-green-400 transition-colors shadow-lg"
            >
              Get API Access →
            </button>
            <button
              onClick={() => window.location.href = '/api'}
              className="px-8 py-4 border-2 border-gray-600 text-gray-200 text-lg font-semibold rounded-lg hover:border-gray-500 transition-colors bg-gray-800"
            >
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6" />
                <span className="text-xl font-bold">TheQRCode.io</span>
              </div>
              <p className="text-gray-400">
                Powerful QR Code API for developers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Developer</h3>
              <ul className="space-y-2">
                <li><Link href="/api" className="text-gray-400 hover:text-white transition-colors">API Docs</Link></li>
                <li><Link href="/api#webhooks" className="text-gray-400 hover:text-white transition-colors">Webhooks</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
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
            <p>© 2024 TheQRCode.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

