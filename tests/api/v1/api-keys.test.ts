import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/v1/api-keys/route'
import { GET as GET_KEY, PUT, DELETE } from '@/app/api/v1/api-keys/[id]/route'
import { 
  createTestUser, 
  createTestApiKey, 
  createMockRequest, 
  addApiKeyToRequest,
  cleanupTestData 
} from '../test-utils'

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock auth options
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

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
      findFirst: jest.fn(),
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
    getUsageStats: jest.fn().mockResolvedValue({
      totalRequests: 100,
      requestsToday: 25,
      requestsThisHour: 5,
      averageResponseTime: 150
    }),
  },
}))

// Mock API key manager
jest.mock('@/lib/api-key-utils', () => ({
  ApiKeyManager: {
    getUserApiKeys: jest.fn(),
    createApiKey: jest.fn(),
    updateApiKey: jest.fn(),
    deleteApiKey: jest.fn(),
    validateApiKey: jest.fn().mockResolvedValue({
      id: 'test-key-id',
      userId: 'test-user-id',
      permissions: ['*'],
      rateLimit: 1000,
      isActive: true,
      expiresAt: null
    }),
    hasPermission: jest.fn().mockReturnValue(true),
    getApiKeyById: jest.fn(),
    getPlanPermissions: jest.fn(),
    getPlanRateLimit: jest.fn(),
  },
}))


