import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { QRGeneratorServer } from '@/lib/qr-generator-server'
import { URLShortener } from '@/lib/url-shortener'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const qrCodes = await prisma.qrCode.findMany({
      where: { userId: (session.user as any).id },
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

    return NextResponse.json(qrCodes)
  } catch (error) {
    console.error('Error fetching QR codes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
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
        where: { userId: (session.user as any).id }
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

    // Generate QR code image with the appropriate content
    // For contact types, always use the original content (vCard) for proper mobile handling
    // For other dynamic QR codes, use the short URL; for static, use the original content
    const qrContent = (isDynamic && shortUrl && type !== 'contact') ? shortUrl : content
    
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
      frame: frameSettings
    })

    return NextResponse.json({
      ...qrCode,
      qrImage
    })
  } catch (error) {
    console.error('Error creating QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
