import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { URLShortener } from '@/lib/url-shortener'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, content, settings, isDynamic } = body

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Check if we need to generate a short URL for dynamic QR codes
    let shortUrl = qrCode.shortUrl
    if (isDynamic && !shortUrl) {
      // Generate short URL for newly enabled dynamic QR codes
      shortUrl = await URLShortener.generateShortUrl(params.id)
    } else if (!isDynamic && shortUrl) {
      // Remove short URL if disabling dynamic features
      shortUrl = null
    }

    const updatedQrCode = await prisma.qrCode.update({
      where: { id: params.id },
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

    return NextResponse.json(updatedQrCode)
  } catch (error) {
    console.error('Error updating QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    await prisma.qrCode.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting QR code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
