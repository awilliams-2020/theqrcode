import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadClickConversion } from '@/lib/google-ads'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const gclid = (body as { gclid?: string }).gclid ?? request.cookies.get('gclid')?.value ?? null
  if (!gclid) {
    return NextResponse.json({ saved: false })
  }

  // Only write if the user doesn't already have a gclid stored (first touch wins)
  const { count } = await prisma.user.updateMany({
    where: { id: session.user.id, gclid: null },
    data: { gclid },
  })

  // Google Ads: fire trial conversion on signup when we first persist gclid (OAuth flow; password fires at verify-email)
  if (count > 0) {
    const trialActionId = process.env.GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID
    if (trialActionId) {
      uploadClickConversion({
        gclid,
        conversionDateTime: new Date(),
        conversionValue: 0,
        conversionActionId: trialActionId,
      }).catch(err =>
        logger.logError(err as Error, 'GOOGLE-ADS', 'Trial conversion upload failed (save-gclid)', { userId: session.user.id })
      )
    }
  }

  return NextResponse.json({ saved: count > 0 })
}
