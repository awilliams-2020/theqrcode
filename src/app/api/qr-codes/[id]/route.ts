import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { URLShortener } from '@/lib/url-shortener'
import { trackQRCode } from '@/lib/matomo-tracking'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        isDeleted: false // Exclude soft-deleted QR codes
      },
      include: {
        scans: {
          orderBy: { scannedAt: 'desc' }
        }
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    return NextResponse.json(qrCode)
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const body = await request.json()
    const { name, type, content, settings, isDynamic } = body

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        isDeleted: false // Exclude soft-deleted QR codes
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Check if we need to generate a short URL for dynamic QR codes
    let shortUrl = qrCode.shortUrl
    if (isDynamic && !shortUrl) {
      // Generate short URL for newly enabled dynamic QR codes
      shortUrl = await URLShortener.generateShortUrl(id)
    } else if (!isDynamic && shortUrl) {
      // Remove short URL if disabling dynamic features
      shortUrl = null
    }

    const updatedQrCode = await prisma.qrCode.update({
      where: { id: id },
      data: {
        name,
        type,
        content,
        settings: settings || {},
        isDynamic: isDynamic || false,
        shortUrl,
        updatedAt: new Date()
      }
    })

    // Track QR code update in Matomo (async, don't block response)
    trackQRCode.update(
      session.user.id,
      id,
      type,
      isDynamic || false,
      {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    ).catch(err => console.error('Failed to track QR code update:', err))

    return NextResponse.json(updatedQrCode)
  } catch (error) {
    console.error('Error updating QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        isDeleted: false // Only allow deleting non-deleted QR codes
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Soft delete: mark as deleted but keep in database for analytics
    await prisma.qrCode.update({
      where: { id: id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })

    // Track QR code deletion in Matomo (async, don't block response)
    trackQRCode.delete(
      session.user.id,
      id,
      qrCode.type,
      qrCode.isDynamic,
      {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      }
    ).catch(err => console.error('Failed to track QR code deletion:', err))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
