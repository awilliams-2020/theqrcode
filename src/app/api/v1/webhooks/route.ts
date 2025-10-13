import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

/**
 * GET /api/v1/webhooks
 * List all webhooks for the authenticated user (Business plan only)
 */
async function getWebhooks(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { userId: auth.userId },
      include: {
        _count: {
          select: {
            webhookEvents: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const response = webhooks.map(webhook => ({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      lastTriggeredAt: webhook.lastTriggeredAt,
      failureCount: webhook.failureCount,
      eventCount: webhook._count.webhookEvents,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    }))

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse({ data: response })
  } catch (error) {
    console.error('Error fetching webhooks:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to fetch webhooks', 500)
  }
}

/**
 * POST /api/v1/webhooks
 * Create a new webhook (Business plan only)
 */
async function createWebhook(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const body = await req.json()
    const { name, url, events } = body

    // Validate required fields
    if (!name || !url || !events || !Array.isArray(events)) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('Missing required fields: name, url, events', 400)
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('Invalid webhook URL', 400)
    }

    // Validate events
    const validEvents = ['scan.created', 'scan.updated', 'qr.created', 'qr.updated', 'qr.deleted']
    const invalidEvents = events.filter((event: string) => !validEvents.includes(event))
    
    if (invalidEvents.length > 0) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse(`Invalid events: ${invalidEvents.join(', ')}`, 400)
    }

    // Generate webhook secret
    const secret = randomBytes(32).toString('hex')

    // Create webhook
    const webhook = await prisma.webhook.create({
      data: {
        userId: auth.userId,
        name,
        url,
        events,
        secret
      }
    })

    const response = {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      secret: webhook.secret, // Only returned on creation
      isActive: webhook.isActive,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 201, responseTime)

    return createApiResponse(response, 201)
  } catch (error) {
    console.error('Error creating webhook:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to create webhook', 500)
  }
}

// Export handlers with authentication (Business plan only)
export const GET = withApiAuth(getWebhooks, {
  requiredPermissions: ['webhooks:manage']
})

export const POST = withApiAuth(createWebhook, {
  requiredPermissions: ['webhooks:manage']
})
