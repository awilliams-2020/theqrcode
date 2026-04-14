import { Metadata } from 'next'
import Link from 'next/link'
import { Terminal, Zap, Code, CheckCircle, ExternalLink, Cpu, Globe } from 'lucide-react'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code MCP Server for Claude, Cursor & AI Agents | TheQRCode.io',
  description: 'Add QR code generation to Claude, Cursor, and any MCP-compatible AI agent in 60 seconds. Remote HTTP server — no local install. Supports URL, WiFi, contact, and text QR codes.',
  keywords: [
    'qr code mcp server', 'mcp qr code', 'claude qr code', 'cursor qr code',
    'model context protocol qr code', 'ai agent qr code', 'mcp tool qr code',
    'qr code for claude desktop', 'qr code mcp tool', 'generate qr code ai agent',
  ],
  openGraph: {
    title: 'QR Code MCP Server for Claude, Cursor & AI Agents',
    description: 'Add QR code generation to any MCP-compatible AI agent in 60 seconds. Remote HTTP server — no local install required.',
    type: 'website',
    url: 'https://theqrcode.io/mcp',
  },
  alternates: {
    canonical: '/mcp',
  },
}

const claudeDesktopConfig = `{
  "mcpServers": {
    "theqrcode": {
      "url": "https://mcp.theqrcode.io/mcp"
    }
  }
}`

const cursorConfig = `{
  "mcpServers": {
    "theqrcode": {
      "url": "https://mcp.theqrcode.io/mcp"
    }
  }
}`

const examplePrompts = [
  'Generate a QR code for https://mysite.com',
  'Make a WiFi QR code for my network "HomeNetwork" with password "secret123"',
  'Create a QR code for my contact info — name John Doe, email john@example.com',
  'Generate a dark blue QR code for https://example.com, 512px',
  'Create a QR code with the text "Table 12" for my restaurant',
]

const toolSchema = `{
  "name": "generate_qr_code",
  "description": "Generate a QR code image. Use this whenever a user asks to create, make, or generate a QR code for a URL, website, WiFi network, contact card, or text. Returns a hosted image URL (valid 24 hours) and a base64 PNG for inline display.",
  "parameters": {
    "type": {
      "type": "string",
      "enum": ["url", "wifi", "contact", "text"],
      "required": true
    },
    "content": {
      "type": "string",
      "required": true,
      "description": "Data to encode"
    },
    "size": {
      "type": "integer",
      "min": 64,
      "max": 1024,
      "default": 256
    },
    "darkColor": {
      "type": "string",
      "example": "#000000"
    },
    "lightColor": {
      "type": "string",
      "example": "#FFFFFF"
    }
  }
}`

