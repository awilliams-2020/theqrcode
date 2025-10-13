import { NextRequest } from 'next/server'
import { POST, DELETE } from '@/app/api/v1/qr-codes/bulk/route'
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
      deleteMany: jest.fn(),
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

// Mock QR generator
jest.mock('@/lib/qr-generator-server', () => ({
  QRGeneratorServer: {
    generateQRCode: jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-image'),
  },
}))

// Mock URL shortener
jest.mock('@/lib/url-shortener', () => ({
  URLShortener: {
    generateShortUrl: jest.fn().mockResolvedValue('https://short.ly/abc123'),
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

describe('Bulk Operations API (Business Plan)', () => {
  let testUser: any
  let testApiKey: any

  beforeEach(async () => {
    await cleanupTestData()
    testUser = await createTestUser('business')
    testApiKey = await createTestApiKey(testUser.id, ['bulk:write'])
    
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

  describe('POST /api/v1/qr-codes/bulk', () => {
    it('should create multiple QR codes in bulk', async () => {
      const mockQRCodes = [
        {
          id: 'qr1',
          name: 'Bulk QR 1',
          type: 'url',
          content: 'https://example1.com',
          settings: {},
          isDynamic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'qr2',
          name: 'Bulk QR 2',
          type: 'text',
          content: 'Hello World',
          settings: {},
          isDynamic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({ plan: 'business' })
      prisma.qrCode.count.mockResolvedValue(0)
      prisma.qrCode.create
        .mockResolvedValueOnce(mockQRCodes[0])
        .mockResolvedValueOnce(mockQRCodes[1])

      const request = createMockRequest('POST', '/api/v1/qr-codes/bulk', {
        qrCodes: [
          {
            name: 'Bulk QR 1',
            type: 'url',
            content: 'https://example1.com',
          },
          {
            name: 'Bulk QR 2',
            type: 'text',
            content: 'Hello World',
          },
        ],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.summary.total).toBe(2)
      expect(data.summary.successful).toBe(2)
      expect(data.summary.failed).toBe(0)
      expect(data.created).toHaveLength(2)
    })

    it('should return 400 for invalid request format', async () => {
      const request = createMockRequest('POST', '/api/v1/qr-codes/bulk', {
        // Missing qrCodes array
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('qrCodes must be a non-empty array')
    })

    it('should return 400 for too many QR codes', async () => {
      const qrCodes = Array(101).fill(null).map((_, i) => ({
        name: `QR ${i}`,
        type: 'url',
        content: `https://example${i}.com`,
      }))

      const request = createMockRequest('POST', '/api/v1/qr-codes/bulk', { qrCodes })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Maximum 100 QR codes per bulk request')
    })

    it('should return 400 for missing required fields', async () => {
      const request = createMockRequest('POST', '/api/v1/qr-codes/bulk', {
        qrCodes: [
          {
            name: 'Test QR',
            // Missing type and content
          },
        ],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Each QR code must have name, type, and content')
    })

    it('should return 403 when limit would be exceeded', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({ plan: 'free' })
      prisma.qrCode.count.mockResolvedValue(8) // Close to free limit of 10

      const request = createMockRequest('POST', '/api/v1/qr-codes/bulk', {
        qrCodes: [
          { name: 'QR 1', type: 'url', content: 'https://example1.com' },
          { name: 'QR 2', type: 'url', content: 'https://example2.com' },
          { name: 'QR 3', type: 'url', content: 'https://example3.com' }, // Would exceed limit
        ],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Bulk operation would exceed QR code limit')
    })

    it('should handle partial failures gracefully', async () => {
      // Mock console.error to suppress expected error output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({ plan: 'business' })
      prisma.qrCode.count.mockResolvedValue(0)
      prisma.qrCode.create
        .mockResolvedValueOnce({ id: 'qr1', name: 'Success QR', type: 'url', content: 'https://success.com', settings: {}, isDynamic: false, createdAt: new Date(), updatedAt: new Date() })
        .mockRejectedValueOnce(new Error('Database error'))

      const request = createMockRequest('POST', '/api/v1/qr-codes/bulk', {
        qrCodes: [
          { name: 'Success QR', type: 'url', content: 'https://success.com' },
          { name: 'Fail QR', type: 'url', content: 'https://fail.com' },
        ],
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.summary.total).toBe(2)
      expect(data.summary.successful).toBe(1)
      expect(data.summary.failed).toBe(1)
      expect(data.errors).toHaveLength(1)
      expect(data.errors[0].index).toBe(1)
      
      // Verify console.error was called (error was logged)
      expect(consoleErrorSpy).toHaveBeenCalled()
      
      // Restore console.error
      consoleErrorSpy.mockRestore()
    })
  })

  describe('DELETE /api/v1/qr-codes/bulk', () => {
    it('should delete multiple QR codes in bulk', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findMany.mockResolvedValue([
        { id: 'qr1' },
        { id: 'qr2' },
      ])
      prisma.qrCode.deleteMany.mockResolvedValue({ count: 2 })

      const request = createMockRequest('DELETE', '/api/v1/qr-codes/bulk', {
        qrCodeIds: ['qr1', 'qr2', 'qr3'], // qr3 doesn't exist
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.total).toBe(3)
      expect(data.summary.deleted).toBe(2)
      expect(data.summary.notFound).toBe(1)
      expect(data.notFound).toContain('qr3')
    })

    it('should return 400 for invalid request format', async () => {
      const request = createMockRequest('DELETE', '/api/v1/qr-codes/bulk', {
        // Missing qrCodeIds array
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('qrCodeIds must be a non-empty array')
    })

    it('should return 400 for too many QR codes', async () => {
      const qrCodeIds = Array(101).fill(null).map((_, i) => `qr${i}`)

      const request = createMockRequest('DELETE', '/api/v1/qr-codes/bulk', { qrCodeIds })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Maximum 100 QR codes per bulk delete request')
    })

    it('should return 403 for insufficient permissions', async () => {
      const limitedApiKey = await createTestApiKey(testUser.id, ['qr:read']) // No bulk:write
      
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
      
      const request = createMockRequest('DELETE', '/api/v1/qr-codes/bulk', {
        qrCodeIds: ['qr1', 'qr2'],
      })
      const requestWithAuth = addApiKeyToRequest(request, limitedApiKey.key)

      const response = await DELETE(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Insufficient permissions')
    })
  })
})
