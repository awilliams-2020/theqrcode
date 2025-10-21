import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { URLShortener } from '@/lib/url-shortener'
import { QRGeneratorServer } from '@/lib/qr-generator-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params
    
    // First try with current environment's base URL
    const shortUrl = URLShortener.getFullShortUrl(shortCode)
    let qrCode = await prisma.qrCode.findUnique({
      where: { shortUrl }
    })
    
    // If not found, try finding by short code pattern (in case URL was created with different base URL)
    if (!qrCode) {
      qrCode = await prisma.qrCode.findFirst({
        where: { 
          shortUrl: { 
            contains: `/r/${shortCode}` 
          }
        }
      })
    }

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    // Generate QR code image with custom styling
    // For dynamic QR codes, use the short URL as the content but construct it with current environment
    const settings = qrCode.settings as any
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
    const qrContent = qrCode.isDynamic ? `${baseUrl}/r/${shortCode}` : qrCode.content
    
    // Ensure frame settings include size with proper fallback
    const frameSettings = settings?.frame || { style: 'square', color: '#000000', size: 20 }
    if (!frameSettings.size) {
      frameSettings.size = 20
    }
    
    const qrImage = await QRGeneratorServer.generateQRCode({
      type: qrCode.type as 'email' | 'url' | 'contact' | 'text' | 'wifi',
      content: qrContent,
      size: settings?.size || 256,
      color: settings?.color || { dark: '#000000', light: '#FFFFFF' },
      frame: frameSettings
    })

    return NextResponse.json({ qrImage })
  } catch (error) {
    console.error('Error generating QR code image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