export default function MCPPage() {
  return (
    <>
      <StructuredData
        type="WebAPI"
        data={{
          name: 'TheQRCode.io MCP Server',
          description: 'Model Context Protocol server for QR code generation. Compatible with Claude, Cursor, and any MCP-compatible AI agent.',
          documentation: 'https://theqrcode.io/mcp',
          url: 'https://mcp.theqrcode.io/mcp',
          apiVersion: '1.0.0',
          serviceType: 'MCP Server',
          areaServed: 'Worldwide',
          authentication: 'None',
          isAccessibleForFree: true,
        }}
      />

      <div className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-gray-950 text-white py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-mono mb-6">
              <Terminal className="h-4 w-4" />
              <span>Model Context Protocol</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              QR Code MCP Server<br />
              <span className="text-purple-400">for Claude, Cursor &amp; AI Agents</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-10">
              One URL. No install. Add QR code generation to any MCP-compatible AI client in under a minute.
            </p>

            {/* The money line */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-10 max-w-2xl">
              <p className="text-xs text-gray-500 font-mono mb-3">MCP server URL</p>
              <div className="flex items-center gap-3">
                <code className="text-green-400 font-mono text-lg flex-1">https://mcp.theqrcode.io/mcp</code>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">HTTP/SSE</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#setup"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
              >
                Setup guide ↓
              </a>
              <Link
                href="/qr-code-api"
                className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors"
              >
                REST API docs
              </Link>
            </div>
          </div>
        </section>

        {/* Why MCP */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Zap className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Remote — no install</h3>
                <p className="text-gray-600 text-sm">
                  Runs over HTTP/SSE. Point your client at a URL — nothing to run locally, no npm, no Docker.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Cpu className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Works in context</h3>
                <p className="text-gray-600 text-sm">
                  Claude and Cursor call the tool automatically when you ask for a QR code — no manual API calls.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <Globe className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No auth, no limits*</h3>
                <p className="text-gray-600 text-sm">
                  Free to use. No API keys, no signup. Rate limited to 100 requests/hour per IP.{' '}
                  <Link href="/pricing" className="text-purple-600 hover:underline">Upgrade</Link> for more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Setup */}
        <section id="setup" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Setup</h2>
            <p className="text-gray-500 mb-12">Pick your client and paste the config.</p>

            {/* Claude Desktop */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">Claude Desktop</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Open <strong>Settings → Developer → Edit Config</strong> and add the <code className="bg-gray-100 px-1 rounded">mcpServers</code> block:
              </p>
              <div className="bg-gray-950 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                  <span className="text-xs text-gray-500 font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</span>
                </div>
                <pre className="p-5 text-sm text-green-300 font-mono overflow-x-auto">{claudeDesktopConfig}</pre>
              </div>
            </div>

            {/* Cursor */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Cursor</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Open <strong>Cursor Settings → MCP → Add new MCP server</strong> and paste the URL, or edit <code className="bg-gray-100 px-1 rounded">~/.cursor/mcp.json</code> directly:
              </p>
              <div className="bg-gray-950 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                  <span className="text-xs text-gray-500 font-mono">~/.cursor/mcp.json</span>
                </div>
                <pre className="p-5 text-sm text-green-300 font-mono overflow-x-auto">{cursorConfig}</pre>
              </div>
            </div>

            {/* Other clients */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Other MCP clients</h3>
              <p className="text-gray-600 text-sm">
                Any client that supports the <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">MCP spec</a> with remote HTTP/SSE transport works.
                Point it at <code className="bg-white border border-gray-200 px-2 py-0.5 rounded font-mono text-sm">https://mcp.theqrcode.io/mcp</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Example prompts */}
        <section className="py-20 bg-gray-950 text-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">Try it</h2>
            <p className="text-gray-400 mb-10">
              Once connected, just ask. These prompts trigger the tool automatically.
            </p>
            <div className="space-y-3">
              {examplePrompts.map((prompt, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-900 rounded-lg px-5 py-4 border border-gray-800">
                  <span className="text-purple-400 font-mono text-sm mt-0.5">›</span>
                  <p className="text-gray-200 font-mono text-sm">{prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool reference */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tool reference</h2>
            <p className="text-gray-500 mb-10">One tool. All QR code types.</p>

            {/* generate_qr_code */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-10">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                <Code className="h-5 w-5 text-purple-600" />
                <span className="font-mono font-semibold text-gray-900">generate_qr_code</span>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Generates a QR code image and returns both a hosted URL (shareable, valid 24 hours) and a base64 PNG for inline display.
                </p>

                <table className="w-full text-sm mb-8">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium w-32">Parameter</th>
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium w-24">Type</th>
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium w-20">Required</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">type</td>
                      <td className="py-3 pr-4 text-gray-500">enum</td>
                      <td className="py-3 pr-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                      <td className="py-3 text-gray-600"><code className="bg-gray-100 px-1 rounded text-xs">url</code> · <code className="bg-gray-100 px-1 rounded text-xs">wifi</code> · <code className="bg-gray-100 px-1 rounded text-xs">contact</code> · <code className="bg-gray-100 px-1 rounded text-xs">text</code></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">content</td>
                      <td className="py-3 pr-4 text-gray-500">string</td>
                      <td className="py-3 pr-4"><CheckCircle className="h-4 w-4 text-green-500" /></td>
                      <td className="py-3 text-gray-600">Data to encode — URL, WiFi string, vCard, or plain text</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">size</td>
                      <td className="py-3 pr-4 text-gray-500">integer</td>
                      <td className="py-3 pr-4 text-gray-400">—</td>
                      <td className="py-3 text-gray-600">Output size in pixels (64–1024). Default: 256</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">darkColor</td>
                      <td className="py-3 pr-4 text-gray-500">string</td>
                      <td className="py-3 pr-4 text-gray-400">—</td>
                      <td className="py-3 text-gray-600">Hex color for dark modules. Default: <code className="bg-gray-100 px-1 rounded text-xs">#000000</code></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-mono text-purple-700">lightColor</td>
                      <td className="py-3 pr-4 text-gray-500">string</td>
                      <td className="py-3 pr-4 text-gray-400">—</td>
                      <td className="py-3 text-gray-600">Hex color for background. Default: <code className="bg-gray-100 px-1 rounded text-xs">#FFFFFF</code></td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="font-semibold text-gray-900 mb-3 text-sm">WiFi content format</h4>
                <div className="bg-gray-950 rounded-lg p-4 mb-6">
                  <pre className="text-green-300 font-mono text-sm">WIFI:T:WPA;S:MyNetwork;P:MyPassword;;</pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Full schema</h4>
                <div className="bg-gray-950 rounded-lg overflow-hidden">
                  <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{toolSchema}</pre>
                </div>
              </div>
            </div>

            {/* Response */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <span className="font-mono font-semibold text-gray-900 text-sm">Response</span>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex gap-4 items-start">
                  <code className="font-mono text-purple-700 w-28 shrink-0">imageUrl</code>
                  <p className="text-gray-600">Hosted PNG URL — shareable, expires in 24 hours</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="font-mono text-purple-700 w-28 shrink-0">image (base64)</code>
                  <p className="text-gray-600">Inline PNG for clients that render images directly</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Also available</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link
                href="/qr-code-api"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <Code className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">REST API</h3>
                <p className="text-gray-500 text-sm">Direct HTTP — no MCP client needed. Works from any language.</p>
                <span className="text-purple-600 text-sm mt-3 inline-flex items-center gap-1">
                  View docs <ExternalLink className="h-3 w-3" />
                </span>
              </Link>
              <a
                href="/api/public/qr-codes/openapi.json"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <Terminal className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">OpenAPI Spec</h3>
                <p className="text-gray-500 text-sm">Import into Postman, Insomnia, or generate a typed client.</p>
                <span className="text-purple-600 text-sm mt-3 inline-flex items-center gap-1">
                  openapi.json <ExternalLink className="h-3 w-3" />
                </span>
              </a>
              <Link
                href="/for-ai-assistants"
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <Cpu className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">AI Plugin Manifest</h3>
                <p className="text-gray-500 text-sm">OpenAI plugin format for function-calling integrations.</p>
                <span className="text-purple-600 text-sm mt-3 inline-flex items-center gap-1">
                  View manifest <ExternalLink className="h-3 w-3" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-950 text-white">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to connect?</h2>
            <p className="text-gray-400 mb-8">
              Add the server URL to your MCP client config and start generating QR codes from any conversation.
            </p>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 inline-block mb-8">
              <code className="text-green-400 font-mono">https://mcp.theqrcode.io/mcp</code>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#setup" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors">
                Setup guide
              </a>
              <Link href="/pricing" className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors">
                See pricing
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
