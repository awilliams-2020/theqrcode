import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params
    
    // First try with current environment's base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theqrcode.io'
    const shortUrl = `${baseUrl}/r/${shortCode}`
    let qrCode = await prisma.qrCode.findUnique({
      where: { shortUrl }
    })
    
    // If not found, try finding by short code pattern (in case URL was created with different base URL)
    if (!qrCode) {
      qrCode = await prisma.qrCode.findFirst({
        where: { 
          shortUrl: { 
            contains: `/r/${shortCode}` 
          },
          type: 'contact'
        }
      })
    }

    if (!qrCode || qrCode.type !== 'contact') {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Parse contact data
    const contactData = JSON.parse(qrCode.content)
    
    // Format as vCard
    const vCard = formatContactVCard(contactData)
    
    // Return vCard with headers that trigger native contacts app
    return new NextResponse(vCard, {
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': 'inline; filename="contact.vcf"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error serving contact:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatContactVCard(contactData: any): string {
  const {
    firstName,
    lastName,
    organization,
    phone,
    email,
    url,
    address
  } = contactData

  let vcard = 'BEGIN:VCARD\n'
  vcard += 'VERSION:3.0\n'
  vcard += `FN:${firstName} ${lastName}\n`
  vcard += `N:${lastName};${firstName};;;\n`
  
  if (organization) vcard += `ORG:${organization}\n`
  if (phone) vcard += `TEL:${phone}\n`
  if (email) vcard += `EMAIL:${email}\n`
  if (url) vcard += `URL:${url}\n`
  if (address) vcard += `ADR:;;${address};;;;\n`
  
  vcard += 'END:VCARD'
  return vcard
}
