import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { URLShortener } from '@/lib/url-shortener'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const shortCode = params.shortCode
    const shortUrl = URLShortener.getFullShortUrl(shortCode)
    
    // Find the QR code by short URL
    const qrCode = await prisma.qrCode.findUnique({
      where: { shortUrl }
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Return QR code information without redirecting
    return NextResponse.json({
      id: qrCode.id,
      name: qrCode.name,
      type: qrCode.type,
      content: qrCode.content,
      isDynamic: qrCode.isDynamic,
      settings: qrCode.settings,
      createdAt: qrCode.createdAt
    })
  } catch (error) {
    console.error('Error fetching QR code info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
