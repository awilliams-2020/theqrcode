import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GDPR Data Export (Right to Portability)
 * Allows users to download all their personal data
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Collect all user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        qrCodes: {
          include: {
            scans: {
              orderBy: { scannedAt: 'desc' }
            }
          }
        },
        accounts: true,
        sessions: true
      }
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Format data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      userProfile: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      subscription: userData.subscription ? {
        plan: userData.subscription.plan,
        status: userData.subscription.status,
        trialEndsAt: userData.subscription.trialEndsAt,
        createdAt: userData.subscription.createdAt,
        updatedAt: userData.subscription.updatedAt
      } : null,
      qrCodes: userData.qrCodes.map(qr => ({
        id: qr.id,
        name: qr.name,
        type: qr.type,
        content: qr.content,
        shortUrl: qr.shortUrl,
        settings: qr.settings,
        isDynamic: qr.isDynamic,
        createdAt: qr.createdAt,
        updatedAt: qr.updatedAt,
        totalScans: qr.scans.length,
        scans: qr.scans.map(scan => ({
          id: scan.id,
          // Privacy note: IP addresses, user agents, and referrers excluded for privacy
          country: scan.country,
          // City-level data excluded for privacy - only country-level available
          device: scan.device,
          os: scan.os,
          browser: scan.browser,
          scannedAt: scan.scannedAt
        }))
      })),
      authentication: {
        accounts: userData.accounts.map(account => ({
          provider: account.provider,
          type: account.type,
          createdAt: (account as any).createdAt || new Date()
        })),
        sessions: userData.sessions.map(session => ({
          expires: session.expires,
          createdAt: (session as any).createdAt || new Date()
        }))
      },
      summary: {
        totalQrCodes: userData.qrCodes.length,
        totalScans: userData.qrCodes.reduce((sum, qr) => sum + qr.scans.length, 0),
        accountCreated: userData.createdAt,
        lastUpdated: userData.updatedAt
      }
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="qr-analytics-data-export-${new Date().toISOString().split('T')[0]}.json"`
      }
    })

  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
