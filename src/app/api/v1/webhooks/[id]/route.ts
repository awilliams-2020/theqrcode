import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/v1/webhooks/[id]
 * Get a specific webhook by ID (Business plan only)
 */
async function getWebhook(req: NextRequest, auth: any, params: { id: string }): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { id } = params

    const webhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: auth.userId
      },
      include: {
        webhookEvents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            webhookEvents: true
          }
        }
      }
    })

    if (!webhook) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 404, responseTime)
      return createErrorResponse('Webhook not found', 404)
    }

    const response = {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      lastTriggeredAt: webhook.lastTriggeredAt,
      failureCount: webhook.failureCount,
      eventCount: webhook._count.webhookEvents,
      recentEvents: webhook.webhookEvents.map(event => ({
        id: event.id,
        eventType: event.eventType,
        status: event.status,
        attempts: event.attempts,
        createdAt: event.createdAt,
        deliveredAt: event.deliveredAt
      })),
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error fetching webhook:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to fetch webhook', 500)
  }
}

/**
 * PUT /api/v1/webhooks/[id]
 * Update a specific webhook (Business plan only)
 */
async function updateWebhook(req: NextRequest, auth: any, params: { id: string }): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { id } = params
    const body = await req.json()
    const { name, url, events, isActive } = body

    // Check if webhook exists and belongs to user
    const existingWebhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: auth.userId
      }
    })

    if (!existingWebhook) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 404, responseTime)
      return createErrorResponse('Webhook not found', 404)
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url)
      } catch {
        const responseTime = Date.now() - startTime
        await recordApiUsage(req, auth, 400, responseTime)
        return createErrorResponse('Invalid webhook URL', 400)
      }
    }

    // Validate events if provided
    if (events) {
      const validEvents = ['scan.created', 'scan.updated', 'qr.created', 'qr.updated', 'qr.deleted']
      const invalidEvents = events.filter((event: string) => !validEvents.includes(event))
      
      if (invalidEvents.length > 0) {
        const responseTime = Date.now() - startTime
        await recordApiUsage(req, auth, 400, responseTime)
        return createErrorResponse(`Invalid events: ${invalidEvents.join(', ')}`, 400)
      }
    }

    // Update webhook
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (url !== undefined) updateData.url = url
    if (events !== undefined) updateData.events = events
    if (isActive !== undefined) updateData.isActive = isActive

    const webhook = await prisma.webhook.update({
      where: { id },
      data: updateData
    })

    const response = {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive,
      lastTriggeredAt: webhook.lastTriggeredAt,
      failureCount: webhook.failureCount,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error updating webhook:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to update webhook', 500)
  }
}

/**
 * DELETE /api/v1/webhooks/[id]
 * Delete a specific webhook (Business plan only)
 */
async function deleteWebhook(req: NextRequest, auth: any, params: { id: string }): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { id } = params

    // Check if webhook exists and belongs to user
    const existingWebhook = await prisma.webhook.findFirst({
      where: {
        id,
        userId: auth.userId
      }
    })

    if (!existingWebhook) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 404, responseTime)
      return createErrorResponse('Webhook not found', 404)
    }

    // Delete webhook (cascades to webhook events)
    await prisma.webhook.delete({
      where: { id }
    })

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 204, responseTime)

    return createApiResponse(null, 204)
  } catch (error) {
    console.error('Error deleting webhook:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to delete webhook', 500)
  }
}

// Export handlers with authentication (Business plan only)
export const GET = withApiAuth(getWebhook, {
  requiredPermissions: ['webhooks:manage']
})

export const PUT = withApiAuth(updateWebhook, {
  requiredPermissions: ['webhooks:manage']
})

export const DELETE = withApiAuth(deleteWebhook, {
  requiredPermissions: ['webhooks:manage']
})
