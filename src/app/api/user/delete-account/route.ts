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
      // 1. DELETE all scan data (analytics) - contains personal data
      await tx.scan.deleteMany({
        where: {
          qrCode: {
            userId: userId
          }
        }
      })

      // 2. DELETE all QR codes - may contain personal data
      await tx.qrCode.deleteMany({
        where: { userId: userId }
      })

      // 3. Anonymize subscription data - remove billing info but keep for trial abuse prevention
      await tx.subscription.updateMany({
        where: { userId: userId },
        data: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          plan: 'free',
          status: 'active',
          trialEndsAt: null
        }
      })

      // 4. DELETE authentication sessions (no personal data to anonymize)
      await tx.session.deleteMany({
        where: { userId: userId }
      })

      // 5. DELETE OAuth account data (tokens, etc.)
      await tx.account.deleteMany({
        where: { userId: userId }
      })

      // 6. Anonymize user record but keep for trial abuse prevention
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
