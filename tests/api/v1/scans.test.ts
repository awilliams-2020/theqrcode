import { NextRequest } from 'next/server'
import { GET } from '@/app/api/v1/scans/route'
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
      count: jest.fn(),
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

describe('Scans API', () => {
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

  describe('GET /api/v1/scans', () => {
    it('should return scans for authenticated user', async () => {
      const mockScans = [
        {
          id: 'scan1',
          qrCodeId: 'qr1',
          qrCode: {
            id: 'qr1',
            name: 'Test QR 1',
            type: 'url',
            shortUrl: 'https://short.ly/abc123'
          },
          scannedAt: new Date('2024-01-15T10:00:00Z'),
          device: 'mobile',
          os: 'iOS',
          browser: 'Safari',
          country: 'US',
          city: 'New York',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          latitude: 40.7128,
          longitude: -74.0060
        },
        {
          id: 'scan2',
          qrCodeId: 'qr1',
          qrCode: {
            id: 'qr1',
            name: 'Test QR 1',
            type: 'url',
            shortUrl: 'https://short.ly/abc123'
          },
          scannedAt: new Date('2024-01-15T11:00:00Z'),
          device: 'desktop',
          os: 'Windows',
          browser: 'Chrome',
          country: 'CA',
          city: 'Toronto',
          ip: '192.168.1.2',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          latitude: 43.6532,
          longitude: -79.3832
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue(mockScans)
      prisma.scan.count.mockResolvedValue(2)

      const request = createMockRequest('GET', '/api/v1/scans')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].id).toBe('scan1')
      expect(data.data[0].qrCodeName).toBe('Test QR 1')
      expect(data.data[0].device).toBe('mobile')
      expect(data.data[1].country).toBe('CA')
      expect(data.pagination.total).toBe(2)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(100)
    })

    it('should filter scans by qrCodeId when provided', async () => {
      const mockScans = [
        {
          id: 'scan1',
          qrCodeId: 'qr1',
          qrCode: {
            id: 'qr1',
            name: 'Test QR 1',
            type: 'url',
            shortUrl: 'https://short.ly/abc123'
          },
          scannedAt: new Date('2024-01-15T10:00:00Z'),
          device: 'mobile',
          os: 'iOS',
          browser: 'Safari',
          country: 'US',
          city: 'New York',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          latitude: 40.7128,
          longitude: -74.0060
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue(mockScans)
      prisma.scan.count.mockResolvedValue(1)

      const request = createMockRequest('GET', '/api/v1/scans?qrCodeId=qr1')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].qrCodeId).toBe('qr1')
      
      // Verify the filter was applied correctly
      expect(prisma.scan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            qrCodeId: 'qr1'
          })
        })
      )
    })

    it('should filter scans by timestamp when "since" parameter is provided', async () => {
      const sinceDate = new Date('2024-01-15T09:00:00Z')
      const mockScans = [
        {
          id: 'scan1',
          qrCodeId: 'qr1',
          qrCode: {
            id: 'qr1',
            name: 'Test QR 1',
            type: 'url',
            shortUrl: 'https://short.ly/abc123'
          },
          scannedAt: new Date('2024-01-15T10:00:00Z'),
          device: 'mobile',
          os: 'iOS',
          browser: 'Safari',
          country: 'US',
          city: 'New York',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          latitude: null,
          longitude: null
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue(mockScans)
      prisma.scan.count.mockResolvedValue(1)

      const request = createMockRequest('GET', `/api/v1/scans?since=${sinceDate.toISOString()}`)
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      
      // Verify the timestamp filter was applied
      expect(prisma.scan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            scannedAt: expect.objectContaining({
              gt: expect.any(Date)
            })
          })
        })
      )
    })

    it('should support pagination with page and limit parameters', async () => {
      const mockScans = [
        {
          id: 'scan3',
          qrCodeId: 'qr1',
          qrCode: {
            id: 'qr1',
            name: 'Test QR 1',
            type: 'url',
            shortUrl: 'https://short.ly/abc123'
          },
          scannedAt: new Date('2024-01-15T12:00:00Z'),
          device: 'tablet',
          os: 'iPadOS',
          browser: 'Safari',
          country: 'UK',
          city: 'London',
          ip: '192.168.1.3',
          userAgent: 'Mozilla/5.0 (iPad)',
          latitude: null,
          longitude: null
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue(mockScans)
      prisma.scan.count.mockResolvedValue(50)

      const request = createMockRequest('GET', '/api/v1/scans?page=2&limit=10')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(2)
      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.total).toBe(50)
      expect(data.pagination.pages).toBe(5)
      
      // Verify pagination was applied correctly
      expect(prisma.scan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page - 1) * limit = (2 - 1) * 10
          take: 10
        })
      )
    })

    it('should limit maximum page size to 100', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue([])
      prisma.scan.count.mockResolvedValue(0)

      const request = createMockRequest('GET', '/api/v1/scans?limit=200')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.limit).toBe(100) // Should be capped at 100
      
      // Verify the limit was capped
      expect(prisma.scan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100
        })
      )
    })

    it('should return 401 for missing API key', async () => {
      const request = createMockRequest('GET', '/api/v1/scans')
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
      
      const request = createMockRequest('GET', '/api/v1/scans')
      const requestWithAuth = addApiKeyToRequest(request, limitedApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Insufficient permissions')
    })

    it('should only return scans from non-deleted QR codes', async () => {
      const mockScans = [
        {
          id: 'scan1',
          qrCodeId: 'qr1',
          qrCode: {
            id: 'qr1',
            name: 'Test QR 1',
            type: 'url',
            shortUrl: 'https://short.ly/abc123'
          },
          scannedAt: new Date('2024-01-15T10:00:00Z'),
          device: 'mobile',
          os: 'iOS',
          browser: 'Safari',
          country: 'US',
          city: 'New York',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          latitude: null,
          longitude: null
        },
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue(mockScans)
      prisma.scan.count.mockResolvedValue(1)

      const request = createMockRequest('GET', '/api/v1/scans')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)

      expect(response.status).toBe(200)
      
      // Verify the filter excludes deleted QR codes
      expect(prisma.scan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            qrCode: expect.objectContaining({
              isDeleted: false
            })
          })
        })
      )
    })

    it('should order scans by scannedAt descending (newest first)', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue([])
      prisma.scan.count.mockResolvedValue(0)

      const request = createMockRequest('GET', '/api/v1/scans')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)

      expect(response.status).toBe(200)
      
      // Verify the ordering
      expect(prisma.scan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { scannedAt: 'desc' }
        })
      )
    })

    it('should include all scan details in response', async () => {
      const mockScan = {
        id: 'scan1',
        qrCodeId: 'qr1',
        qrCode: {
          id: 'qr1',
          name: 'Test QR with All Data',
          type: 'url',
          shortUrl: 'https://short.ly/test123'
        },
        scannedAt: new Date('2024-01-15T10:30:00Z'),
        device: 'mobile',
        os: 'Android',
        browser: 'Chrome',
        country: 'JP',
        city: 'Tokyo',
        ipAddress: '203.0.113.42',
        userAgent: 'Mozilla/5.0 (Android 11)',
      }

      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue([mockScan])
      prisma.scan.count.mockResolvedValue(1)

      const request = createMockRequest('GET', '/api/v1/scans')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(1)
      
      const scan = data.data[0]
      expect(scan).toMatchObject({
        id: 'scan1',
        qrCodeId: 'qr1',
        qrCodeName: 'Test QR with All Data',
        qrCodeType: 'url',
        shortUrl: 'https://short.ly/test123',
        device: 'mobile',
        os: 'Android',
        browser: 'Chrome',
        country: 'JP',
        city: 'Tokyo',
        ip: '203.0.113.42',
        userAgent: 'Mozilla/5.0 (Android 11)',
      })
      expect(scan.scannedAt).toBeDefined()
    })

    it('should return empty data array when no scans exist', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.scan.findMany.mockResolvedValue([])
      prisma.scan.count.mockResolvedValue(0)

      const request = createMockRequest('GET', '/api/v1/scans')
      const requestWithAuth = addApiKeyToRequest(request, testApiKey.key)

      const response = await GET(requestWithAuth)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual([])
      expect(data.pagination.total).toBe(0)
      expect(data.pagination.pages).toBe(0)
    })
  })
})

