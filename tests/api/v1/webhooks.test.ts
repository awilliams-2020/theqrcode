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

      const response = await GET_WEBHOOK(requestWithAuth, { params: { id: 'webhook1' } })
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

      const response = await GET_WEBHOOK(requestWithAuth, { params: { id: 'nonexistent' } })
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

      const response = await PUT(requestWithAuth, { params: { id: 'webhook1' } })
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

      const response = await PUT(requestWithAuth, { params: { id: 'nonexistent' } })
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

      const response = await PUT(requestWithAuth, { params: { id: 'webhook1' } })
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
})
