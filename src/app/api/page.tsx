import { Metadata } from 'next'
import Link from 'next/link'
import { Code, Key, Zap, Shield, BarChart3, Webhook } from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Documentation - QR Code Generator API',
  description: 'Complete API documentation for TheQRCode.io QR code generation, analytics, and management. RESTful API with examples and SDKs.',
  keywords: ['QR code API', 'API documentation', 'QR code REST API', 'QR code SDK', 'API integration'],
  openGraph: {
    title: 'API Documentation - QR Code Generator API',
    description: 'Complete API documentation for TheQRCode.io QR code generation, analytics, and management.',
    type: 'website',
  },
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/qr-codes',
    description: 'Create a new QR code',
    tier: 'Pro',
    requestFields: [
      { name: 'name', type: 'string', required: true, description: 'Display name for the QR code' },
      { name: 'type', type: 'string', required: true, description: 'QR code type (url, text, wifi, contact, email, sms, vcard)' },
      { name: 'content', type: 'string', required: true, description: 'The content to encode in the QR code' },
      { name: 'settings', type: 'object', required: false, description: 'QR code appearance settings' },
      { name: 'settings.size', type: 'number', required: false, description: 'QR code size in pixels (default: 256)' },
      { name: 'settings.color', type: 'object', required: false, description: 'Color settings for the QR code' },
      { name: 'settings.color.dark', type: 'string', required: false, description: 'Dark color (hex code, default: #000000)' },
      { name: 'settings.color.light', type: 'string', required: false, description: 'Light color (hex code, default: #FFFFFF)' },
      { name: 'settings.frame', type: 'object', required: false, description: 'Frame settings for the QR code' },
      { name: 'settings.frame.style', type: 'string', required: false, description: 'Frame style (square, circle, rounded)' },
      { name: 'settings.frame.color', type: 'string', required: false, description: 'Frame color (hex code)' },
      { name: 'settings.frame.size', type: 'number', required: false, description: 'Frame size in pixels' },
      { name: 'isDynamic', type: 'boolean', required: false, description: 'Whether the QR code can be updated after creation (default: false)' }
    ],
    example: {
      request: {
        name: 'My QR Code',
        type: 'url',
        content: 'https://example.com',
        settings: {
          size: 256,
          color: { dark: '#000000', light: '#FFFFFF' },
          frame: { style: 'square', color: '#000000', size: 20 }
        },
        isDynamic: false
      },
      response: {
        id: 'qr_123456789',
        name: 'My QR Code',
        type: 'url',
        content: 'https://example.com',
        shortUrl: null,
        settings: { size: 256, color: { dark: '#000000', light: '#FFFFFF' } },
        isDynamic: false,
        qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/qr-codes',
    description: 'List all QR codes with pagination and filtering',
    tier: 'Pro',
    requestFields: [
      { name: 'page', type: 'number', required: false, description: 'Page number for pagination (default: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Number of items per page (default: 20, max: 100)' },
      { name: 'type', type: 'string', required: false, description: 'Filter by QR code type (url, text, wifi, contact, email, sms, vcard)' },
      { name: 'isDynamic', type: 'boolean', required: false, description: 'Filter by dynamic QR codes (true/false)' },
      { name: 'search', type: 'string', required: false, description: 'Search by QR code name or content' },
      { name: 'sort', type: 'string', required: false, description: 'Sort field (createdAt, updatedAt, name, scanCount)' },
      { name: 'order', type: 'string', required: false, description: 'Sort order (asc, desc, default: desc)' }
    ],
    example: {
      request: {
        query: '?page=1&limit=20&type=url&isDynamic=false'
      },
      response: {
        data: [
          {
            id: 'qr_123456789',
            name: 'My QR Code',
            type: 'url',
            content: 'https://example.com',
            shortUrl: null,
            settings: { size: 256 },
            isDynamic: false,
            scanCount: 42,
            lastScanned: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/qr-codes/{id}',
    description: 'Get specific QR code details with recent scans',
    tier: 'Pro',
    example: {
      request: {},
      response: {
        id: 'qr_123456789',
        name: 'My QR Code',
        type: 'url',
        content: 'https://example.com',
        shortUrl: null,
        settings: { size: 256 },
        isDynamic: false,
        scanCount: 42,
        lastScanned: '2024-01-15T10:30:00Z',
        recentScans: [
          {
            id: 'scan_123',
            scannedAt: '2024-01-15T10:30:00Z',
            device: 'mobile',
            country: 'US',
            browser: 'Chrome',
            os: 'iOS'
          }
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/v1/qr-codes/{id}',
    description: 'Update QR code name, content, or settings',
    tier: 'Pro',
    requestFields: [
      { name: 'name', type: 'string', required: false, description: 'Updated display name for the QR code' },
      { name: 'content', type: 'string', required: false, description: 'Updated content to encode in the QR code' },
      { name: 'settings', type: 'object', required: false, description: 'Updated QR code appearance settings' },
      { name: 'settings.size', type: 'number', required: false, description: 'Updated QR code size in pixels' },
      { name: 'settings.color', type: 'object', required: false, description: 'Updated color settings for the QR code' },
      { name: 'settings.color.dark', type: 'string', required: false, description: 'Updated dark color (hex code)' },
      { name: 'settings.color.light', type: 'string', required: false, description: 'Updated light color (hex code)' },
      { name: 'settings.frame', type: 'object', required: false, description: 'Updated frame settings for the QR code' },
      { name: 'settings.frame.style', type: 'string', required: false, description: 'Updated frame style (square, circle, rounded)' },
      { name: 'settings.frame.color', type: 'string', required: false, description: 'Updated frame color (hex code)' },
      { name: 'settings.frame.size', type: 'number', required: false, description: 'Updated frame size in pixels' }
    ],
    example: {
      request: {
        name: 'Updated QR Code',
        content: 'https://updated-example.com',
        settings: { size: 512, color: { dark: '#FF0000', light: '#FFFFFF' } }
      },
      response: {
        id: 'qr_123456789',
        name: 'Updated QR Code',
        type: 'url',
        content: 'https://updated-example.com',
        shortUrl: null,
        settings: { size: 512, color: { dark: '#FF0000', light: '#FFFFFF' } },
        isDynamic: false,
        qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/qr-codes/{id}',
    description: 'Delete a QR code and all associated data',
    tier: 'Pro',
    example: {
      request: {},
      response: null
    }
  },
  {
    method: 'POST',
    path: '/api/v1/qr-codes/bulk',
    description: 'Create multiple QR codes in a single request (up to 100)',
    tier: 'Business',
    requestFields: [
      { name: 'qrCodes', type: 'array', required: true, description: 'Array of QR codes to create (max 100)' },
      { name: 'qrCodes[].name', type: 'string', required: true, description: 'Display name for the QR code' },
      { name: 'qrCodes[].type', type: 'string', required: true, description: 'QR code type (url, text, wifi, contact, email, sms, vcard)' },
      { name: 'qrCodes[].content', type: 'string', required: true, description: 'The content to encode in the QR code' },
      { name: 'qrCodes[].settings', type: 'object', required: false, description: 'QR code appearance settings' },
      { name: 'qrCodes[].settings.size', type: 'number', required: false, description: 'QR code size in pixels (default: 256)' },
      { name: 'qrCodes[].settings.color', type: 'object', required: false, description: 'Color settings for the QR code' },
      { name: 'qrCodes[].isDynamic', type: 'boolean', required: false, description: 'Whether the QR code can be updated after creation (default: false)' }
    ],
    example: {
      request: {
        qrCodes: [
          {
            name: 'Product 1 QR',
            type: 'url',
            content: 'https://example.com/product1',
            settings: { size: 256, color: { dark: '#000000', light: '#FFFFFF' } },
            isDynamic: false
          },
          {
            name: 'Product 2 QR',
            type: 'url',
            content: 'https://example.com/product2',
            settings: { size: 256, color: { dark: '#0000FF', light: '#FFFFFF' } },
            isDynamic: true
          }
        ]
      },
      response: {
        created: [
          {
            id: 'qr_123456789',
            name: 'Product 1 QR',
            type: 'url',
            content: 'https://example.com/product1',
            shortUrl: null,
            settings: { size: 256, color: { dark: '#000000', light: '#FFFFFF' } },
            isDynamic: false,
            qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          },
          {
            id: 'qr_987654321',
            name: 'Product 2 QR',
            type: 'url',
            content: 'https://example.com/product2',
            shortUrl: 'https://qr.io/abc123',
            settings: { size: 256, color: { dark: '#0000FF', light: '#FFFFFF' } },
            isDynamic: true,
            qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
            createdAt: '2024-01-15T10:30:01Z',
            updatedAt: '2024-01-15T10:30:01Z'
          }
        ],
        errors: [],
        summary: {
          total: 2,
          successful: 2,
          failed: 0
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/qr-codes/bulk',
    description: 'Delete multiple QR codes in a single request (up to 100)',
    tier: 'Business',
    requestFields: [
      { name: 'qrCodeIds', type: 'array', required: true, description: 'Array of QR code IDs to delete (max 100)' }
    ],
    example: {
      request: {
        qrCodeIds: ['qr_123456789', 'qr_987654321', 'qr_111222333']
      },
      response: {
        deleted: 2,
        notFound: ['qr_111222333'],
        summary: {
          total: 3,
          deleted: 2,
          notFound: 1
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/analytics',
    description: 'Get comprehensive analytics data',
    tier: 'Pro',
    requestFields: [
      { name: 'qrCodeId', type: 'string', required: false, description: 'Specific QR code ID to get analytics for' },
      { name: 'timeRange', type: 'string', required: false, description: 'Time range for analytics (1h, 1d, 7d, 30d, 90d, 1y, default: 30d)' },
      { name: 'includeScans', type: 'boolean', required: false, description: 'Include individual scan data in response (default: false)' },
      { name: 'startDate', type: 'string', required: false, description: 'Start date for custom range (ISO 8601 format)' },
      { name: 'endDate', type: 'string', required: false, description: 'End date for custom range (ISO 8601 format)' },
      { name: 'groupBy', type: 'string', required: false, description: 'Group analytics by (hour, day, week, month)' },
      { name: 'timezone', type: 'string', required: false, description: 'Timezone for date grouping (default: UTC)' }
    ],
    example: {
      request: {
        query: '?qrCodeId=qr_123&timeRange=30d&includeScans=true'
      },
      response: {
        summary: {
          totalScans: 1250,
          totalQRCodes: 5,
          timeRange: '30d',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          uniqueVisitors: 850,
          avgScansPerQR: 250,
          mostActiveDay: '2024-01-15'
        },
        breakdowns: {
          devices: { mobile: 800, desktop: 300, tablet: 150 },
          countries: { US: 600, CA: 300, UK: 200, DE: 150 },
          browsers: { Chrome: 700, Safari: 300, Firefox: 150, Edge: 100 },
          os: { iOS: 400, Android: 400, Windows: 300, macOS: 150 }
        },
        distributions: {
          hourly: [{ hour: 0, count: 10 }, { hour: 1, count: 5 }],
          weekly: [{ day: 0, count: 200 }, { day: 1, count: 180 }]
        },
        dailyScans: [
          { date: '2024-01-01', count: 25 },
          { date: '2024-01-02', count: 30 }
        ],
        topQRCodes: [
          {
            id: 'qr_123',
            name: 'Main QR Code',
            type: 'url',
            scanCount: 500,
            isDynamic: true
          }
        ]
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/api-keys',
    description: 'List all API keys for the authenticated user',
    tier: 'Pro',
    example: {
      request: {},
      response: {
        data: [
          {
            id: 'ak_123456789',
            name: 'Production API Key',
            permissions: ['qr:read', 'qr:write', 'analytics:read'],
            rateLimit: 1000,
            isActive: true,
            lastUsedAt: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-01T00:00:00Z'
          }
        ]
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/api-keys',
    description: 'Create a new API key with custom permissions',
    tier: 'Pro',
    requestFields: [
      { name: 'name', type: 'string', required: true, description: 'Display name for the API key' },
      { name: 'permissions', type: 'array', required: true, description: 'Array of permissions (qr:read, qr:write, analytics:read, webhooks:manage)' },
      { name: 'expiresAt', type: 'string', required: false, description: 'Expiration date for the API key (ISO 8601 format)' },
      { name: 'rateLimit', type: 'number', required: false, description: 'Custom rate limit (requests per hour, max based on plan)' },
      { name: 'description', type: 'string', required: false, description: 'Optional description for the API key' }
    ],
    example: {
      request: {
        name: 'Development API Key',
        permissions: ['qr:read', 'qr:write'],
        expiresAt: '2024-12-31T23:59:59Z'
      },
      response: {
        id: 'ak_987654321',
        name: 'Development API Key',
        apiKey: 'qrc_1234567890abcdef...',
        permissions: ['qr:read', 'qr:write'],
        rateLimit: 1000,
        expiresAt: '2024-12-31T23:59:59Z',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/webhooks',
    description: 'List all webhooks',
    tier: 'Pro',
    example: {
      request: {},
      response: {
        data: [
          {
            id: 'wh_123456789',
            name: 'Scan Notifications',
            url: 'https://myapp.com/webhooks/qr-scans',
            events: ['scan.created', 'scan.updated'],
            isActive: true,
            lastTriggeredAt: '2024-01-15T10:30:00Z',
            failureCount: 0,
            eventCount: 150,
            createdAt: '2024-01-01T00:00:00Z'
          }
        ]
      }
    }
  },
  {
    method: 'POST',
    path: '/api/v1/webhooks',
    description: 'Create a new webhook',
    tier: 'Pro',
    requestFields: [
      { name: 'name', type: 'string', required: true, description: 'Display name for the webhook' },
      { name: 'url', type: 'string', required: true, description: 'Webhook endpoint URL (must be HTTPS)' },
      { name: 'events', type: 'array', required: true, description: 'Array of events to subscribe to (qr.created, qr.updated, qr.deleted, scan.created, scan.updated)' },
      { name: 'secret', type: 'string', required: false, description: 'Custom webhook secret for signature verification' },
      { name: 'description', type: 'string', required: false, description: 'Optional description for the webhook' },
      { name: 'retryPolicy', type: 'object', required: false, description: 'Custom retry policy settings' },
      { name: 'retryPolicy.maxAttempts', type: 'number', required: false, description: 'Maximum retry attempts (default: 3)' },
      { name: 'retryPolicy.backoffMultiplier', type: 'number', required: false, description: 'Backoff multiplier for retries (default: 2)' }
    ],
    example: {
      request: {
        name: 'QR Code Events',
        url: 'https://myapp.com/webhooks/qr-events',
        events: ['qr.created', 'qr.updated', 'qr.deleted']
      },
      response: {
        id: 'wh_987654321',
        name: 'QR Code Events',
        url: 'https://myapp.com/webhooks/qr-events',
        events: ['qr.created', 'qr.updated', 'qr.deleted'],
        secret: 'whsec_1234567890abcdef...',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z'
      }
    }
  }
]

const features = [
  {
    icon: Code,
    title: 'RESTful API',
    description: 'Clean, intuitive REST API following industry standards with comprehensive documentation.'
  },
  {
    icon: Key,
    title: 'API Key Authentication',
    description: 'Secure API key-based authentication with rate limiting and usage tracking.'
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Lightning-fast API responses with global CDN and optimized infrastructure.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with encryption, audit logs, and compliance standards.'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Access comprehensive analytics data through our powerful analytics API endpoints.'
  },
  {
    icon: Webhook,
    title: 'Webhook Support',
    description: 'Real-time notifications for QR code events with configurable webhook endpoints.'
  }
]

export default function APIDocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              API Documentation
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Complete API documentation for QR code generation, analytics, and management. 
              Build powerful integrations with our RESTful API.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Quick Start
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Get started with our API in minutes
            </p>
          </div>
          
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">1. Get Your API Key</h3>
              <p className="text-gray-300 mb-4">
                Sign up for a Pro plan to get your API key from the dashboard.
              </p>
              <div className="bg-gray-800 rounded p-3 sm:p-4 mb-4 overflow-x-auto">
                <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap break-all">
                  <code>{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://theqrcode.io/api/v1/qr-codes`}</code>
                </pre>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">2. Create Your First QR Code</h3>
              <p className="text-gray-300 mb-4">
                Use our simple API to generate QR codes programmatically.
              </p>
              <div className="bg-gray-800 rounded p-3 sm:p-4 mb-4 overflow-x-auto">
                <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap break-all">
                  <code>{`curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "url", "content": "https://example.com"}' \\
  https://theqrcode.io/api/v1/qr-codes`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              API Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Powerful features for developers and integrations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
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

      {/* API Endpoints */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              API Endpoints
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Complete reference for all available API endpoints
            </p>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {endpoints.filter(endpoint => endpoint.tier !== 'Business').map((endpoint, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-gray-900 font-mono text-sm sm:text-base break-all">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded text-sm font-medium ${
                        endpoint.tier === 'Pro' ? 'bg-blue-100 text-blue-800' :
                        endpoint.tier === 'Business' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {endpoint.tier}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3 text-sm sm:text-base">{endpoint.description}</p>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Request Example</h4>
                      <div className="bg-gray-900 rounded p-3 sm:p-4 text-xs sm:text-sm">
                        <pre className="text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
                          {JSON.stringify(endpoint.example.request, null, 2)}
                        </pre>
                      </div>
                      
                      {endpoint.requestFields && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Request Parameters</h5>
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                            <div className="space-y-3">
                              {endpoint.requestFields.map((field, fieldIndex) => (
                                <div key={fieldIndex} className="border-b border-gray-200 pb-3 last:border-b-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <code className="text-xs sm:text-sm font-mono bg-gray-200 px-2 py-1 rounded text-gray-800 break-all">
                                      {field.name}
                                    </code>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      field.required 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {field.type}
                                    </span>
                                    {field.required && (
                                      <span className="text-xs text-red-700 font-medium">Required</span>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-700">{field.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Response Example</h4>
                      <div className="bg-gray-900 rounded p-3 sm:p-4 text-xs sm:text-sm">
                        <pre className="text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
                          {JSON.stringify(endpoint.example.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webhooks Section */}
      <section id="webhooks" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Webhook className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 mr-3 sm:mr-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Webhooks
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Get real-time notifications when QR codes are created, updated, or scanned. 
              Perfect for building reactive systems and keeping your data in sync.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Available Events</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">QR Code Events</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Available
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded self-start">qr.created</code>
                      <span className="text-xs sm:text-sm text-gray-600">New QR code created</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded self-start">qr.updated</code>
                      <span className="text-xs sm:text-sm text-gray-600">QR code content updated</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded self-start">qr.deleted</code>
                      <span className="text-xs sm:text-sm text-gray-600">QR code deleted</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Scan Events</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Available
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded self-start">scan.created</code>
                      <span className="text-xs sm:text-sm text-gray-600">QR code scanned</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded self-start">scan.updated</code>
                      <span className="text-xs sm:text-sm text-gray-600">Scan data updated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Getting Started</h3>
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-4">1. Create a Webhook</h4>
                <pre className="text-green-400 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all">
{`POST /api/v1/webhooks
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "My Webhook",
  "url": "https://myapp.com/webhooks/qr-events",
  "events": ["qr.created", "scan.created"]
}`}
                </pre>
              </div>
              
              <div className="mt-6 bg-gray-900 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-4">2. Handle Incoming Events</h4>
                <pre className="text-green-400 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all">
{`// Verify webhook signature
const signature = req.headers['x-webhook-signature'];
const payload = JSON.stringify(req.body);

// Generate expected signature
const expectedSignature = hmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (signature === expectedSignature) {
  // Process webhook event
  const event = req.body;
  console.log('Event type:', event.type);
  console.log('Data:', event.data);
}`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-blue-50 rounded-lg p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Requirements</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>HTTPS endpoint required:</strong> All webhook URLs must use HTTPS for security</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Fast response expected:</strong> Your endpoint should respond with 2xx status within 10 seconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Retry policy:</strong> Failed webhooks will be retried up to 3 times with exponential backoff</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Rate Limits and Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Rate Limits & Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Transparent pricing and rate limits for API usage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Free</h3>
              <div className="text-2xl font-bold text-gray-800 mb-4">$0/month</div>
              <div className="text-sm text-gray-700 mb-4">No API access</div>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">No API access</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Dashboard only</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Starter</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">$9/month</div>
              <div className="text-sm text-gray-700 mb-4">No API access</div>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">No API access</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Dashboard only</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
              <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3">
                API Access
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pro</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">$29/month</div>
              <div className="text-sm text-gray-700 mb-4">Full API access</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">5,000 requests/hour</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">QR Code API</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">Analytics API</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">Webhooks</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">API Key management</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Get your API key and start integrating QR codes into your applications today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?plan=pro"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get API Access
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
