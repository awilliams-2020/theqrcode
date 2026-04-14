import { Metadata } from 'next'
import Link from 'next/link'
import { Code, Zap, Shield, Globe, BookOpen, Plug, CheckCircle } from 'lucide-react'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'QR Code API for AI Assistants | No Authentication Required - TheQRCode.io',
  description: 'Generate QR codes instantly for AI assistants and chatbots. Public API with no authentication required. Perfect for ChatGPT, Claude, and other AI tools. Rate limited to 100 requests/hour. Supports URL, WiFi, Contact, Text, and Email QR codes.',
  keywords: [
    'qr code api for ai', 'ai assistant qr code', 'chatgpt qr code', 'claude qr code',
    'ai qr code generator', 'public qr code api', 'no auth qr code api',
    'qr code api no authentication', 'ai plugin qr code', 'openai plugin qr code'
  ],
  openGraph: {
    title: 'QR Code API for AI Assistants | No Authentication Required',
    description: 'Generate QR codes instantly for AI assistants. Public API with no authentication. Perfect for ChatGPT, Claude, and other AI tools.',
    type: 'website',
    url: 'https://theqrcode.io/for-ai-assistants',
  },
  alternates: {
    canonical: '/for-ai-assistants',
  },
}

const useCases = [
  {
    title: 'ChatGPT Integration',
    description: 'When users ask ChatGPT to create QR codes, it can use our API to generate them instantly without requiring user authentication.',
    example: 'User: "Create a QR code for https://example.com"\nChatGPT: Uses our API to generate and return the QR code image.',
  },
  {
    title: 'Claude Integration',
    description: 'Claude can generate QR codes on-demand for users, perfect for sharing links, WiFi passwords, or contact information.',
    example: 'User: "Make a WiFi QR code for my network"\nClaude: Generates QR code using our API and provides it to the user.',
  },
  {
    title: 'Custom AI Assistants',
    description: 'Build your own AI assistant that can create QR codes for users. Perfect for customer service bots, productivity tools, and more.',
    example: 'AI Assistant: "I\'ll create a QR code for that URL right away..."\n*Generates QR code using our API*',
  },
]

const features = [
  {
    icon: Zap,
    title: 'No Authentication Required',
    description: 'Start generating QR codes immediately. No API keys, no signup, no account creation needed.',
  },
  {
    icon: Shield,
    title: 'Rate Limited',
    description: '100 requests per hour per IP address. Perfect for AI assistants and automated integrations.',
  },
  {
    icon: Globe,
    title: 'Multiple QR Types',
    description: 'Support for URL, WiFi, Contact (vCard), Text, and Email QR codes. All types available.',
  },
  {
    icon: Code,
    title: 'Simple API',
    description: 'RESTful API with JSON requests and responses. Easy to integrate into any application.',
  },
  {
    icon: BookOpen,
    title: 'Full Documentation',
    description: 'Complete OpenAPI specification and AI plugin manifest available for easy integration.',
  },
  {
    icon: Plug,
    title: 'AI Plugin Ready',
    description: 'OpenAI plugin format supported. Works with ChatGPT, Claude, and other AI platforms.',
  },
]

const codeExamples = [
  {
    language: 'JavaScript',
    code: `// Generate QR code for URL
const response = await fetch('https://theqrcode.io/api/public/qr-codes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'url',
    data: 'https://example.com',
    settings: {
      size: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }
  })
});

const result = await response.json();
console.log('QR Code Image:', result.qrImage);
console.log('Shareable URL:', result.imageUrl);`,
  },
  {
    language: 'Python',
    code: `import requests

# Generate QR code for WiFi network
response = requests.post(
    'https://theqrcode.io/api/public/qr-codes',
    json={
        'type': 'wifi',
        'data': {
            'ssid': 'MyNetwork',
            'password': 'MyPassword',
            'security': 'WPA'
        },
        'settings': {
            'size': 256
        }
    }
)

result = response.json()
print('QR Code Image:', result['qrImage'])
print('Shareable URL:', result['imageUrl'])`,
  },
  {
    language: 'cURL',
    code: `curl -X POST https://theqrcode.io/api/public/qr-codes \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "url",
    "data": "https://example.com",
    "settings": {
      "size": 256,
      "color": {
        "dark": "#000000",
        "light": "#FFFFFF"
      }
    }
  }'`,
  },
]

