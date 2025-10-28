import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { URLShortener } from '@/lib/url-shortener'

/**
 * POST /api/v1/qr-codes/bulk
 * Create multiple QR codes in a single request (Pro plan and above)
 */
async function createBulkQRCodes(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const body = await req.json()
    const { qrCodes } = body

    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('qrCodes must be a non-empty array', 400)
    }

    if (qrCodes.length > 100) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('Maximum 100 QR codes per bulk request', 400)
    }

    // Validate all QR codes
    for (const qrCode of qrCodes) {
      if (!qrCode.name || !qrCode.type || !qrCode.content) {
        const responseTime = Date.now() - startTime
        await recordApiUsage(req, auth, 400, responseTime)
        return createErrorResponse('Each QR code must have name, type, and content', 400)
      }
    }

    // Check user's plan limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: auth.userId }
    })

    const planLimits = {
      free: { qrCodes: 10 },
      starter: { qrCodes: 100 },
      pro: { qrCodes: 500 },
      business: { qrCodes: -1 }
    }

    const currentPlan = subscription?.plan || 'free'
    const limits = planLimits[currentPlan as keyof typeof planLimits]

    if (limits.qrCodes !== -1) {
      const currentCount = await prisma.qrCode.count({
        where: { 
          userId: auth.userId,
          isDeleted: false // Only count non-deleted QR codes
        }
      })

      if (currentCount + qrCodes.length > limits.qrCodes) {
        const responseTime = Date.now() - startTime
        await recordApiUsage(req, auth, 403, responseTime)
        return createErrorResponse('Bulk operation would exceed QR code limit for your plan', 403)
      }
    }

    // Create QR codes in batch
    const createdQRCodes = []
    const errors = []

    for (let i = 0; i < qrCodes.length; i++) {
      try {
        const { name, type, content, settings, isDynamic } = qrCodes[i]

        const qrCode = await prisma.qrCode.create({
          data: {
            userId: auth.userId,
            name,
            type,
            content,
            shortUrl: null,
            settings: settings || {},
            isDynamic: isDynamic || false
          }
        })

        // Generate short URL for dynamic QR codes
        let shortUrl = null
        if (isDynamic) {
          shortUrl = await URLShortener.generateShortUrl(qrCode.id)
          await prisma.qrCode.update({
            where: { id: qrCode.id },
            data: { shortUrl }
          })
        }

        // Generate QR code image
        const qrContent = (isDynamic && shortUrl && type !== 'contact') ? shortUrl : content
        const frameSettings = settings?.frame || { style: 'square', color: '#000000', size: 20 }
        if (!frameSettings.size) {
          frameSettings.size = 20
        }

        const qrImage = await QRGeneratorServer.generateQRCode({
          type,
          content: qrContent,
          size: settings?.size || 256,
          color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
          frame: frameSettings
        })

        createdQRCodes.push({
          id: qrCode.id,
          name: qrCode.name,
          type: qrCode.type,
          content: qrCode.content,
          shortUrl: qrCode.shortUrl,
          settings: qrCode.settings,
          isDynamic: qrCode.isDynamic,
          qrImage,
          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt
        })
      } catch (error) {
        console.error(`Error creating QR code ${i + 1}:`, error)
        errors.push({
          index: i,
          error: 'Failed to create QR code',
          data: qrCodes[i]
        })
      }
    }

    const response = {
      created: createdQRCodes,
      errors,
      summary: {
        total: qrCodes.length,
        successful: createdQRCodes.length,
        failed: errors.length
      }
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 201, responseTime)

    return createApiResponse(response, 201)
  } catch (error) {
    console.error('Error in bulk QR code creation:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to create bulk QR codes', 500)
  }
}

/**
 * DELETE /api/v1/qr-codes/bulk
 * Delete multiple QR codes in a single request (Pro plan and above)
 */
async function deleteBulkQRCodes(req: NextRequest, auth: any): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const body = await req.json()
    const { qrCodeIds } = body

    if (!Array.isArray(qrCodeIds) || qrCodeIds.length === 0) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('qrCodeIds must be a non-empty array', 400)
    }

    if (qrCodeIds.length > 100) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 400, responseTime)
      return createErrorResponse('Maximum 100 QR codes per bulk delete request', 400)
    }

    // Verify all QR codes belong to the user and are not already deleted
    const existingQRCodes = await prisma.qrCode.findMany({
      where: {
        id: { in: qrCodeIds },
        userId: auth.userId,
        isDeleted: false // Only allow deleting non-deleted QR codes
      },
      select: { id: true }
    })

    const existingIds = existingQRCodes.map(qr => qr.id)
    const notFoundIds = qrCodeIds.filter(id => !existingIds.includes(id))

    // Soft delete QR codes: mark as deleted but keep in database for analytics
    const deletedCount = await prisma.qrCode.updateMany({
      where: {
        id: { in: existingIds },
        userId: auth.userId
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    const response = {
      deleted: deletedCount.count,
      notFound: notFoundIds,
      summary: {
        total: qrCodeIds.length,
        deleted: deletedCount.count,
        notFound: notFoundIds.length
      }
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error in bulk QR code deletion:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to delete bulk QR codes', 500)
  }
}

// Export handlers with authentication (Pro plan and above)
export const POST = withApiAuth(createBulkQRCodes, {
  requiredPermissions: ['bulk:write']
})

export const DELETE = withApiAuth(deleteBulkQRCodes, {
  requiredPermissions: ['bulk:write']
})
