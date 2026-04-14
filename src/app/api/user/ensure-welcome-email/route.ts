import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendWelcomeEmail, hasReceivedWelcomeEmail } from '@/lib/engagement/email-automation'

/**
 * Ensures the signed-in user has received a welcome email.
 * Used for OAuth signups who chose "free" and land on dashboard (no setup-subscription step).
 * Idempotent: only sends if not already sent.
 */
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const alreadySent = await hasReceivedWelcomeEmail(session.user.id)
  if (alreadySent) {
    return NextResponse.json({ sent: false, reason: 'already_sent' })
  }

  try {
    await sendWelcomeEmail(session.user.id)
    return NextResponse.json({ sent: true })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return NextResponse.json({ sent: false, reason: 'error' }, { status: 500 })
  }
}
