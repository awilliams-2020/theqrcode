import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLAN_LIMITS, PLAN_DISPLAY_NAMES } from '@/lib/constants'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  
  // Get user's QR codes, subscription info, and admin status
  const [qrCodes, subscription, user] = await Promise.all([
    prisma.qrCode.findMany({
      where: { 
        userId: session.user.id,
        isDeleted: false // Exclude soft-deleted QR codes
      },
      include: {
        scans: {
          select: {
            id: true,
            scannedAt: true,
            device: true,
            country: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id }
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })
  ])
  
  // Calculate usage stats
  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans.length, 0)
  // Use shared plan constants
  
  // Check if trial is active
  const isTrialActive = subscription?.status === 'trialing' && subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()
  // Use the actual plan from subscription, not override with 'pro'
  const effectivePlan = subscription?.plan || 'free'
  const limits = PLAN_LIMITS[effectivePlan as keyof typeof PLAN_LIMITS]
  
  // Serialize subscription data for client component
  const serializedSubscription = subscription ? {
    id: subscription.id,
    plan: subscription.plan,
    status: subscription.status,
    trialEndsAt: subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null,
    stripeCustomerId: subscription.stripeCustomerId,
    stripeSubscriptionId: subscription.stripeSubscriptionId
  } : null
  
  return (
    <Dashboard 
      qrCodes={qrCodes.map(qr => ({
        ...qr,
        shortUrl: qr.shortUrl || undefined,
        settings: (qr.settings as Record<string, unknown>) || {},
        scans: qr.scans.map(scan => ({
          ...scan,
          device: scan.device || undefined,
          country: scan.country || undefined
        }))
      }))}
      subscription={serializedSubscription}
      totalScans={totalScans}
      limits={limits}
      currentPlan={effectivePlan}
      isTrialActive={isTrialActive || false}
      planDisplayName={isTrialActive ? `${PLAN_DISPLAY_NAMES[effectivePlan as keyof typeof PLAN_DISPLAY_NAMES]} (Trial)` : PLAN_DISPLAY_NAMES[effectivePlan as keyof typeof PLAN_DISPLAY_NAMES]}
      isAdmin={user?.isAdmin || false}
    />
  )
}
