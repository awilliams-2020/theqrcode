import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/v1/qr-codes/route'
import { GET as GET_QR, PUT, DELETE } from '@/app/api/v1/qr-codes/[id]/route'
import { 
  createTestUser, 
  createTestApiKey, 
  createTestQRCode, 
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
      findUnique: jest.fn(),
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

describe('QR Codes API', () => {
  let testUser: any
  let testApiKey: any

  beforeEach(async () => {
    await cleanupTestData()
    testUser = await createTestUser('pro')
    testApiKey = await createTestApiKey(testUser.id, ['qr:read', 'qr:write', 'analytics:read'])
    
    // Mock API key validation
    const { prisma } = require('@/lib/prisma')
    prisma.apiKey.findUnique.mockResolvedValue({
      id: testApiKey.id,
      userId: testUser.id,
      permissions: testApiKey.permissions,
      rateLimit: testApiKey.rateLimit,
      environment: 'production', // Set to production to trigger limit checks
      isActive: true,
      expiresAt: null
    })
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  describe('GET /api/v1/qr-codes', () => {
    it('should return QR codes for authenticated user', async () => {
      const mockQRCodes = [
        {
          id: 'qr1',
          name: 'Test QR 1',
          type: 'url',
          content: 'https://example.com',
          scans: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findMany.mockResolvedValue(mockQRCodes)
      prisma.qrCode.count.mockResolvedValue(1)

      const request = createMockRequest('GET', '/api/v1/qr-codes')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Test QR 1')
    })

    it('should return 401 for missing API key', async () => {
      const request = createMockRequest('GET', '/api/v1/qr-codes')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('API key required')
    })

    it('should return 403 for invalid permissions', async () => {
      const limitedApiKey = await createTestApiKey(testUser.id, ['analytics:read']) // No qr:read
      
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
      
      const request = createMockRequest('GET', '/api/v1/qr-codes')
      const requestWithAuth = addApiKeyToRequest(request, limitedApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Insufficient permissions')
    })
  })

  describe('POST /api/v1/qr-codes', () => {
    it('should create a new QR code', async () => {
      const mockQRCode = {
        id: 'qr1',
        name: 'New QR Code',
        type: 'url',
        content: 'https://example.com',
        settings: {},
        isDynamic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({ plan: 'pro' })
      prisma.qrCode.count.mockResolvedValue(0)
      prisma.qrCode.create.mockResolvedValue(mockQRCode)
      prisma.qrCode.findUnique.mockResolvedValue(mockQRCode)

      const request = createMockRequest('POST', '/api/v1/qr-codes', {
        name: 'New QR Code',
        type: 'url',
        content: 'https://example.com',
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('New QR Code')
      expect(data.type).toBe('url')
    })

    it('should create a dynamic QR code with tracking URL', async () => {
      const mockQRCode = {
        id: 'qr1',
        name: 'Dynamic QR Code',
        type: 'url',
        content: 'https://example.com',
        settings: {},
        isDynamic: true,
        shortUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedQRCode = {
        ...mockQRCode,
        shortUrl: 'https://short.ly/abc123'
      }

      const { prisma } = require('@/lib/prisma')
      const { URLShortener } = require('@/lib/url-shortener')
      const { QRGeneratorServer } = require('@/lib/qr-generator-server')

      prisma.subscription.findUnique.mockResolvedValue({ plan: 'pro' })
      prisma.qrCode.count.mockResolvedValue(0)
      prisma.qrCode.create.mockResolvedValue(mockQRCode)
      prisma.qrCode.findUnique.mockResolvedValue(updatedQRCode)
      URLShortener.generateShortUrl.mockResolvedValue('https://short.ly/abc123')
      QRGeneratorServer.generateQRCode.mockResolvedValue('data:image/png;base64,mock-qr-image')

      const request = createMockRequest('POST', '/api/v1/qr-codes', {
        name: 'Dynamic QR Code',
        type: 'url',
        content: 'https://example.com',
        isDynamic: true,
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.shortUrl).toBe('https://short.ly/abc123')
      // Verify that QR image was generated with the shortUrl, not the original content
      expect(QRGeneratorServer.generateQRCode).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'https://short.ly/abc123'
        })
      )
    })

    it('should create a dynamic contact QR code with tracking URL', async () => {
      const contactContent = JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1-555-0123',
        email: 'john@example.com'
      })

      const mockQRCode = {
        id: 'qr1',
        name: 'Contact QR',
        type: 'contact',
        content: contactContent,
        settings: {},
        isDynamic: true,
        shortUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedQRCode = {
        ...mockQRCode,
        shortUrl: 'https://short.ly/abc123'
      }

      const { prisma } = require('@/lib/prisma')
      const { URLShortener } = require('@/lib/url-shortener')
      const { QRGeneratorServer } = require('@/lib/qr-generator-server')

      prisma.subscription.findUnique.mockResolvedValue({ plan: 'pro' })
      prisma.qrCode.count.mockResolvedValue(0)
      prisma.qrCode.create.mockResolvedValue(mockQRCode)
      prisma.qrCode.findUnique.mockResolvedValue(updatedQRCode)
      URLShortener.generateShortUrl.mockResolvedValue('https://short.ly/abc123')
      QRGeneratorServer.generateQRCode.mockResolvedValue('data:image/png;base64,mock-qr-image')

      const request = createMockRequest('POST', '/api/v1/qr-codes', {
        name: 'Contact QR',
        type: 'contact',
        content: contactContent,
        isDynamic: true,
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.shortUrl).toBe('https://short.ly/abc123')
      // Verify that contact QR code also uses the shortUrl for tracking
      expect(QRGeneratorServer.generateQRCode).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'https://short.ly/abc123'
        })
      )
    })

    it('should return 400 for missing required fields', async () => {
      const request = createMockRequest('POST', '/api/v1/qr-codes', {
        name: 'New QR Code',
        // Missing type and content
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing required fields')
    })

    it('should return 403 when QR code limit is reached', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({ plan: 'free' })
      prisma.qrCode.count.mockResolvedValue(10) // Free plan limit is 10

      const request = createMockRequest('POST', '/api/v1/qr-codes', {
        name: 'New QR Code',
        type: 'url',
        content: 'https://example.com',
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await POST(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('QR code limit reached')
    })
  })

  describe('GET /api/v1/qr-codes/[id]', () => {
    it('should return a specific QR code', async () => {
      const mockQRCode = {
        id: 'qr1',
        name: 'Test QR',
        type: 'url',
        content: 'https://example.com',
        scans: [
          {
            id: 'scan1',
            scannedAt: new Date(),
            device: 'mobile',
            country: 'US',
            browser: 'Chrome',
            os: 'iOS',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findFirst.mockResolvedValue(mockQRCode)

      const request = createMockRequest('GET', '/api/v1/qr-codes/qr1')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET_QR(requestWithAuth, { params: Promise.resolve({ id: 'qr1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('qr1')
      expect(data.name).toBe('Test QR')
      expect(data.recentScans).toHaveLength(1)
    })

    it('should return 404 for non-existent QR code', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findFirst.mockResolvedValue(null)

      const request = createMockRequest('GET', '/api/v1/qr-codes/nonexistent')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET_QR(requestWithAuth, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('QR code not found')
    })
  })

  describe('PUT /api/v1/qr-codes/[id]', () => {
    it('should update a QR code', async () => {
      const mockQRCode = {
        id: 'qr1',
        name: 'Updated QR',
        type: 'url',
        content: 'https://updated.com',
        settings: {},
        isDynamic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findFirst.mockResolvedValue({ id: 'qr1', userId: testUser.id })
      prisma.qrCode.update.mockResolvedValue(mockQRCode)

      const request = createMockRequest('PUT', '/api/v1/qr-codes/qr1', {
        name: 'Updated QR',
        content: 'https://updated.com',
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await PUT(requestWithAuth, { params: Promise.resolve({ id: 'qr1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated QR')
      expect(data.content).toBe('https://updated.com')
    })

    it('should return 404 for non-existent QR code', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findFirst.mockResolvedValue(null)

      const request = createMockRequest('PUT', '/api/v1/qr-codes/nonexistent', {
        name: 'Updated QR',
      })
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await PUT(requestWithAuth, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('QR code not found')
    })
  })

  describe('DELETE /api/v1/qr-codes/[id]', () => {
    it('should delete a QR code', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findFirst.mockResolvedValue({ id: 'qr1', userId: testUser.id })
      prisma.qrCode.delete.mockResolvedValue({})

      const request = createMockRequest('DELETE', '/api/v1/qr-codes/qr1')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth, { params: Promise.resolve({ id: 'qr1' }) })

      expect(response.status).toBe(204)
    })

    it('should return 404 for non-existent QR code', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findFirst.mockResolvedValue(null)

      const request = createMockRequest('DELETE', '/api/v1/qr-codes/nonexistent')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await DELETE(requestWithAuth, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('QR code not found')
    })
  })
})
