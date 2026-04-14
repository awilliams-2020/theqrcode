import { Metadata } from 'next'
import Link from 'next/link'
import { Cpu, Terminal, Code, ExternalLink, Zap, CheckCircle } from 'lucide-react'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code Generation for AI Agents | MCP, Function Calling & REST API | TheQRCode.io',
  description: 'Integrate QR code generation into your AI agent or assistant. Supports MCP (Claude, Cursor), OpenAI function calling, and direct REST API. No auth required.',
  keywords: [
    'ai agent qr code', 'qr code for ai agents', 'llm qr code', 'function calling qr code',
    'openai function calling qr code', 'qr code mcp', 'claude qr code', 'cursor qr code',
    'ai assistant qr code api', 'qr code generation ai', 'qr code tool ai',
    'qr code openai plugin', 'ai qr code generator', 'qr code langchain',
  ],
  openGraph: {
    title: 'QR Code Generation for AI Agents',
    description: 'MCP server, function calling schema, and REST API for AI agents. No auth required.',
    type: 'website',
    url: 'https://theqrcode.io/ai-agents',
  },
  alternates: {
    canonical: '/ai-agents',
  },
}

const mcpConfig = `{
  "mcpServers": {
    "theqrcode": {
      "url": "https://mcp.theqrcode.io/mcp"
    }
  }
}`

const openAIFunctionSchema = `{
  "name": "generate_qr_code",
  "description": "Generate a QR code image for a URL, WiFi network, contact card, or text. Returns a hosted image URL and a base64 PNG.",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["url", "wifi", "contact", "text"],
        "description": "QR code type"
      },
      "content": {
        "type": "string",
        "description": "Data to encode. For wifi use format: WIFI:T:WPA;S:<ssid>;P:<password>;;"
      },
      "size": {
        "type": "integer",
        "minimum": 64,
        "maximum": 1024,
        "description": "Output size in pixels. Defaults to 256."
      }
    },
    "required": ["type", "content"]
  }
}`

const functionCallImpl = `async function generate_qr_code({ type, content, size = 256 }) {
  const res = await fetch('https://theqrcode.io/api/public/qr-codes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content, settings: { size } }),
  });
  const data = await res.json();
  return {
    imageUrl: data.imageUrl,   // shareable hosted URL, valid 24h
    qrImage: data.qrImage,     // base64 PNG for inline display
  };
}`

const langchainTool = `from langchain.tools import tool
import requests

@tool
def generate_qr_code(type: str, content: str, size: int = 256) -> dict:
    """Generate a QR code. type: url|wifi|contact|text. content: data to encode."""
    res = requests.post(
        'https://theqrcode.io/api/public/qr-codes',
        json={'type': type, 'content': content, 'settings': {'size': size}},
    )
    data = res.json()
    return {'imageUrl': data['imageUrl'], 'qrImage': data['qrImage']}`

const openaiClientExample = `import OpenAI from 'openai';

const client = new OpenAI();

const tools = [{
  type: 'function',
  function: {
    name: 'generate_qr_code',
    description: 'Generate a QR code image for a URL, WiFi network, contact card, or text.',
    parameters: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['url', 'wifi', 'contact', 'text'] },
        content: { type: 'string' },
        size: { type: 'integer', minimum: 64, maximum: 1024 },
      },
      required: ['type', 'content'],
    },
  },
}];

// When the model calls generate_qr_code, execute it:
async function handleToolCall(toolCall) {
  const args = JSON.parse(toolCall.function.arguments);
  const res = await fetch('https://theqrcode.io/api/public/qr-codes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: args.type, content: args.content }),
  });
  return res.json();
}`

const integrationOptions = [
  {
    name: 'MCP (recommended)',
    badge: 'Claude · Cursor · any MCP client',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'Zero code required. Add the server URL to your MCP client config — the AI calls the tool automatically when asked.',
    effort: 'Config change only',
    effortColor: 'text-green-600',
  },
  {
    name: 'OpenAI function calling',
    badge: 'GPT-4 · GPT-4o · compatible models',
    badgeColor: 'bg-green-100 text-green-800',
    description: 'Define the function schema, implement the handler to call the REST API, and pass it in the tools array.',
    effort: '~20 lines',
    effortColor: 'text-yellow-600',
  },
  {
    name: 'LangChain / LlamaIndex',
    badge: 'Python · TypeScript',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Wrap the REST API as a @tool or Tool object and add it to your agent\'s tool list.',
    effort: '~10 lines',
    effortColor: 'text-green-600',
  },
  {
    name: 'Direct REST API',
    badge: 'Any stack',
    badgeColor: 'bg-gray-100 text-gray-700',
    description: 'Call the endpoint directly from your agent\'s action handler. No schema or framework needed.',
    effort: '1 fetch call',
    effortColor: 'text-green-600',
  },
]

