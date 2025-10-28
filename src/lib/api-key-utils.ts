import { randomBytes, createHash } from 'crypto'
import { prisma } from './prisma'

export interface ApiKeyData {
  id: string
  name: string
  keyPrefix: string
  permissions: string[]
  rateLimit: number
  environment: string
  lastUsedAt: Date | null
  expiresAt: Date | null
  isActive: boolean
  createdAt: Date
}

export interface CreateApiKeyData {
  name: string
  permissions: string[]
  rateLimit?: number
  environment?: string
  expiresAt?: Date
}

export class ApiKeyManager {
  /**
   * Generate a new API key
   */
  static generateApiKey(): string {
    const key = randomBytes(32).toString('hex')
    return `qr_${key}`
  }

  /**
   * Hash an API key for secure storage
   */
  static hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex')
  }

  /**
   * Extract prefix from API key for identification
   */
  static getKeyPrefix(apiKey: string): string {
    return apiKey.substring(0, 8)
  }

  /**
   * Create a new API key for a user
   */
  static async createApiKey(
    userId: string, 
    data: CreateApiKeyData
  ): Promise<{ apiKey: string; apiKeyData: ApiKeyData }> {
    const apiKey = this.generateApiKey()
    const keyHash = this.hashApiKey(apiKey)
    const keyPrefix = this.getKeyPrefix(apiKey)

    const created = await prisma.apiKey.create({
      data: {
        userId,
        name: data.name,
        keyHash,
        keyPrefix,
        permissions: data.permissions,
        rateLimit: data.rateLimit || 1000,
        environment: data.environment || 'production',
        expiresAt: data.expiresAt
      }
    })

    return {
      apiKey,
      apiKeyData: {
        id: created.id,
        name: created.name,
        keyPrefix: created.keyPrefix,
        permissions: created.permissions,
        rateLimit: created.rateLimit,
        environment: created.environment,
        lastUsedAt: created.lastUsedAt,
        expiresAt: created.expiresAt,
        isActive: created.isActive,
        createdAt: created.createdAt
      }
    }
  }

  /**
   * Validate an API key and return user data
   */
  static async validateApiKey(apiKey: string): Promise<{
    id: string
    userId: string
    permissions: string[]
    rateLimit: number
    environment: string
    isActive: boolean
    expiresAt: Date | null
  } | null> {
    const keyHash = this.hashApiKey(apiKey)
    
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: true }
    })

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return null
    }

    // Check if expired
    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      return null
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() }
    })

    return {
      id: apiKeyRecord.id,
      userId: apiKeyRecord.userId,
      permissions: apiKeyRecord.permissions,
      rateLimit: apiKeyRecord.rateLimit,
      environment: apiKeyRecord.environment,
      isActive: apiKeyRecord.isActive,
      expiresAt: apiKeyRecord.expiresAt
    }
  }

  /**
   * Get user's API keys
   */
  static async getUserApiKeys(userId: string): Promise<ApiKeyData[]> {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
      environment: key.environment,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      isActive: key.isActive,
      createdAt: key.createdAt
    }))
  }

  /**
   * Delete an API key
   */
  static async deleteApiKey(userId: string, apiKeyId: string): Promise<boolean> {
    const deleted = await prisma.apiKey.deleteMany({
      where: {
        id: apiKeyId,
        userId
      }
    })

    return deleted.count > 0
  }

  /**
   * Update API key permissions
   */
  static async updateApiKey(
    userId: string, 
    apiKeyId: string, 
    updates: Partial<CreateApiKeyData>
  ): Promise<ApiKeyData | null> {
    const updated = await prisma.apiKey.updateMany({
      where: {
        id: apiKeyId,
        userId
      },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.permissions && { permissions: updates.permissions }),
        ...(updates.rateLimit && { rateLimit: updates.rateLimit }),
        ...(updates.expiresAt && { expiresAt: updates.expiresAt })
      }
    })

    if (updated.count === 0) return null

    const apiKey = await prisma.apiKey.findUnique({
      where: { id: apiKeyId }
    })

    return apiKey ? {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      permissions: apiKey.permissions,
      rateLimit: apiKey.rateLimit,
      environment: apiKey.environment,
      lastUsedAt: apiKey.lastUsedAt,
      expiresAt: apiKey.expiresAt,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt
    } : null
  }

  /**
   * Check if user has permission for an action
   */
  static hasPermission(permissions: string[], requiredPermission: string): boolean {
    return permissions.includes(requiredPermission) || permissions.includes('*')
  }

  /**
   * Get plan-based permissions
   */
  static getPlanPermissions(plan: string): string[] {
    switch (plan) {
      case 'pro':
        return [
          'qr:read',
          'qr:write', 
          'analytics:read',
          'webhooks:manage',
          'bulk:write'
        ]
      case 'business':
        return [
          'qr:read',
          'qr:write',
          'analytics:read',
          'analytics:advanced',
          'webhooks:manage',
          'team:read',
          'bulk:write'
        ]
      default:
        return []
    }
  }

  /**
   * Get plan-based rate limits
   */
  static getPlanRateLimit(plan: string): number {
    switch (plan) {
      case 'pro':
        return 5000 // 5,000 requests per hour
      case 'business':
        return 10000 // 10,000 requests per hour
      default:
        return 0
    }
  }
}
