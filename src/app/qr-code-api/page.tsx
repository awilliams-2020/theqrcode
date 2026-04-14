import { Metadata } from 'next'
import Link from 'next/link'
import { Terminal, Code, CheckCircle, ExternalLink, Zap, Globe } from 'lucide-react'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code API — No Auth, No Keys, No Signup | TheQRCode.io',
  description: 'Free QR code REST API for developers. No API key or authentication required. 100 requests/hour free. Supports URL, WiFi, contact, and text QR codes. OpenAPI spec available.',
  keywords: [
    'qr code api', 'qr code rest api', 'free qr code api', 'qr code api no authentication',
    'qr code api no signup', 'qr code api no key', 'qr code api developer',
    'programmatic qr code', 'qr code api javascript', 'qr code api python',
    'qr code api curl', 'qr code openapi', 'qr code api free',
  ],
  openGraph: {
    title: 'QR Code API — No Auth, No Keys, No Signup',
    description: 'Free QR code REST API for developers. No authentication required. Integrate in 60 seconds.',
    type: 'website',
    url: 'https://theqrcode.io/qr-code-api',
  },
  alternates: {
    canonical: '/qr-code-api',
  },
}

const curlExample = `curl -X POST https://theqrcode.io/api/public/qr-codes \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "url",
    "content": "https://example.com"
  }'`

const jsExample = `const res = await fetch('https://theqrcode.io/api/public/qr-codes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'url',
    content: 'https://example.com',
  }),
});

const { imageUrl, qrImage } = await res.json();
// imageUrl  — hosted PNG, shareable, valid 24h
// qrImage   — data:image/png;base64,...`

const pyExample = `import requests

res = requests.post(
    'https://theqrcode.io/api/public/qr-codes',
    json={'type': 'url', 'content': 'https://example.com'},
)
data = res.json()
print(data['imageUrl'])   # hosted PNG URL
print(data['qrImage'])    # base64 data URL`

const wifiExample = `curl -X POST https://theqrcode.io/api/public/qr-codes \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "wifi",
    "content": "WIFI:T:WPA;S:MyNetwork;P:MyPassword;;"
  }'`

const customExample = `{
  "type": "url",
  "content": "https://example.com",
  "settings": {
    "size": 512,
    "color": {
      "dark": "#1a1a2e",
      "light": "#ffffff"
    }
  }
}`

const responseExample = `{
  "qrImage": "data:image/png;base64,iVBORw0KGgo...",
  "imageUrl": "https://theqrcode.io/api/public/qr-codes/view/abc123",
  "type": "url",
  "content": "https://example.com",
  "_meta": {
    "apiVersion": "1.0.0",
    "generatedAt": "2025-04-13T12:00:00.000Z"
  }
}`

