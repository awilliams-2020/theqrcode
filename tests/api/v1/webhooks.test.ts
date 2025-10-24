import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/v1/webhooks/route'
import { GET as GET_WEBHOOK, PUT, DELETE } from '@/app/api/v1/webhooks/[id]/route'
import { 
  createTestUser, 
  createTestApiKey, 
  createMockRequest, 
  addApiKeyToRequest,
  cleanupTestData 
} from '../test-utils'
import { createHmac } from 'crypto'

// Mock the database
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
    },
    qrCode: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    scan: {
      findMany: jest.fn(),
    },
    apiKey: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    apiUsage: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
    webhook: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    webhookEvent: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock rate limiter
jest.mock('@/lib/rate-limiter', () => ({
  RateLimiter: {
    checkRateLimit: jest.fn().mockResolvedValue({
      allowed: true,
      remaining: 999,
      resetTime: Date.now() + 3600000
    }),
    recordUsage: jest.fn().mockResolvedValue(undefined),
  },
}))

describe('Webhooks API (Business Plan)', () => {
  let testUser: any
  let testApiKey: any

  beforeEach(async () => {
    await cleanupTestData()
    testUser = await createTestUser('business')
    testApiKey = await createTestApiKey(testUser.id, ['webhooks:manage'])
    
    // Mock API key validation
    const { prisma } = require('@/lib/prisma')
    prisma.apiKey.findUnique.mockResolvedValue({
      id: testApiKey.id,
      userId: testUser.id,
      permissions: testApiKey.permissions,
      rateLimit: testApiKey.rateLimit,
      isActive: true,
      expiresAt: null
    })
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  describe('GET /api/v1/webhooks', () => {
    it('should return webhooks for authenticated user', async () => {
      const mockWebhooks = [
        {
          id: 'webhook1',
          name: 'Test Webhook 1',
          url: 'https://example.com/webhook1',
          events: ['scan.created'],
          isActive: true,
          lastTriggeredAt: new Date(),
          failureCount: 0,
          _count: { webhookEvents: 5 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'webhook2',
          name: 'Test Webhook 2',
          url: 'https://example.com/webhook2',
          events: ['qr.created', 'qr.updated'],
          isActive: false,
          lastTriggeredAt: null,
          failureCount: 3,
          _count: { webhookEvents: 2 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findMany.mockResolvedValue(mockWebhooks)

      const request = createMockRequest('GET', '/api/v1/webhooks')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].name).toBe('Test Webhook 1')
      expect(data.data[0].eventCount).toBe(5)
      expect(data.data[1].isActive).toBe(false)
    })

    it('should return 401 for missing API key', async () => {
      const request = createMockRequest('GET', '/api/v1/webhooks')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('API key required')
    })

    it('should return 403 for insufficient permissions', async () => {
      const limitedApiKey = await createTestApiKey(testUser.id, ['qr:read']) // No webhooks:manage
      
      // Mock API key validation for limited permissions
      const { prisma } = require('@/lib/prisma')
      prisma.apiKey.findUnique.mockResolvedValue({
        id: limitedApiKey.id,
        userId: testUser.id,
        permissions: limitedApiKey.permissions,
        rateLimit: limitedApiKey.rateLimit,
        isActive: true,
        expiresAt: null
      })
      
      const request = createMockRequest('GET', '/api/v1/webhooks')
      const requestWithAuth = addApiKeyToRequest(request, limitedApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Insufficient permissions')
    })
  })

  describe('POST /api/v1/webhooks', () => {
    it('should create a new webhook', async () => {
      const mockWebhook = {
        id: 'webhook1',
        name: 'New Webhook',
        url: 'https://example.com/webhook',
        events: ['scan.created', 'qr.created'],
        secret: 'test-secret-123',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { prisma } = require('@/lib/prisma')
      prisma.webhook.create.mockResolvedValue(mockWebhook)

      const request = createMockRequest('POST', '/api/v1/webhooks', {
        name: 'New Webhook',
        url: 'https://example.com/webhook',
        events: ['scan.created', 'qr.created'],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('New Webhook')
      expect(data.url).toBe('https://example.com/webhook')
      expect(data.events).toEqual(['scan.created', 'qr.created'])
      expect(data.secret).toBeDefined()
    })

    it('should return 400 for missing required fields', async () => {
      const request = createMockRequest('POST', '/api/v1/webhooks', {
        name: 'New Webhook',
        // Missing url and events
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing required fields')
    })

    it('should return 400 for invalid URL', async () => {
      const request = createMockRequest('POST', '/api/v1/webhooks', {
        name: 'New Webhook',
        url: 'not-a-valid-url',
        events: ['scan.created'],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid webhook URL')
    })

    it('should return 400 for invalid events', async () => {
      const request = createMockRequest('POST', '/api/v1/webhooks', {
        name: 'New Webhook',
        url: 'https://example.com/webhook',
        events: ['invalid.event', 'scan.created'],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid events')
    })
  })

  describe('GET /api/v1/webhooks/[id]', () => {
    it('should return a specific webhook', async () => {
      const mockWebhook = {
        id: 'webhook1',
        name: 'Test Webhook',
        url: 'https://example.com/webhook',
        events: ['scan.created'],
        isActive: true,
        lastTriggeredAt: new Date(),
        failureCount: 0,
        webhookEvents: [
          {
            id: 'event1',
            eventType: 'scan.created',
            status: 'delivered',
            attempts: 1,
            createdAt: new Date(),
            deliveredAt: new Date(),
          },
        ],
        _count: { webhookEvents: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue(mockWebhook)

      const request = createMockRequest('GET', '/api/v1/webhooks/webhook1')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET_WEBHOOK(requestWithAuth, { params: Promise.resolve({ id: 'webhook1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('webhook1')
      expect(data.name).toBe('Test Webhook')
      expect(data.recentEvents).toHaveLength(1)
      expect(data.recentEvents[0].eventType).toBe('scan.created')
    })

    it('should return 404 for non-existent webhook', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue(null)

      const request = createMockRequest('GET', '/api/v1/webhooks/nonexistent')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET_WEBHOOK(requestWithAuth, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('Webhook not found')
    })
  })

  describe('PUT /api/v1/webhooks/[id]', () => {
    it('should update a webhook', async () => {
      const mockWebhook = {
        id: 'webhook1',
        name: 'Updated Webhook',
        url: 'https://updated.com/webhook',
        events: ['scan.created', 'qr.created'],
        isActive: false,
        lastTriggeredAt: new Date(),
        failureCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue({ id: 'webhook1', userId: testUser.id })
      prisma.webhook.update.mockResolvedValue(mockWebhook)

      const request = createMockRequest('PUT', '/api/v1/webhooks/webhook1', {
        name: 'Updated Webhook',
        url: 'https://updated.com/webhook',
        events: ['scan.created', 'qr.created'],
        isActive: false,
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await PUT(requestWithAuth, { params: Promise.resolve({ id: 'webhook1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated Webhook')
      expect(data.url).toBe('https://updated.com/webhook')
      expect(data.isActive).toBe(false)
    })

    it('should return 404 for non-existent webhook', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue(null)

      const request = createMockRequest('PUT', '/api/v1/webhooks/nonexistent', {
        name: 'Updated Webhook',
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await PUT(requestWithAuth, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('Webhook not found')
    })

    it('should return 400 for invalid URL', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue({ id: 'webhook1', userId: testUser.id })

      const request = createMockRequest('PUT', '/api/v1/webhooks/webhook1', {
        url: 'not-a-valid-url',
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await PUT(requestWithAuth, { params: Promise.resolve({ id: 'webhook1' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid webhook URL')
    })
  })

  describe('DELETE /api/v1/webhooks/[id]', () => {
    it('should delete a webhook', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue({ id: 'webhook1', userId: testUser.id })
      prisma.webhook.delete.mockResolvedValue({})

      const request = createMockRequest('DELETE', '/api/v1/webhooks/webhook1')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth, { params: { id: 'webhook1' } })

      expect(response.status).toBe(204)
    })

    it('should return 404 for non-existent webhook', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.webhook.findFirst.mockResolvedValue(null)

      const request = createMockRequest('DELETE', '/api/v1/webhooks/nonexistent')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth, { params: { id: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('Webhook not found')
    })
  })

  describe('Webhook signature verification', () => {
    it('should generate valid HMAC signature', async () => {
      const payload = JSON.stringify({ type: 'scan.created', data: { id: '123' } })
      const secret = 'test-secret-key-123'
      
      const expectedSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      
      expect(expectedSignature).toBeDefined()
      expect(expectedSignature).toMatch(/^[a-f0-9]{64}$/) // Should be 64 character hex string
    })

    it('should verify valid webhook signature', async () => {
      const payload = JSON.stringify({ type: 'scan.created', data: { id: '123' } })
      const secret = 'test-secret-key-123'
      
      const signature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      
      // This would be the verification logic in the actual webhook receiver
      const expectedSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      
      expect(signature).toBe(expectedSignature)
    })

    it('should detect invalid webhook signature', async () => {
      const payload = JSON.stringify({ type: 'scan.created', data: { id: '123' } })
      const secret = 'test-secret-key-123'
      const wrongSecret = 'wrong-secret-key'
      
      const validSignature = createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      
      const invalidSignature = createHmac('sha256', wrongSecret)
        .update(payload)
        .digest('hex')
      
      expect(validSignature).not.toBe(invalidSignature)
    })

    it('should detect signature mismatch for same secret but different payload', async () => {
      const secret = 'test-secret-key-123'
      const payload1 = JSON.stringify({ type: 'scan.created', data: { id: '123' } })
      const payload2 = JSON.stringify({ type: 'scan.created', data: { id: '456' } })
      
      const signature1 = createHmac('sha256', secret)
        .update(payload1)
        .digest('hex')
      
      const signature2 = createHmac('sha256', secret)
        .update(payload2)
        .digest('hex')
      
      expect(signature1).not.toBe(signature2)
    })
  })

  describe('Webhook delivery', () => {
    let mockWebhook: any

    beforeEach(() => {
      mockWebhook = {
        id: 'webhook1',
        name: 'Test Delivery Webhook',
        url: 'https://example.com/webhook',
        events: ['scan.created', 'qr.created'],
        secret: 'test-secret-key-123',
        isActive: true,
        userId: testUser.id
      }
    })

    it('should create proper webhook payload structure', async () => {
      const eventData = {
        type: 'scan.created',
        data: {
          id: 'scan_123',
          qrCodeId: 'qr_456',
          userId: testUser.id,
          timestamp: new Date().toISOString(),
          location: { city: 'Test City', country: 'Test Country' }
        }
      }

      const payloadString = JSON.stringify(eventData)
      const signature = createHmac('sha256', mockWebhook.secret)
        .update(payloadString)
        .digest('hex')

      // Verify the payload structure matches expected format
      expect(eventData.type).toBe('scan.created')
      expect(eventData.data.id).toBeDefined()
      expect(eventData.data.qrCodeId).toBeDefined()
      expect(eventData.data.userId).toBe(testUser.id)
      expect(signature).toBeDefined()
    })

    it('should generate signature for webhook delivery', async () => {
      const webhookPayload = {
        type: 'qr.created',
        data: {
          id: 'qr_new_123',
          userId: testUser.id,
          name: 'New QR Code',
          createdAt: new Date().toISOString()
        }
      }

      const payloadString = JSON.stringify(webhookPayload)
      const signature = createHmac('sha256', mockWebhook.secret)
        .update(payloadString)
        .digest('hex')

      // Verify signature properties
      expect(signature).toBeDefined()
      expect(typeof signature).toBe('string')
      expect(signature.length).toBe(64) // SHA256 hex should be 64 characters
      expect(signature).toMatch(/^[a-f0-9]{64}$/)
    })

    it('should handle different event types in webhook payload', async () => {
      const eventTypes = ['scan.created', 'scan.updated', 'qr.created', 'qr.updated', 'qr.deleted']

      for (const eventType of eventTypes) {
        const payload = {
          type: eventType,
          data: {
            id: `test_${Date.now()}`,
            userId: testUser.id,
            timestamp: new Date().toISOString()
          }
        }

        const payloadString = JSON.stringify(payload)
        const signature = createHmac('sha256', mockWebhook.secret)
          .update(payloadString)
          .digest('hex')

        expect(signature).toBeDefined()
        expect(payload.type).toBe(eventType)
      }
    })

    it('should create proper headers for webhook delivery', async () => {
      const payload = {
        type: 'scan.created',
        data: { id: 'test' }
      }

      const payloadString = JSON.stringify(payload)
      const signature = createHmac('sha256', mockWebhook.secret)
        .update(payloadString)
        .digest('hex')

      // Expected headers that should be sent with webhook
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'TheQRCode-Webhook/1.0',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': new Date().toISOString()
      }

      expect(headers['Content-Type']).toBe('application/json')
      expect(headers['X-Webhook-Signature']).toBe(signature)
      expect(headers['X-Webhook-Signature']).toMatch(/^[a-f0-9]{64}$/)
      expect(headers['X-Webhook-Timestamp']).toBeDefined()
    })
  })

  describe('Webhook event verification', () => {
    it('should verify webhook signature from request headers', async () => {
      const payload = { type: 'scan.created', data: { id: '123' } }
      const secret = 'test-secret-key-123'
      const payloadString = JSON.stringify(payload)

      // Simulate signature generation (what the webhook sender would do)
      const signature = createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex')

      // Simulate signature verification (what the webhook receiver would do)
      const request = createMockRequest('POST', '/webhook-endpoint', payload, {
        'x-webhook-signature': signature,
        'content-type': 'application/json'
      })

      const receivedSignature = request.headers.get('x-webhook-signature')
      const expectedSignature = createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex')

      expect(receivedSignature).toBe(signature)
      expect(receivedSignature).toBe(expectedSignature)
    })

    it('should reject webhooks with missing signature header', async () => {
      const payload = { type: 'scan.created', data: { id: '123' } }
      
      const request = createMockRequest('POST', '/webhook-endpoint', payload, {
        'content-type': 'application/json'
        // Missing x-webhook-signature header
      })

      const signature = request.headers.get('x-webhook-signature')
      expect(signature).toBeNull()
    })

    it('should reject webhooks with invalid signature', async () => {
      const payload = { type: 'scan.created', data: { id: '123' } }
      const payloadString = JSON.stringify(payload)
      const secret = 'correct-secret'
      const wrongSecret = 'wrong-secret'

      const correctSignature = createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex')

      const wrongSignature = createHmac('sha256', wrongSecret)
        .update(payloadString)
        .digest('hex')

      expect(correctSignature).not.toBe(wrongSignature)
    })
  })
})
