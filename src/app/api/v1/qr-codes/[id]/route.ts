import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, createApiResponse, createErrorResponse, recordApiUsage } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { URLShortener } from '@/lib/url-shortener'

/**
 * GET /api/v1/qr-codes/[id]
 * Get a specific QR code by ID
 */
async function getQRCode(req: NextRequest, auth: any, params: { id: string }): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { id } = params

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id,
        userId: auth.userId,
        isDeleted: false // Exclude soft-deleted QR codes
      },
      include: {
        scans: {
          select: {
            id: true,
            scannedAt: true,
            device: true,
            country: true,
            browser: true,
            os: true
          },
          orderBy: { scannedAt: 'desc' },
          take: 50 // Include recent scans
        }
      }
    })

    if (!qrCode) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 404, responseTime)
      return createErrorResponse('QR code not found', 404)
    }

    const response = {
      id: qrCode.id,
      name: qrCode.name,
      type: qrCode.type,
      content: qrCode.content,
      shortUrl: qrCode.shortUrl,
      settings: qrCode.settings,
      isDynamic: qrCode.isDynamic,
      scanCount: qrCode.scans.length,
      lastScanned: qrCode.scans[0]?.scannedAt || null,
      recentScans: qrCode.scans.slice(0, 10).map(scan => ({
        id: scan.id,
        scannedAt: scan.scannedAt,
        device: scan.device,
        country: scan.country,
        browser: scan.browser,
        os: scan.os
      })),
      createdAt: qrCode.createdAt,
      updatedAt: qrCode.updatedAt
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error fetching QR code:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to fetch QR code', 500)
  }
}

/**
 * PUT /api/v1/qr-codes/[id]
 * Update a specific QR code
 */
async function updateQRCode(req: NextRequest, auth: any, params: { id: string }): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { id } = params
    const body = await req.json()
    const { name, content, settings } = body

    // Check if QR code exists and belongs to user
    const existingQR = await prisma.qrCode.findFirst({
      where: {
        id,
        userId: auth.userId,
        isDeleted: false // Exclude soft-deleted QR codes
      }
    })

    if (!existingQR) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 404, responseTime)
      return createErrorResponse('QR code not found', 404)
    }

    // Update QR code
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (content !== undefined) updateData.content = content
    if (settings !== undefined) updateData.settings = settings

    const qrCode = await prisma.qrCode.update({
      where: { id },
      data: updateData
    })

    // Regenerate QR code image if content or settings changed
    let qrImage = null
    if (content !== undefined || settings !== undefined) {
      const qrContent = (qrCode.isDynamic && qrCode.shortUrl && qrCode.type !== 'contact') 
        ? qrCode.shortUrl 
        : qrCode.content
      
      const settings = qrCode.settings as any || {}
      const frameSettings = settings.frame || { style: 'square', color: '#000000', size: 20 }
      if (!frameSettings.size) {
        frameSettings.size = 20
      }

      qrImage = await QRGeneratorServer.generateQRCode({
        type: qrCode.type as 'email' | 'url' | 'contact' | 'text' | 'wifi',
        content: qrContent,
        size: settings.size || 256,
        color: settings.color || { dark: '#000000', light: '#FFFFFF' },
        frame: frameSettings
      })
    }

    const response = {
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
    }

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 200, responseTime)

    return createApiResponse(response)
  } catch (error) {
    console.error('Error updating QR code:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to update QR code', 500)
  }
}

/**
 * DELETE /api/v1/qr-codes/[id]
 * Delete a specific QR code
 */
async function deleteQRCode(req: NextRequest, auth: any, params: { id: string }): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    const { id } = params

    // Check if QR code exists and belongs to user
    const existingQR = await prisma.qrCode.findFirst({
      where: {
        id,
        userId: auth.userId,
        isDeleted: false // Only allow deleting non-deleted QR codes
      }
    })

    if (!existingQR) {
      const responseTime = Date.now() - startTime
      await recordApiUsage(req, auth, 404, responseTime)
      return createErrorResponse('QR code not found', 404)
    }

    // Soft delete: mark as deleted but keep in database for analytics
    await prisma.qrCode.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 204, responseTime)

    return createApiResponse(null, 204)
  } catch (error) {
    console.error('Error deleting QR code:', error)
    const responseTime = Date.now() - startTime
    await recordApiUsage(req, auth, 500, responseTime)
    return createErrorResponse('Failed to delete QR code', 500)
  }
}

// Export handlers with authentication
export const GET = withApiAuth(getQRCode, {
  requiredPermissions: ['qr:read']
})

export const PUT = withApiAuth(updateQRCode, {
  requiredPermissions: ['qr:write']
})

export const DELETE = withApiAuth(deleteQRCode, {
  requiredPermissions: ['qr:write']
})
