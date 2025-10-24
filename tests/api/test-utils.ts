import { NextRequest } from 'next/server'
import { ApiKeyManager } from '@/lib/api-key-utils'
import { createHmac } from 'crypto'

export interface TestUser {
  id: string
  email: string
  plan: string
  apiKey?: string
}

export interface TestApiKey {
  id: string
  key: string
  permissions: string[]
  rateLimit: number
}

/**
 * Create a test user with subscription
 */
export async function createTestUser(plan: string = 'pro'): Promise<TestUser> {
  const userId = `user_${Date.now()}`
  const email = `test-${Date.now()}@example.com`
  
  return {
    id: userId,
    email,
    plan
  }
}

/**
 * Create a test API key for a user
 */
export async function createTestApiKey(
  userId: string, 
  permissions: string[] = ['qr:read', 'qr:write', 'analytics:read']
): Promise<TestApiKey> {
  const apiKeyId = `key_${Date.now()}`
  const apiKey = `qr_${Math.random().toString(36).substring(2, 15)}`
  
  return {
    id: apiKeyId,
    key: apiKey,
    permissions,
    rateLimit: 1000
  }
}

/**
 * Create a test QR code
 */
export async function createTestQRCode(userId: string, data: any = {}) {
  return {
    id: `qr_${Date.now()}`,
    userId,
    name: data.name || 'Test QR Code',
    type: data.type || 'url',
    content: data.content || 'https://example.com',
    settings: data.settings || {},
    isDynamic: data.isDynamic || false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Create a test webhook
 */
export async function createTestWebhook(userId: string, data: any = {}) {
  return {
    id: `webhook_${Date.now()}`,
    userId,
    name: data.name || 'Test Webhook',
    url: data.url || 'https://example.com/webhook',
    events: data.events || ['scan.created'],
    secret: 'test-secret',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

/**
 * Create a mock NextRequest for testing
 */
export function createMockRequest(
  method: string = 'GET',
  url: string = '/api/v1/test',
  body?: any,
  headers: Record<string, string> = {}
): NextRequest {
  // Convert relative URL to absolute URL for NextRequest
  const absoluteUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`
  
  const request = new NextRequest(absoluteUrl, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  })

  if (body) {
    // Mock the json() method
    request.json = jest.fn().mockResolvedValue(body)
    // Mock the text() method for raw body access (useful for webhook signature verification)
    request.text = jest.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body))
  }

  return request
}

/**
 * Add API key to request headers
 */
export function addApiKeyToRequest(request: NextRequest, apiKey: string): NextRequest {
  request.headers.set('Authorization', `Bearer ${apiKey}`)
  return request
}

/**
 * Clean up test data
 */
export async function cleanupTestData() {
  // No cleanup needed in test environment since we're using mocks
  return Promise.resolve()
}

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate webhook signature using HMAC-SHA256
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

/**
 * Create a webhook request with proper signature
 */
export function createWebhookRequest(
  payload: any,
  secret: string,
  url: string = '/api/webhook-test'
): NextRequest {
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const signature = generateWebhookSignature(payloadString, secret)

  return createMockRequest('POST', url, payloadString, {
    'x-webhook-signature': signature,
    'content-type': 'application/json',
    'user-agent': 'Test-Webhook-Client/1.0'
  })
}

/**
 * Mock Prisma for testing
 */
export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn()
  },
  subscription: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  qrCode: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn()
  },
  scan: {
    findMany: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn()
  },
  apiKey: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn()
  },
  apiUsage: {
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    deleteMany: jest.fn()
  },
  webhook: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn()
  },
  webhookEvent: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn()
  }
}