export default function ForAIAssistantsPage() {
  return (
    <>
      <StructuredData 
        type="WebAPI" 
        data={{
          name: "TheQRCode.io Public API for AI Assistants",
          description: "Generate QR codes instantly without authentication. Perfect for AI assistants, chatbots, and automated integrations. Rate limited to 100 requests per hour per IP address.",
          documentation: "https://theqrcode.io/api/public/qr-codes",
          url: "https://theqrcode.io/api/public/qr-codes",
          apiVersion: "1.0.0",
          endpoint: {
            "@type": "EntryPoint",
            "urlTemplate": "https://theqrcode.io/api/public/qr-codes",
            "httpMethod": "POST",
            "contentType": "application/json",
            "encodingType": "application/json"
          },
          serviceType: "QR Code Generation API",
          areaServed: "Worldwide",
          authentication: "None",
          accessMode: "public",
          isAccessibleForFree: true,
          usageInfo: "Rate limited to 100 requests per hour per IP address. No authentication required. Supports URL, WiFi, Contact (vCard), Text, and Email QR codes.",
          featureList: [
            "Generate URL QR codes",
            "Generate WiFi QR codes",
            "Generate Contact (vCard) QR codes",
            "Generate Text QR codes",
            "Generate Email QR codes",
            "Custom QR code styling",
            "Shareable image URLs",
            "No authentication required"
          ]
        }} 
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                QR Code API for AI Assistants
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Generate QR codes instantly without authentication. Perfect for ChatGPT, Claude, and other AI tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/api/public/qr-codes"
                  className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View API Documentation
                </Link>
                <Link
                  href="/api/public/qr-codes/openapi.json"
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold rounded-lg hover:bg-purple-50 transition-colors"
                >
                  OpenAPI Spec
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Use Our API?
              </h2>
              <p className="text-lg text-gray-600">
                Built specifically for AI assistants and automated integrations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Use Cases
              </h2>
              <p className="text-lg text-gray-600">
                How AI assistants can use our API
              </p>
            </div>
            
            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-700 mb-4 text-lg">
                    {useCase.description}
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap">
                      {useCase.example}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Code Examples
              </h2>
              <p className="text-lg text-gray-600">
                Get started with code examples in your preferred language
              </p>
            </div>
            
            <div className="space-y-8">
              {codeExamples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {example.language}
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Endpoints Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                API Endpoints
              </h2>
              <p className="text-lg text-gray-600">
                All endpoints available without authentication
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      POST
                    </span>
                    <code className="text-gray-900 font-mono text-lg">
                      /api/public/qr-codes
                    </code>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Generate QR codes for URLs, WiFi networks, contact cards, text, or email addresses.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Supported QR Types:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">WiFi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Contact (vCard)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Text</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Email</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Resources
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to integrate our API
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/api/public/qr-codes"
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 hover:shadow-lg transition-shadow border border-purple-100"
              >
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  API Documentation
                </h3>
                <p className="text-gray-600">
                  Complete API reference with examples and use cases
                </p>
              </Link>
              
              <Link
                href="/api/public/qr-codes/openapi.json"
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 hover:shadow-lg transition-shadow border border-blue-100"
              >
                <Code className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  OpenAPI Specification
                </h3>
                <p className="text-gray-600">
                  Full OpenAPI 3.0 specification for API integration
                </p>
              </Link>
              
              <Link
                href="/api/public/qr-codes/.well-known/ai-plugin.json"
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 hover:shadow-lg transition-shadow border border-green-100"
              >
                <Plug className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Plugin Manifest
                </h3>
                <p className="text-gray-600">
                  OpenAI plugin format for ChatGPT and other AI platforms
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Integrate?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Start generating QR codes for your AI assistant today. No authentication required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/api/public/qr-codes"
                className="px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                View API Docs
              </Link>
              <Link
                href="/api"
                className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                Full API Documentation
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
