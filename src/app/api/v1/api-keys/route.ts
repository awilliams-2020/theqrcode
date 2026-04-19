import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ApiKeyManager } from '@/lib/api-key-utils'
import { prisma } from '@/lib/prisma'
import { captureException } from '@/lib/sentry'
import { hasApiAccess, isTrialActive, effectivePlan } from '@/lib/plan-utils'

/**
 * GET /api/v1/api-keys
 * List all API keys for the authenticated user
 */
async function getApiKeys(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has Pro plan or is in trial
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const trialActive = isTrialActive(subscription)
    const apiAccess   = hasApiAccess(subscription?.plan ?? '')

    if (!apiAccess) {
      return NextResponse.json({
        error: 'API access requires Developer or Pro plan',
        details: {
          plan: subscription?.plan,
          status: subscription?.status,
          trialActive,
          trialEndsAt: subscription?.trialEndsAt
        }
      }, { status: 403 })
    }

    const apiKeys = await ApiKeyManager.getUserApiKeys(session.user.id)
    return NextResponse.json({ data: apiKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    captureException(error, { endpoint: '/api/v1/api-keys', method: 'GET' })
    return NextResponse.json({ 
      error: 'Failed to fetch API keys',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * POST /api/v1/api-keys
 * Create a new API key
 */
async function createApiKey(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, permissions, environment = 'production', expiresAt } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 })
    }

    // Validate environment
    if (environment !== 'production' && environment !== 'sandbox') {
      return NextResponse.json({ error: 'Environment must be either "production" or "sandbox"' }, { status: 400 })
    }

    // Check if user has Pro plan or is in trial
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    })

    const trialActive = isTrialActive(subscription)
    const apiAccess   = hasApiAccess(subscription?.plan ?? '')

    if (!apiAccess) {
      return NextResponse.json({
        error: 'API access requires Developer or Pro plan',
        details: {
          plan: subscription?.plan,
          status: subscription?.status,
          trialActive,
          trialEndsAt: subscription?.trialEndsAt
        }
      }, { status: 403 })
    }

    const plan = effectivePlan(subscription)
    const planPermissions = ApiKeyManager.getPlanPermissions(plan)
    const planRateLimit   = ApiKeyManager.getPlanRateLimit(plan)

    // Use provided permissions or default to plan permissions
    const finalPermissions = permissions || planPermissions

    // Validate permissions are allowed for user's plan
    const invalidPermissions = finalPermissions.filter((permission: any) => 
      !planPermissions.includes(permission) && !planPermissions.includes('*')
    )

    if (invalidPermissions.length > 0) {
      return NextResponse.json({ error: `Invalid permissions for your plan: ${invalidPermissions.join(', ')}` }, { status: 403 })
    }

    // Create API key
    const { apiKey, apiKeyData } = await ApiKeyManager.createApiKey(session.user.id, {
      name,
      permissions: finalPermissions,
      rateLimit: planRateLimit,
      environment,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    })

    const response = {
      ...apiKeyData,
      apiKey // Only returned on creation
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating API key:', error)
    captureException(error, { endpoint: '/api/v1/api-keys', method: 'POST' })
    return NextResponse.json({ 
      error: 'Failed to create API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Export handlers with session authentication
export const GET = getApiKeys
export const POST = createApiKey
