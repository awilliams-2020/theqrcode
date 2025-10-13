import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLAN_LIMITS, PLAN_DISPLAY_NAMES } from '@/lib/constants'
import Settings from '@/components/Settings'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  
  // Get user's subscription info and user data
  const [subscription, user] = await Promise.all([
    prisma.subscription.findUnique({
      where: { userId: session.user.id }
    }),
    prisma.user.findUnique({
      where: { id: session.user.id }
    })
  ])
  
  // Get user's QR codes count for display
  const qrCodesCount = await prisma.qrCode.count({
    where: { 
      userId: session.user.id,
      isDeleted: false // Exclude soft-deleted QR codes
    }
  })
  
  // Get total scans count
  const totalScans = await prisma.scan.count({
    where: {
      qrCode: {
        userId: session.user.id,
        isDeleted: false // Exclude scans from deleted QR codes
      }
    }
  })
  
  // Check if trial is active
  const isTrialActive = subscription?.status === 'trialing' && subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date()
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
    <Settings 
      user={session.user}
      subscription={serializedSubscription}
      qrCodesCount={qrCodesCount}
      totalScans={totalScans}
      limits={limits}
      currentPlan={effectivePlan}
      isTrialActive={isTrialActive || false}
      planDisplayName={isTrialActive ? `${PLAN_DISPLAY_NAMES[effectivePlan as keyof typeof PLAN_DISPLAY_NAMES]} (Trial)` : PLAN_DISPLAY_NAMES[effectivePlan as keyof typeof PLAN_DISPLAY_NAMES]}
      accountCreatedAt={user?.createdAt || new Date()}
      userTimezone={(user as any)?.timezone || 'UTC'}
    />
  )
}