export default function AIAgentsPage() {
  return (
    <>
      <StructuredData
        type="WebAPI"
        data={{
          name: 'TheQRCode.io AI Agent Integration',
          description: 'QR code generation API for AI agents. Supports MCP, OpenAI function calling, LangChain, and direct REST API.',
          documentation: 'https://theqrcode.io/ai-agents',
          url: 'https://theqrcode.io/api/public/qr-codes',
          apiVersion: '1.0.0',
          serviceType: 'AI Tool / QR Code API',
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
              <Cpu className="h-4 w-4" />
              <span>AI Agent Integration</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              QR code generation<br />
              <span className="text-purple-400">for AI agents</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-10">
              Add QR code generation to any AI agent or assistant. Works via MCP, function calling, LangChain, or direct REST — no auth required.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#mcp" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors">
                MCP setup ↓
              </a>
              <a href="#function-calling" className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors">
                Function calling ↓
              </a>
            </div>
          </div>
        </section>

        {/* Integration options overview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Pick your integration method</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {integrationOptions.map((opt) => (
                <div key={opt.name} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{opt.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{opt.description}</p>
                  <p className={`text-xs font-semibold ${opt.effortColor}`}>Integration effort: {opt.effort}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MCP */}
        <section id="mcp" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">MCP</h2>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">Recommended</span>
            </div>
            <p className="text-gray-500 mb-10">
              The fastest path. Claude, Cursor, and other MCP clients pick up the tool automatically — no code required.
            </p>

            <div className="bg-gray-950 rounded-xl overflow-hidden mb-6">
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono">
                claude_desktop_config.json · ~/.cursor/mcp.json
              </div>
              <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{mcpConfig}</pre>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
              <p className="text-purple-900 text-sm">
                After adding the config, restart your client and ask: <em>"Generate a QR code for https://example.com"</em> — the tool fires automatically.
              </p>
            </div>

            <Link href="/mcp" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Full MCP setup guide <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Function calling */}
        <section id="function-calling" className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">OpenAI function calling</h2>
            <p className="text-gray-500 mb-10">Works with GPT-4, GPT-4o, and any model that supports the tools API.</p>

            <h3 className="font-semibold text-gray-900 mb-3">1. Function schema</h3>
            <div className="bg-gray-950 rounded-xl overflow-hidden mb-8">
              <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{openAIFunctionSchema}</pre>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3">2. Implementation</h3>
            <div className="bg-gray-950 rounded-xl overflow-hidden mb-8">
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono">JavaScript</div>
              <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{functionCallImpl}</pre>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3">3. Full example with OpenAI client</h3>
            <div className="bg-gray-950 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono">JavaScript · openai SDK</div>
              <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{openaiClientExample}</pre>
            </div>
          </div>
        </section>

        {/* LangChain */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">LangChain / LlamaIndex</h2>
            <p className="text-gray-500 mb-10">Wrap the REST API as a tool and add it to your agent.</p>

            <div className="bg-gray-950 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-800 text-xs text-gray-500 font-mono">Python · LangChain</div>
              <pre className="p-5 text-green-300 font-mono text-sm overflow-x-auto">{langchainTool}</pre>
            </div>
          </div>
        </section>

        {/* What the tool returns */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What the tool returns</h2>
            <p className="text-gray-500 mb-10">Two formats — use whichever fits your agent's output channel.</p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900">Hosted image URL</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  A shareable <code className="bg-gray-100 px-1 rounded text-xs">imageUrl</code> pointing to a hosted PNG. Valid for 24 hours. Best for: sharing in chat, embedding in markdown, returning as a link.
                </p>
                <code className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded">data.imageUrl</code>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900">Base64 PNG</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  A <code className="bg-gray-100 px-1 rounded text-xs">qrImage</code> data URL for inline rendering. Best for: displaying in UI, passing to vision models, saving locally.
                </p>
                <code className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded">data.qrImage</code>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">All integration resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/mcp" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Cpu className="h-7 w-7 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-purple-700 transition-colors">MCP Server</h3>
                <p className="text-gray-500 text-xs">Claude · Cursor · MCP clients</p>
              </Link>
              <Link href="/qr-code-api" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Terminal className="h-7 w-7 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-purple-700 transition-colors">REST API</h3>
                <p className="text-gray-500 text-xs">Any language · No auth</p>
              </Link>
              <a href="/api/public/qr-codes/openapi.json" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Code className="h-7 w-7 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-purple-700 transition-colors">OpenAPI spec</h3>
                <p className="text-gray-500 text-xs">Postman · typed SDKs</p>
              </a>
              <a href="/api/public/qr-codes/.well-known/ai-plugin.json" className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group">
                <Zap className="h-7 w-7 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-purple-700 transition-colors">AI Plugin manifest</h3>
                <p className="text-gray-500 text-xs">OpenAI plugin format</p>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-950 text-white">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Add QR codes to your agent</h2>
            <p className="text-gray-400 mb-8">
              Free, no auth, works today. Start with the REST API or connect via MCP in 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/mcp" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors">
                MCP setup guide
              </Link>
              <Link href="/qr-code-api" className="px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors">
                REST API docs
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