export default function QRCodeAPIPage() {
  return (
    <>
      <StructuredData
        type="WebAPI"
        data={{
          name: 'TheQRCode.io Public REST API',
          description: 'Free REST API for programmatic QR code generation. No authentication required. Supports URL, WiFi, contact, and text QR codes.',
          documentation: 'https://theqrcode.io/qr-code-api',
          url: 'https://theqrcode.io/api/public/qr-codes',
          apiVersion: '1.0.0',
          serviceType: 'QR Code Generation API',
          areaServed: 'Worldwide',
          authentication: 'None',
          isAccessibleForFree: true,
        }}
      />

      <div className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-gray-950 text-white py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 text-green-400 text-sm font-mono mb-6">
              <Terminal className="h-4 w-4" />
              <span>REST API</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              QR Code API<br />
              <span className="text-green-400">No auth. No keys. No signup.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-10">
              One endpoint. POST some JSON. Get a QR code. Works from any language in under a minute.
            </p>

            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden mb-10 max-w-2xl">
              <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">POST</span>
                <code className="text-gray-300 font-mono text-sm">https://theqrcode.io/api/public/qr-codes</code>
              </div>
              <div className="px-4 py-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> No auth</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> 100 req/hr free</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> JSON in, PNG out</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#quickstart" className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors">
                Quick start ↓
              </a>
              <a href="/api/public/qr-codes/openapi.json" className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                OpenAPI spec <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">100</p>
                <p className="text-gray-500 text-sm mt-1">requests/hour free</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4</p>
                <p className="text-gray-500 text-sm mt-1">QR code types</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-gray-500 text-sm mt-1">required headers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick start */}
        <section id="quickstart" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick start</h2>
            <p className="text-gray-500 mb-10">Three ways to make your first request.</p>

            <div className="space-y-8">
              <div>
                <div className="mb-3">
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-mono">curl</span>
                </div>
                <div className="bg-gray-950 rounded-xl overflow-hidden">
                  <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{curlExample}</pre>
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-mono">JavaScript</span>
                </div>
                <div className="bg-gray-950 rounded-xl overflow-hidden">
                  <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{jsExample}</pre>
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-mono">Python</span>
                </div>
                <div className="bg-gray-950 rounded-xl overflow-hidden">
                  <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{pyExample}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoint reference */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Endpoint reference</h2>
            <p className="text-gray-500 mb-10">One endpoint handles all QR code types.</p>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="font-mono text-gray-900">/api/public/qr-codes</code>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Request body</h3>
                <table className="w-full text-sm mb-8">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium w-36">Field</th>
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium w-20">Type</th>
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium w-20">Required</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">type</td>
                      <td className="py-3 pr-4 text-gray-500">enum</td>
                      <td className="py-3 pr-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                      <td className="py-3 text-gray-600">
                        <code className="bg-gray-100 px-1 rounded text-xs">url</code>{' '}
                        <code className="bg-gray-100 px-1 rounded text-xs">wifi</code>{' '}
                        <code className="bg-gray-100 px-1 rounded text-xs">contact</code>{' '}
                        <code className="bg-gray-100 px-1 rounded text-xs">text</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">content</td>
                      <td className="py-3 pr-4 text-gray-500">string</td>
                      <td className="py-3 pr-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                      <td className="py-3 text-gray-600">Data to encode</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">settings.size</td>
                      <td className="py-3 pr-4 text-gray-500">integer</td>
                      <td className="py-3 pr-4 text-gray-400">—</td>
                      <td className="py-3 text-gray-600">64–1024px. Default 256</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">settings.color.dark</td>
                      <td className="py-3 pr-4 text-gray-500">string</td>
                      <td className="py-3 pr-4 text-gray-400">—</td>
                      <td className="py-3 text-gray-600">Hex, e.g. <code className="bg-gray-100 px-1 rounded text-xs">#000000</code></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">settings.color.light</td>
                      <td className="py-3 pr-4 text-gray-500">string</td>
                      <td className="py-3 pr-4 text-gray-400">—</td>
                      <td className="py-3 text-gray-600">Background hex color</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="font-semibold text-gray-900 mb-3">Response</h3>
                <div className="bg-gray-950 rounded-xl overflow-hidden mb-6">
                  <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{responseExample}</pre>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">Rate limit headers</h3>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3 font-mono">
                    <p className="text-purple-700 text-xs">X-RateLimit-Limit</p>
                    <p className="text-gray-500 text-xs mt-1">100</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 font-mono">
                    <p className="text-purple-700 text-xs">X-RateLimit-Remaining</p>
                    <p className="text-gray-500 text-xs mt-1">requests left in window</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 font-mono">
                    <p className="text-purple-700 text-xs">X-RateLimit-Reset</p>
                    <p className="text-gray-500 text-xs mt-1">Unix timestamp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Type examples */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">QR code types</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <span className="font-mono font-semibold text-gray-900 text-sm">url</span>
                  <span className="ml-3 text-gray-400 text-xs">Any web URL</span>
                </div>
                <div className="bg-gray-950 p-4">
                  <pre className="text-green-300 font-mono text-xs overflow-x-auto">{`{ "type": "url", "content": "https://example.com" }`}</pre>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <span className="font-mono font-semibold text-gray-900 text-sm">wifi</span>
                  <span className="ml-3 text-gray-400 text-xs">WPA/WPA2 networks</span>
                </div>
                <div className="bg-gray-950 p-4">
                  <pre className="text-green-300 font-mono text-xs overflow-x-auto">{`{ "type": "wifi",\n  "content": "WIFI:T:WPA;S:MyNet;P:pass;;" }`}</pre>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <span className="font-mono font-semibold text-gray-900 text-sm">contact</span>
                  <span className="ml-3 text-gray-400 text-xs">vCard 3.0</span>
                </div>
                <div className="bg-gray-950 p-4">
                  <pre className="text-green-300 font-mono text-xs overflow-x-auto">{`{ "type": "contact",\n  "content": "BEGIN:VCARD\\nFN:Jane Doe\\nEMAIL:jane@example.com\\nEND:VCARD" }`}</pre>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <span className="font-mono font-semibold text-gray-900 text-sm">text</span>
                  <span className="ml-3 text-gray-400 text-xs">Plain string</span>
                </div>
                <div className="bg-gray-950 p-4">
                  <pre className="text-green-300 font-mono text-xs overflow-x-auto">{`{ "type": "text", "content": "Table 12" }`}</pre>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-900 text-sm">Custom colors + size</span>
              </div>
              <div className="bg-gray-950 p-4">
                <pre className="text-green-300 font-mono text-sm overflow-x-auto">{customExample}</pre>
              </div>
            </div>

            <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-900 text-sm">WiFi — full curl example</span>
              </div>
              <div className="bg-gray-950 p-4">
                <pre className="text-green-300 font-mono text-sm overflow-x-auto">{wifiExample}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Rate limits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Rate limits</h2>
            <p className="text-gray-500 mb-10">Free tier is per-IP. Paid plans unlock higher limits and authenticated endpoints.</p>

            <div className="overflow-hidden border border-gray-200 rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Tier</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Rate limit</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Auth</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Dynamic codes</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Free</td>
                    <td className="px-6 py-4 text-gray-600">100 req/hr per IP</td>
                    <td className="px-6 py-4 text-gray-400">None</td>
                    <td className="px-6 py-4 text-gray-400">—</td>
                    <td className="px-6 py-4 text-gray-400">—</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-6 py-4 font-semibold text-purple-900">Pro <span className="text-xs font-normal text-purple-600">$29/mo</span></td>
                    <td className="px-6 py-4 text-gray-600">5,000 req/hr</td>
                    <td className="px-6 py-4 text-gray-600">API key</td>
                    <td className="px-6 py-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                    <td className="px-6 py-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-4">
              <Link href="/pricing" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-sm transition-colors">
                See pricing
              </Link>
              <a href="/api/public/qr-codes/openapi.json" className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
                OpenAPI spec <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Also available */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Also available</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link href="/mcp" className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Zap className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">MCP Server</h3>
                <p className="text-gray-500 text-sm">For Claude, Cursor, and AI agents. No API calls — just ask.</p>
              </Link>
              <Link href="/ai-agents" className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Code className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">AI Agents guide</h3>
                <p className="text-gray-500 text-sm">Function calling, OpenAI plugin, and MCP integration examples.</p>
              </Link>
              <a href="/api/public/qr-codes/openapi.json" className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Globe className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">OpenAPI spec</h3>
                <p className="text-gray-500 text-sm">Import into Postman, Insomnia, or generate a typed SDK.</p>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-950 text-white">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Start building</h2>
            <p className="text-gray-400 mb-8">No account. No key. One endpoint.</p>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 inline-block mb-8">
              <div className="flex items-center gap-3">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">POST</span>
                <code className="text-green-400 font-mono">https://theqrcode.io/api/public/qr-codes</code>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#quickstart" className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors">
                View quick start
              </a>
              <Link href="/pricing" className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors">
                See paid plans
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
