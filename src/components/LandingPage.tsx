'use client'

import { useEffect } from 'react'
import { QrCode, BarChart3, Zap, Shield, Terminal, Cpu, Code } from 'lucide-react'
import Link from 'next/link'
import { trackSignup, trackLandingPage } from '@/lib/matomo-tracking'
import PublicQRGenerator from './PublicQRGenerator'

export default function LandingPage() {
  useEffect(() => {
    trackLandingPage.view('home');
  }, []);

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out QR codes',
      features: ['10 QR codes', '1,000 scans per month', 'Basic analytics', 'URL, Text, WiFi, Contact types', 'Basic customization'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Starter',
      price: '$9',
      period: 'per month',
      description: 'Great for small businesses',
      features: ['100 QR codes', '10,000 scans per month', 'Advanced analytics', 'All QR code types', 'Custom styling', 'Email support'],
      cta: 'Subscribe',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For developers and growing companies',
      features: ['500 QR codes', '500,000 scans per month', 'Real-time analytics', 'All QR code types', 'Advanced customization', 'Priority support', 'REST API — 5,000 req/hr', 'API key auth', 'MCP server (Claude, Cursor)'],
      cta: 'Subscribe',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-gray-950 text-white px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-purple-400 text-sm font-mono mb-6">
            <Terminal className="h-4 w-4" />
            <span>QR code API · MCP server · REST API</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The QR code API built for<br />
            <span className="text-purple-400">developers and AI agents</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            No auth required. MCP ready. Integrate in 60 seconds.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/mcp"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Cpu className="h-4 w-4" /> MCP setup for Claude &amp; Cursor
            </Link>
            <Link
              href="/qr-code-api"
              className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Code className="h-4 w-4" /> REST API docs
            </Link>
          </div>

          {/* Quick start snippet */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono flex items-center gap-2">
                <Terminal className="h-3 w-3" /> REST API — no auth
              </div>
              <pre className="p-4 text-green-300 font-mono text-xs overflow-x-auto">{`curl -X POST \\
  https://theqrcode.io/api/public/qr-codes \\
  -d '{"type":"url",
       "content":"https://example.com"}'`}</pre>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono flex items-center gap-2">
                <Cpu className="h-3 w-3" /> MCP server URL
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 font-mono mb-2">claude_desktop_config.json</p>
                <pre className="text-green-300 font-mono text-xs overflow-x-auto">{`{
  "mcpServers": {
    "theqrcode": {
      "url": "https://mcp
             .theqrcode.io/mcp"
    }
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three value props ── */}
      <section className="px-4 py-14 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <Zap className="h-7 w-7 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">No auth, ever</h3>
              <p className="text-gray-500 text-sm">100 req/hr free. No API key, no account, no credit card. Just POST and go.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Cpu className="h-7 w-7 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">MCP ready</h3>
              <p className="text-gray-500 text-sm">Remote HTTP/SSE MCP server. Claude and Cursor call it automatically — no code needed.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <BarChart3 className="h-7 w-7 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Dynamic + analytics</h3>
              <p className="text-gray-500 text-sm">Edit redirect URLs after printing. Track scans by device, location, and time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer links ── */}
      <section className="px-4 py-14 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">For developers &amp; AI builders</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Link href="/mcp" className="bg-gray-950 rounded-xl p-6 hover:ring-2 hover:ring-purple-500 transition-all group">
              <Cpu className="h-7 w-7 text-purple-400 mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">MCP Server</h3>
              <p className="text-gray-400 text-sm mb-3">For Claude, Cursor, and any MCP client. Setup in 60 seconds.</p>
              <span className="text-purple-400 text-sm">Setup guide →</span>
            </Link>
            <Link href="/qr-code-api" className="bg-gray-950 rounded-xl p-6 hover:ring-2 hover:ring-green-500 transition-all group">
              <Terminal className="h-7 w-7 text-green-400 mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">REST API</h3>
              <p className="text-gray-400 text-sm mb-3">No auth. curl, JS, Python. OpenAPI spec available.</p>
              <span className="text-green-400 text-sm">API docs →</span>
            </Link>
            <Link href="/ai-agents" className="bg-gray-950 rounded-xl p-6 hover:ring-2 hover:ring-blue-500 transition-all group">
              <Code className="h-7 w-7 text-blue-400 mb-3" />
              <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">AI Agents</h3>
              <p className="text-gray-400 text-sm mb-3">Function calling, LangChain, OpenAI plugin — all covered.</p>
              <span className="text-blue-400 text-sm">Integration guide →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Free generator (below the fold) ── */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Try it free — no signup
            </h2>
            <p className="text-gray-500">
              Generate a QR code right now. Or hit the API directly — same engine.
            </p>
          </div>
          <PublicQRGenerator allowedTypes={['url', 'text', 'wifi', 'contact']} />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything you need
            </h2>
            <p className="text-gray-500">
              Built for developers, works for everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Terminal, title: 'REST API', desc: 'No-auth public endpoint plus authenticated Pro API. OpenAPI spec included.' },
              { icon: Cpu, title: 'MCP Server', desc: 'Remote HTTP/SSE server for Claude, Cursor, and any MCP-compatible AI client.' },
              { icon: BarChart3, title: 'Analytics', desc: 'Scan counts, device breakdown, location, and time — all in real-time.' },
              { icon: Shield, title: 'Dynamic codes', desc: 'Edit the destination URL after the code is printed. No reprint needed.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <f.icon className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-gray-500">Free to start. Pro unlocks the full API.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-purple-500 lg:scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 font-semibold flex items-center justify-center gap-2 text-sm">
                    <Zap size={14} /> Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 h-10">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-gray-500 ml-2">/{plan.period.replace('per ', '')}</span>}
                  </div>
                  <button
                    onClick={() => {
                      const planId = plan.name.toLowerCase()
                      trackSignup.clickSignupCTA(plan.cta, 'pricing', 'home', planId)
                      trackSignup.selectPlan(planId, 'landing_page')
                      setTimeout(() => { window.location.href = `/auth/signup?plan=${planId}` }, 150)
                    }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </button>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <svg className="text-green-500 flex-shrink-0 mt-0.5" width={18} height={18} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-gray-400 text-sm">
            <Link href="/pricing" className="hover:text-gray-600 underline underline-offset-2">Full feature comparison →</Link>
          </p>
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link href="/mcp" className="bg-gray-950 rounded-xl p-5 hover:ring-2 hover:ring-purple-500 transition-all">
              <h3 className="font-semibold text-white mb-1 text-sm">MCP Setup Guide</h3>
              <p className="text-gray-400 text-xs">Connect Claude Desktop or Cursor in 60 seconds.</p>
            </Link>
            <Link href="/qr-code-api" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">REST API Docs</h3>
              <p className="text-gray-500 text-xs">curl, JS, Python — no auth, 100 req/hr free.</p>
            </Link>
            <Link href="/ai-agents" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">AI Agent Integration</h3>
              <p className="text-gray-500 text-xs">Function calling, LangChain, OpenAI plugin examples.</p>
            </Link>
            <Link href="/qr-code-generator" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Free QR Generator</h3>
              <p className="text-gray-500 text-xs">No signup. URL, WiFi, contacts, and more.</p>
            </Link>
            <Link href="/blog/do-qr-codes-expire" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Do QR Codes Expire?</h3>
              <p className="text-gray-500 text-xs">Static vs dynamic — what you need to know.</p>
            </Link>
            <Link href="/pricing" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">Pricing</h3>
              <p className="text-gray-500 text-xs">Free forever or upgrade for API + analytics.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="h-6 w-6" />
                <span className="text-xl font-bold">TheQRCode.io</span>
              </div>
              <p className="text-gray-400 text-sm">
                QR code API for developers and AI agents. No auth required.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wide">Developers</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mcp" className="text-gray-400 hover:text-white transition-colors">MCP Server</Link></li>
                <li><Link href="/qr-code-api" className="text-gray-400 hover:text-white transition-colors">REST API</Link></li>
                <li><Link href="/ai-agents" className="text-gray-400 hover:text-white transition-colors">AI Agents</Link></li>
                <li><a href="/api/public/qr-codes/openapi.json" className="text-gray-400 hover:text-white transition-colors">OpenAPI Spec</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wide">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/qr-code-generator" className="text-gray-400 hover:text-white transition-colors">QR Generator</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wide">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 TheQRCode.io. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