describe('API Keys Management', () => {
  let testUser: any
  let testApiKey: any

  beforeEach(async () => {
    await cleanupTestData()
    testUser = await createTestUser('pro')
    testApiKey = await createTestApiKey(testUser.id, ['*'])
    
    // Mock getServerSession to return test user
    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue({
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      }
    })
    
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

  describe('GET /api/v1/api-keys', () => {
    it('should return API keys for authenticated user', async () => {
      const mockApiKeys = [
        {
          id: 'key1',
          name: 'Test API Key 1',
          keyPrefix: 'qr_abc123',
          permissions: ['qr:read', 'qr:write'],
          rateLimit: 1000,
          lastUsedAt: new Date(),
          expiresAt: null,
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'key2',
          name: 'Test API Key 2',
          keyPrefix: 'qr_def456',
          permissions: ['analytics:read'],
          rateLimit: 1000,
          lastUsedAt: null,
          expiresAt: new Date(Date.now() + 86400000), // 1 day from now
          isActive: true,
          createdAt: new Date(),
        },
      ]

      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getUserApiKeys.mockResolvedValue(mockApiKeys)

      const request = createMockRequest('GET', '/api/v1/api-keys')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].name).toBe('Test API Key 1')
      expect(data.data[0].keyPrefix).toBe('qr_abc123')
      expect(data.data[1].expiresAt).toBeDefined()
    })

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth')
      getServerSession.mockResolvedValue(null)

      const request = createMockRequest('GET', '/api/v1/api-keys')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })
  })

  describe('POST /api/v1/api-keys', () => {
    it('should create a new API key', async () => {
      const mockApiKey = {
        id: 'key1',
        name: 'New API Key',
        keyPrefix: 'qr_xyz789',
        permissions: ['qr:read', 'qr:write'],
        rateLimit: 1000,
        lastUsedAt: null,
        expiresAt: null,
        isActive: true,
        createdAt: new Date(),
      }

      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getPlanPermissions.mockReturnValue(['qr:read', 'qr:write', 'analytics:read'])
      ApiKeyManager.getPlanRateLimit.mockReturnValue(1000)
      ApiKeyManager.createApiKey.mockResolvedValue({
        apiKey: 'qr_xyz789abcdef',
        apiKeyData: mockApiKey
      })

      const request = createMockRequest('POST', '/api/v1/api-keys', {
        name: 'New API Key',
        permissions: ['qr:read', 'qr:write'],
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe('New API Key')
      expect(data.keyPrefix).toBe('qr_xyz789')
      expect(data.apiKey).toBe('qr_xyz789abcdef') // Only returned on creation
    })

    it('should return 400 for missing required fields', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })

      const request = createMockRequest('POST', '/api/v1/api-keys', {
        // Missing name
        permissions: ['qr:read'],
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing required field: name')
    })

    it('should return 403 for user without API access', async () => {
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'free',
        status: 'active'
      })

      const request = createMockRequest('POST', '/api/v1/api-keys', {
        name: 'New API Key',
        permissions: ['qr:read'],
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('API access requires Pro plan')
    })

    it('should return 403 for invalid permissions', async () => {
      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getPlanPermissions.mockReturnValue(['qr:read', 'qr:write', 'analytics:read'])
      ApiKeyManager.getPlanRateLimit.mockReturnValue(1000)

      const request = createMockRequest('POST', '/api/v1/api-keys', {
        name: 'New API Key',
        permissions: ['qr:read', 'webhooks:manage'], // webhooks:manage not allowed for pro plan
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Invalid permissions for your plan')
    })

    it('should use plan permissions when none provided', async () => {
      const mockApiKey = {
        id: 'key1',
        name: 'New API Key',
        keyPrefix: 'qr_abc123',
        permissions: ['qr:read', 'qr:write', 'analytics:read'],
        rateLimit: 1000,
        lastUsedAt: null,
        expiresAt: null,
        isActive: true,
        createdAt: new Date(),
      }

      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getPlanPermissions.mockReturnValue(['qr:read', 'qr:write', 'analytics:read'])
      ApiKeyManager.getPlanRateLimit.mockReturnValue(1000)
      ApiKeyManager.createApiKey.mockResolvedValue({
        apiKey: 'qr_abc123def456',
        apiKeyData: mockApiKey
      })

      const request = createMockRequest('POST', '/api/v1/api-keys', {
        name: 'New API Key',
        // No permissions provided - should use plan defaults
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(ApiKeyManager.createApiKey).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          name: 'New API Key',
        })
      )
    })
  })

  describe('GET /api/v1/api-keys/[id]', () => {
    it('should return a specific API key with usage stats', async () => {
      const mockApiKey = {
        id: 'key1',
        name: 'Test API Key',
        keyPrefix: 'qr_abc123',
        permissions: ['qr:read', 'qr:write'],
        rateLimit: 1000,
        lastUsedAt: new Date(),
        expiresAt: null,
        isActive: true,
        createdAt: new Date(),
      }

      const mockUsageStats = {
        totalRequests: 150,
        successfulRequests: 140,
        failedRequests: 10,
        averageResponseTime: 250,
        topEndpoints: [
          { endpoint: '/api/v1/qr-codes', count: 100 },
          { endpoint: '/api/v1/analytics', count: 50 },
        ],
      }

      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { RateLimiter } = require('@/lib/rate-limiter')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getUserApiKeys.mockResolvedValue([mockApiKey])
      RateLimiter.getUsageStats.mockResolvedValue(mockUsageStats)

      const request = createMockRequest('GET', '/api/v1/api-keys/key1')

      const response = await GET_KEY(request, { params: Promise.resolve({ id: 'key1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('key1')
      expect(data.name).toBe('Test API Key')
      expect(data.usage).toEqual(mockUsageStats)
    })

    it('should return 404 for non-existent API key', async () => {
      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getUserApiKeys.mockResolvedValue([])

      const request = createMockRequest('GET', '/api/v1/api-keys/nonexistent')

      const response = await GET_KEY(request, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('API key not found')
    })
  })

  describe('PUT /api/v1/api-keys/[id]', () => {
    it('should update an API key', async () => {
      const mockUpdatedApiKey = {
        id: 'key1',
        name: 'Updated API Key',
        keyPrefix: 'qr_abc123',
        permissions: ['qr:read', 'analytics:read'],
        rateLimit: 1000,
        lastUsedAt: new Date(),
        expiresAt: null,
        isActive: true,
        createdAt: new Date(),
      }

      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getPlanPermissions.mockReturnValue(['qr:read', 'qr:write', 'analytics:read'])
      ApiKeyManager.updateApiKey.mockResolvedValue(mockUpdatedApiKey)

      const request = createMockRequest('PUT', '/api/v1/api-keys/key1', {
        name: 'Updated API Key',
        permissions: ['qr:read', 'analytics:read'],
      })

      const response = await PUT(request, { params: Promise.resolve({ id: 'key1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.name).toBe('Updated API Key')
      expect(data.permissions).toEqual(['qr:read', 'analytics:read'])
    })

    it('should return 404 for non-existent API key', async () => {
      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.updateApiKey.mockResolvedValue(null)

      const request = createMockRequest('PUT', '/api/v1/api-keys/nonexistent', {
        name: 'Updated API Key',
      })

      const response = await PUT(request, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('API key not found')
    })

    it('should return 403 for invalid permissions', async () => {
      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.getPlanPermissions.mockReturnValue(['qr:read', 'qr:write', 'analytics:read'])

      const request = createMockRequest('PUT', '/api/v1/api-keys/key1', {
        permissions: ['webhooks:manage'], // Not allowed for pro plan
      })

      const response = await PUT(request, { params: Promise.resolve({ id: 'key1' }) })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Invalid permissions for your plan')
    })
  })

  describe('DELETE /api/v1/api-keys/[id]', () => {
    it('should delete an API key', async () => {
      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.deleteApiKey.mockResolvedValue(true)

      const request = createMockRequest('DELETE', '/api/v1/api-keys/key1')

      const response = await DELETE(request, { params: Promise.resolve({ id: 'key1' }) })

      expect(response.status).toBe(204)
    })

    it('should return 404 for non-existent API key', async () => {
      const { ApiKeyManager } = require('@/lib/api-key-utils')
      const { prisma } = require('@/lib/prisma')
      
      prisma.subscription.findUnique.mockResolvedValue({ 
        userId: testUser.id,
        plan: 'pro',
        status: 'active'
      })
      ApiKeyManager.deleteApiKey.mockResolvedValue(false)

      const request = createMockRequest('DELETE', '/api/v1/api-keys/nonexistent')

      const response = await DELETE(request, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('API key not found')
    })
  })
})
