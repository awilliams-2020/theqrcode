import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { qrCodeId, message, shareMethod, email, subject } = await request.json()

    if (!qrCodeId || !message || !shareMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: qrCodeId, message, shareMethod' },
        { status: 400 }
      )
    }

    // Verify the QR code belongs to the user
    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id: qrCodeId,
        userId: session.user.id
      }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Store the share action (for analytics)
    const shareRecord = await prisma.qrShare.create({
      data: {
        qrCodeId,
        userId: session.user.id,
        message,
        shareMethod,
        email: email || null,
        subject: subject || null
      }
    })

    // Generate share URL
    const shareUrl = `${process.env.NEXTAUTH_URL}/share/${qrCode.id}?msg=${encodeURIComponent(message)}`

    return NextResponse.json({
      success: true,
      shareUrl,
      shareId: shareRecord.id
    })

  } catch (error) {
    console.error('Error creating share:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const qrCodeId = searchParams.get('qrCodeId')

    if (!qrCodeId) {
      return NextResponse.json({ error: 'Missing qrCodeId parameter' }, { status: 400 })
    }

    // Get share history for this QR code
    const shares = await prisma.qrShare.findMany({
      where: {
        qrCodeId,
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({ shares })

  } catch (error) {
    console.error('Error fetching shares:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
