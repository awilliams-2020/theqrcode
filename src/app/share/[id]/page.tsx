import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { QRGenerator } from '@/lib/qr-generator'
import QRShareDisplay from '@/components/QRShareDisplay'

interface SharePageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    msg?: string
  }>
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { id } = await params
  const { msg } = await searchParams

  // Get the QR code
  const qrCode = await prisma.qrCode.findFirst({
    where: {
      id,
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      type: true,
      content: true,
      shortUrl: true,
      settings: true,
      isDynamic: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true
        }
      },
      scans: {
        select: {
          id: true,
          scannedAt: true,
          device: true,
          country: true
        },
        orderBy: { scannedAt: 'desc' },
        take: 10
      }
    }
  })

  if (!qrCode) {
    notFound()
  }

  // Generate QR code image
  let qrCodeImage: string | null = null
  try {
    qrCodeImage = await QRGenerator.generateQRCode({
      type: qrCode.type as any,
      content: qrCode.content,
      size: 300,
      color: { dark: '#000000', light: '#FFFFFF' },
      frame: (qrCode.settings as any)?.frame || undefined,
      styling: (qrCode.settings as any)?.styling || undefined
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  }

  const message = msg ? decodeURIComponent(msg) : 'Check this out! Scan the QR code to see more.'

  return (
    <QRShareDisplay
      qrCode={qrCode as any}
      qrCodeImage={qrCodeImage}
      message={message}
    />
  )
}

export async function generateMetadata({ params, searchParams }: SharePageProps) {
  const { id } = await params
  const { msg } = await searchParams

  try {
    const qrCode = await prisma.qrCode.findFirst({
      where: {
        id,
        isDeleted: false
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    if (!qrCode) {
      return {
        title: 'QR Code Not Found',
        description: 'The requested QR code could not be found.'
      }
    }

    const message = msg ? decodeURIComponent(msg) : 'Check this out! Scan the QR code to see more.'

    return {
      title: `${qrCode.name} - QR Code Shared`,
      description: message,
      openGraph: {
        title: `${qrCode.name} - QR Code Shared`,
        description: message,
        type: 'website'
      },
      twitter: {
        card: 'summary',
        title: `${qrCode.name} - QR Code Shared`,
        description: message
      }
    }
  } catch (error) {
    return {
      title: 'QR Code Shared',
      description: 'A QR code has been shared with you.'
    }
  }
}
