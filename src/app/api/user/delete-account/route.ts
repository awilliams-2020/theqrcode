import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Perform GDPR-compliant data anonymization (Hybrid Approach)
    await prisma.$transaction(async (tx) => {
      // 1. Check if user had a trial BEFORE we modify the subscription
      // This must be done first to capture the trialEndsAt value before it's nullified
      const userWithSubscription = await tx.user.findUnique({
        where: { id: userId },
        select: { 
          email: true,
          subscription: {
            select: {
              trialEndsAt: true,
              status: true
            }
          }
        }
      })
      
      // Only add to trial abuse prevention if user actually had a trial
      const hadTrial = userWithSubscription?.subscription?.trialEndsAt != null
      
      // 2. KEEP scan data for business analytics (no personal data stored)
      // Scan data includes: device, os, browser, country, city - all anonymized
      // No names, emails, or other personal identifiers are in scan records
      
      // 3. SOFT DELETE all QR codes - preserve for analytics but mark as deleted
      // This allows us to maintain accurate historical analytics and metrics
      await tx.qrCode.updateMany({
        where: { userId: userId, isDeleted: false },
        data: {
          isDeleted: true,
          deletedAt: new Date()
        }
      })

      // 4. Anonymize subscription data - remove billing info but keep plan for churn analytics
      // Note: We keep the original plan to track which tier of customer churned
      await tx.subscription.updateMany({
        where: { userId: userId },
        data: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          status: 'cancelled', // Mark as cancelled, not active
          trialEndsAt: null
          // NOTE: We intentionally keep the 'plan' field unchanged for churn analytics
        }
      })

      // 5. DELETE authentication sessions (no personal data to anonymize)
      await tx.session.deleteMany({
        where: { userId: userId }
      })

      // 6. DELETE OAuth account data (tokens, etc.)
      await tx.account.deleteMany({
        where: { userId: userId }
      })
      
      // 7. Track for trial abuse prevention if user had a trial
      if (hadTrial) {
        // Create hash of email for trial abuse prevention (GDPR-compliant)
        const crypto = require('crypto')
        const emailHash = crypto.createHash('sha256').update(userWithSubscription?.email || '').digest('hex')
        
        // Store email hash for trial abuse prevention (legitimate interest under GDPR)
        // Use upsert to handle cases where user has deleted account before
        await tx.trialAbusePrevention.upsert({
          where: { emailHash: emailHash },
          update: { deletedAt: new Date() },
          create: {
            emailHash: emailHash,
            deletedAt: new Date()
          }
        })
      }
      
      // 8. Anonymize user record
      await tx.user.update({
        where: { id: userId },
        data: {
          name: null,
          email: `deleted_${userId}@anonymized.local`,
          image: null,
          emailVerified: null,
          isDeleted: true,
          deletedAt: new Date()
        }
      })
    })


    console.log('User account GDPR-compliant deletion completed:', userId)

    return NextResponse.json({ 
      message: 'Account and all personal data deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
