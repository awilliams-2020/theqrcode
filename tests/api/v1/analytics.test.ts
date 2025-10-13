import { NextRequest } from 'next/server'
import { GET } from '@/app/api/v1/analytics/route'
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

describe('Analytics API', () => {
  let testUser: any
  let testApiKey: any

  beforeEach(async () => {
    await cleanupTestData()
    testUser = await createTestUser('pro')
    testApiKey = await createTestApiKey(testUser.id, ['analytics:read'])
    
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

  describe('GET /api/v1/analytics', () => {
    it('should return analytics data for authenticated user', async () => {
      const mockQRCodes = [
        {
          id: 'qr1',
          name: 'Test QR 1',
          type: 'url',
          isDynamic: false,
          scans: [
            {
              id: 'scan1',
              scannedAt: new Date('2024-01-01T10:00:00Z'),
              device: 'mobile',
              country: 'US',
              browser: 'Chrome',
              os: 'iOS',
            },
            {
              id: 'scan2',
              scannedAt: new Date('2024-01-01T11:00:00Z'),
              device: 'desktop',
              country: 'CA',
              browser: 'Firefox',
              os: 'Windows',
            },
          ],
        },
        {
          id: 'qr2',
          name: 'Test QR 2',
          type: 'text',
          isDynamic: true,
          scans: [
            {
              id: 'scan3',
              scannedAt: new Date('2024-01-01T12:00:00Z'),
              device: 'tablet',
              country: 'UK',
              browser: 'Safari',
              os: 'iPadOS',
            },
          ],
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findMany.mockResolvedValue(mockQRCodes)

      const request = createMockRequest('GET', '/api/v1/analytics')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.totalScans).toBe(3)
      expect(data.summary.totalQRCodes).toBe(2)
      expect(data.summary.uniqueVisitors).toBe(3)
      expect(data.breakdowns.devices).toEqual({
        mobile: 1,
        desktop: 1,
        tablet: 1,
      })
      expect(data.breakdowns.countries).toEqual({
        US: 1,
        CA: 1,
        UK: 1,
      })
      expect(data.topQRCodes).toHaveLength(2)
      expect(data.qrCodes).toHaveLength(2)
    })

    it('should filter by QR code ID when provided', async () => {
      const mockQRCodes = [
        {
          id: 'qr1',
          name: 'Test QR 1',
          type: 'url',
          isDynamic: false,
          scans: [
            {
              id: 'scan1',
              scannedAt: new Date('2024-01-01T10:00:00Z'),
              device: 'mobile',
              country: 'US',
              browser: 'Chrome',
              os: 'iOS',
            },
          ],
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findMany.mockResolvedValue(mockQRCodes)

      const request = createMockRequest('GET', '/api/v1/analytics?qrCodeId=qr1')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.summary.totalScans).toBe(1)
      expect(data.summary.totalQRCodes).toBe(1)
    })

    it('should include scan details when requested', async () => {
      const mockQRCodes = [
        {
          id: 'qr1',
          name: 'Test QR 1',
          type: 'url',
          isDynamic: false,
          scans: [
            {
              id: 'scan1',
              scannedAt: new Date('2024-01-01T10:00:00Z'),
              device: 'mobile',
              country: 'US',
              browser: 'Chrome',
              os: 'iOS',
            },
          ],
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findMany.mockResolvedValue(mockQRCodes)

      const request = createMockRequest('GET', '/api/v1/analytics?includeScans=true')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.qrCodes[0].recentScans).toBeDefined()
      expect(data.qrCodes[0].recentScans).toHaveLength(1)
      expect(data.qrCodes[0].recentScans[0].device).toBe('mobile')
    })

    it('should return 401 for missing API key', async () => {
      const request = createMockRequest('GET', '/api/v1/analytics')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('API key required')
    })

    it('should return 403 for invalid permissions', async () => {
      const limitedApiKey = await createTestApiKey(testUser.id, ['qr:read']) // No analytics:read
      
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
      
      const request = createMockRequest('GET', '/api/v1/analytics')
      const requestWithAuth = addApiKeyToRequest(request, limitedApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Insufficient permissions')
    })

    it('should handle different time ranges', async () => {
      const mockQRCodes: any[] = []

      const { prisma } = require('@/lib/prisma')
      prisma.qrCode.findMany.mockResolvedValue(mockQRCodes)

      const timeRanges = ['7d', '30d', '90d', '1y']
      
      for (const timeRange of timeRanges) {
        const request = createMockRequest('GET', `/api/v1/analytics?timeRange=${timeRange}`)
        const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

        const response = await GET(requestWithAuth)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.summary.timeRange).toBe(timeRange)
      }
    })

    it('should calculate hourly and weekly distributions', async () => {
      const { prisma } = require('@/lib/prisma')
      // Mock the Prisma response with proper structure
      prisma.qrCode.findMany.mockResolvedValue([
        {
          id: 'qr1',
          name: 'Test QR 1',
          type: 'url',
          isDynamic: false,
          scans: [
            {
              id: 'scan1',
              scannedAt: new Date('2024-01-01T10:00:00Z'), // Monday, 10 AM
              device: 'mobile',
              country: 'US',
              browser: 'Chrome',
              os: 'iOS',
            },
            {
              id: 'scan2',
              scannedAt: new Date('2024-01-01T14:00:00Z'), // Monday, 2 PM
              device: 'desktop',
              country: 'CA',
              browser: 'Firefox',
              os: 'Windows',
            },
          ],
        },
      ])

      const request = createMockRequest('GET', '/api/v1/analytics')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.distributions.hourly).toBeDefined()
      expect(data.distributions.weekly).toBeDefined()
      expect(data.distributions.hourly.length).toBeGreaterThan(0)
      // Check that we have some hourly data
      expect(data.distributions.hourly.every((h: any) => typeof h.hour === 'number' && typeof h.count === 'number')).toBe(true)
    })
  })
})
