import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/debug/google-token
 * Debug endpoint to check Google OAuth token status
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Google account info
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google'
      }
    })

    if (!account) {
      return NextResponse.json({
        connected: false,
        error: 'No Google account connected'
      })
    }

    // Check token info
    const tokenInfo = {
      hasAccessToken: !!account.access_token,
      hasRefreshToken: !!account.refresh_token,
      tokenLength: account.access_token?.length || 0,
      expiresAt: account.expires_at,
      scope: account.scope,
      tokenType: account.token_type,
      isExpired: account.expires_at ? Date.now() / 1000 > account.expires_at : null
    }

    return NextResponse.json({
      connected: true,
      account: {
        id: account.id,
        provider: account.provider,
        type: account.type
      },
      token: tokenInfo
    })

  } catch (error) {
    console.error('Debug token error:', error)
    return NextResponse.json(
      { error: 'Failed to check token status' },
      { status: 500 }
    )
  }
}
