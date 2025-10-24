import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ApiKeyManager } from '@/lib/api-key-utils'
import { RateLimiter } from '@/lib/rate-limiter'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/v1/api-keys/[id]
 * Get a specific API key by ID
 */
async function getApiKey(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await context.params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Pro plan or is in trial
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const isTrialActive = subscription?.status === 'trialing' && subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()
    const hasApiAccess = subscription?.plan === 'pro' || subscription?.plan === 'business' || (isTrialActive && (subscription?.plan === 'pro' || subscription?.plan === 'business'))

    if (!hasApiAccess) {
      return NextResponse.json({ error: 'API access requires Pro plan or active trial' }, { status: 403 })
    }

    // Get API key details
    const apiKeys = await ApiKeyManager.getUserApiKeys(session.user.id)
    const apiKey = apiKeys.find(key => key.id === id)

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    // Get usage statistics
    const usageStats = await RateLimiter.getUsageStats(id, '24h')

    const response = {
      ...apiKey,
      usage: usageStats
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json({ error: 'Failed to fetch API key' }, { status: 500 })
  }
}

/**
 * PUT /api/v1/api-keys/[id]
 * Update a specific API key
 */
async function updateApiKey(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await context.params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    const { name, permissions, expiresAt } = body

    // Check if user has Pro plan or is in trial
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const isTrialActive = subscription?.status === 'trialing' && subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()
    const hasApiAccess = subscription?.plan === 'pro' || subscription?.plan === 'business' || (isTrialActive && (subscription?.plan === 'pro' || subscription?.plan === 'business'))

    if (!hasApiAccess) {
      return NextResponse.json({ error: 'API access requires Pro plan or active trial' }, { status: 403 })
    }

    const planPermissions = ApiKeyManager.getPlanPermissions(subscription?.plan || 'free')

    // Validate permissions if provided
    if (permissions) {
      const invalidPermissions = permissions.filter((permission: string) => 
        !planPermissions.includes(permission) && !planPermissions.includes('*')
      )

      if (invalidPermissions.length > 0) {
        return NextResponse.json({ error: `Invalid permissions for your plan: ${invalidPermissions.join(', ')}` }, { status: 403 })
      }
    }

    // Update API key
    const updatedApiKey = await ApiKeyManager.updateApiKey(session.user.id, id, {
      name,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    })

    if (!updatedApiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json(updatedApiKey)
  } catch (error) {
    console.error('Error updating API key:', error)
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 })
  }
}

/**
 * DELETE /api/v1/api-keys/[id]
 * Delete a specific API key
 */
async function deleteApiKey(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await context.params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Pro plan or is in trial
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const isTrialActive = subscription?.status === 'trialing' && subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()
    const hasApiAccess = subscription?.plan === 'pro' || subscription?.plan === 'business' || (isTrialActive && (subscription?.plan === 'pro' || subscription?.plan === 'business'))

    if (!hasApiAccess) {
      return NextResponse.json({ error: 'API access requires Pro plan or active trial' }, { status: 403 })
    }

    const deleted = await ApiKeyManager.deleteApiKey(session.user.id, id)

    if (!deleted) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
  }
}

// Export handlers with session authentication
export const GET = getApiKey
export const PUT = updateApiKey
export const DELETE = deleteApiKey
