import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { URLShortener } from '@/lib/url-shortener'
import { notifyMilestone, notifyPlanLimitApproaching, createNotification, sendUsageTip } from '@/lib/engagement/notifications'
import { startRequestTiming, endRequestTiming } from '@/lib/monitoring-setup'
import { trackQRCode } from '@/lib/matomo-tracking'
import { captureException } from '@/lib/sentry'
import { logger } from '@/lib/logger'

function extractIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return 'unknown'
}

export async function GET(request: NextRequest) {
  const requestId = startRequestTiming()
  
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const qrCodes = await prisma.qrCode.findMany({
      where: { 
        userId: (session.user as any).id,
        isDeleted: false // Exclude soft-deleted QR codes
      },
      include: {
        scans: {
          select: {
            id: true,
            scannedAt: true,
            device: true,
            country: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 200, 
      request.headers.get('user-agent') || undefined, extractIP(request))
    
    return NextResponse.json(qrCodes)
  } catch (error) {
    logger.logError(error, 'API', 'Error fetching QR codes', { 
      endpoint: '/api/qr-codes', 
      method: 'GET',
      requestId 
    })
    captureException(error, { endpoint: '/api/qr-codes', method: 'GET' })
    
    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 500, 
      request.headers.get('user-agent') || undefined, extractIP(request))
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const requestId = startRequestTiming()
  let session: any = null
  
  try {
    session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, content, settings, isDynamic } = body

    // Validate input
    if (!name || !type || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check user's plan limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: (session.user as any).id }
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
          userId: (session.user as any).id,
          isDeleted: false // Only count non-deleted QR codes
        }
      })

      if (currentCount >= limits.qrCodes) {
        return NextResponse.json({ 
          error: 'QR code limit reached for your plan' 
        }, { status: 403 })
      }
    }

    const qrCode = await prisma.qrCode.create({
      data: {
        userId: (session.user as any).id,
        name,
        type,
        content,
        shortUrl: null, // Will be set after creation for dynamic QR codes
        settings: settings || {},
        isDynamic: isDynamic || false
      }
    })

    // Generate short URL for dynamic QR codes after creation
    let shortUrl = null
    if (isDynamic) {
      shortUrl = await URLShortener.generateShortUrl(qrCode.id)
      await prisma.qrCode.update({
        where: { id: qrCode.id },
        data: { shortUrl }
      })
    }

    // Get updated QR code count for notifications
    const newQrCodeCount = await prisma.qrCode.count({
      where: { 
        userId: (session.user as any).id,
        isDeleted: false // Only count non-deleted QR codes
      }
    })

    // Send notifications asynchronously (don't block response)
    const userId = (session.user as any).id
    
    // Check for milestones
    const milestones = [1, 5, 10, 25, 50, 100, 250, 500]
    if (milestones.includes(newQrCodeCount)) {
      notifyMilestone(userId, 'qr_codes', newQrCodeCount).catch(err => 
        console.error('Failed to send milestone notification:', err)
      )
    }

    // Send a tip for first QR code (only for pro users)
    if (newQrCodeCount === 1) {
      sendUsageTip(userId).catch(err => console.error('Failed to send first QR tip:', err))
    }

    // Check if approaching plan limit (80%+)
    if (limits.qrCodes !== -1 && newQrCodeCount >= limits.qrCodes * 0.8) {
      notifyPlanLimitApproaching(userId, 'QR codes', newQrCodeCount, limits.qrCodes).catch(err =>
        console.error('Failed to send plan limit notification:', err)
      )
    }

    // Generate QR code image with the appropriate content
    // For dynamic QR codes, use the short URL for tracking; for static, use the original content
    const qrContent = (isDynamic && shortUrl) ? shortUrl : content
    
    // Ensure frame settings include size with proper fallback
    const frameSettings = settings?.frame || { style: 'square', color: '#000000', size: 20 }
    if (!frameSettings.size) {
      frameSettings.size = 20
    }
    
    const qrImage = await QRGeneratorServer.generateQRCode({
      type,
      content: qrContent,
      size: settings?.size || 256,
      color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
      frame: frameSettings,
      logo: (settings?.logo as any)?.enabled ? {
        dataUrl: (settings.logo as any).dataUrl,
        size: (settings.logo as any).size
      } : undefined
    })

    // Track QR code creation in Matomo (async, don't block response)
    trackQRCode.create(
      userId,
      qrCode.id,
      type,
      isDynamic || false,
      currentPlan,
      newQrCodeCount,
      {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    ).catch(err => console.error('Failed to track QR code creation:', err))

    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 200, 
      request.headers.get('user-agent') || undefined, extractIP(request))
    
    // Get the updated QR code with the shortUrl
    const finalQrCode = await prisma.qrCode.findUnique({
      where: { id: qrCode.id }
    })
    
    return NextResponse.json({
      ...finalQrCode,
      qrImage
    })
  } catch (error) {
    logger.logError(error, 'QR-CODE', 'Error creating QR code', {
      endpoint: '/api/qr-codes',
      method: 'POST',
      userId: session?.user?.id,
      requestId
    })
    captureException(error, {
      endpoint: '/api/qr-codes',
      method: 'POST',
      userId: session?.user?.id
    })
    
    endRequestTiming(requestId, request.nextUrl.pathname, request.method, 500, 
      request.headers.get('user-agent') || undefined, extractIP(request))
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
