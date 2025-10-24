/**
 * Usage Examples for User Engagement System
 * 
 * This file demonstrates how to use the engagement features throughout your application.
 */

import { PrismaClient } from '@prisma/client'
import {
  createNotification,
  notifyMilestone,
  notifyPlanLimitApproaching,
  sendUsageTip,
  monitorUserUsage,
} from './notifications'

const prisma = new PrismaClient()

import {
  sendWelcomeEmail,
  sendTrialEndingReminders,
  sendMonthlyInsights,
  sendReEngagementEmails,
} from './email-automation'

// ============================================================================
// EXAMPLE 1: Welcome New User
// ============================================================================

export async function onUserSignup(userId: string) {
  // Send welcome email
  await sendWelcomeEmail(userId)
  
  // Create welcome notification
  await createNotification({
    userId,
    type: 'tip',
    title: 'Welcome to TheQRCode.io! 🎉',
    message: 'Start by creating your first QR code. Click here to get started.',
    actionUrl: '/dashboard',
    priority: 'normal',
  })
}

// ============================================================================
// EXAMPLE 2: Monitor QR Code Creation
// ============================================================================

export async function onQrCodeCreated(userId: string, qrCodeCount: number, planLimit: number) {
  // Check if user is approaching plan limit
  if (qrCodeCount >= planLimit * 0.8) {
    await notifyPlanLimitApproaching(userId, 'QR codes', qrCodeCount, planLimit)
  }

  // Check for milestones
  const milestones = [10, 25, 50, 100, 250, 500]
  if (milestones.includes(qrCodeCount)) {
    await notifyMilestone(userId, 'qr_codes', qrCodeCount)
  }

  // Send usage tip for first QR code
  if (qrCodeCount === 1) {
    await createNotification({
      userId,
      type: 'tip',
      title: 'Pro Tip: Make it Dynamic',
      message: 'Dynamic QR codes let you change the destination without reprinting. Perfect for marketing!',
      actionUrl: '/dashboard',
      priority: 'low',
    })
  }
}

// ============================================================================
// EXAMPLE 3: Track Scan Milestones
// ============================================================================

export async function onQrCodeScanned(userId: string, totalScans: number) {
  // Check for scan milestones
  const milestones = [100, 500, 1000, 5000, 10000, 50000]
  if (milestones.includes(totalScans)) {
    await notifyMilestone(userId, 'scans', totalScans)
  }

  // Send insights tip at 100 scans
  if (totalScans === 100) {
    // Get user's plan to determine the right action URL and message
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { plan: true }
    })
    const plan = subscription?.plan || 'free'
    const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
    
    if (hasAnalyticsAccess) {
      // Paid users: encourage them to check analytics
      await createNotification({
        userId,
        type: 'tip',
        title: 'Check Your Analytics! 📊',
        message: "You've got 100 scans! View detailed analytics to see how your QR codes are performing.",
        actionUrl: '/analytics',
        priority: 'normal',
      })
    } else {
      // Free users: celebrate the milestone without any redirect
      await createNotification({
        userId,
        type: 'milestone',
        title: '100 Scans Milestone! 🎉',
        message: "Congratulations on reaching 100 scans! Upgrade to unlock detailed analytics on device types, locations, and trends.",
        actionUrl: undefined,
        priority: 'normal',
      })
    }
  }
}

// ============================================================================
// EXAMPLE 4: Plan Upgrade Notification
// ============================================================================

export async function onPlanUpgrade(userId: string, newPlan: string) {
  const planFeatures: Record<string, string[]> = {
    starter: ['Custom colors', 'Basic analytics', 'Email support'],
    pro: ['Logo embedding', 'Advanced analytics', 'API access', 'Priority support'],
    business: ['White-label', 'Team features', 'Webhooks', 'Dedicated support'],
  }

  const features = planFeatures[newPlan] || []

  await createNotification({
    userId,
    type: 'update',
    title: `Welcome to ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}! 🚀`,
    message: `You now have access to: ${features.join(', ')}`,
    actionUrl: '/dashboard',
    priority: 'high',
  })
}

// ============================================================================
// EXAMPLE 5: Feature Announcement
// ============================================================================

export async function announceNewFeature(
  featureName: string,
  description: string,
  targetPlans: string[]
) {
  // This would be called via API
  // POST /api/announcements
  const announcementData = {
    title: `New Feature: ${featureName}`,
    content: description,
    type: 'feature',
    priority: 'normal',
    targetPlans,
    ctaText: 'Try it now',
    ctaUrl: '/dashboard',
  }

  return announcementData
}

// ============================================================================
// EXAMPLE 6: Scheduled Jobs Integration
// ============================================================================

export async function setupEngagementJobs() {
  // Example using node-cron (for self-hosted)
  /*
  import cron from 'node-cron'

  // Daily at 9 AM: Send trial reminders
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily engagement tasks...')
    await sendTrialEndingReminders()
  })

  // Weekly on Monday at 10 AM: Re-engagement emails
  cron.schedule('0 10 * * 1', async () => {
    console.log('Running weekly engagement tasks...')
    await sendReEngagementEmails()
  })

  // Monthly on 1st at 10 AM: Usage insights
  cron.schedule('0 10 1 * *', async () => {
    console.log('Running monthly engagement tasks...')
    await sendMonthlyInsights()
  })
  */

  // Example using Vercel Cron (create API routes)
  /*
  // app/api/cron/daily/route.ts
  export async function GET() {
    await sendTrialEndingReminders()
    return Response.json({ success: true })
  }

  // vercel.json
  {
    "crons": [{
      "path": "/api/cron/daily",
      "schedule": "0 9 * * *"
    }]
  }
  */
}

// ============================================================================
// EXAMPLE 7: User Activity Monitoring
// ============================================================================

export async function checkUserActivity(userId: string) {
  // Monitor and create appropriate notifications
  await monitorUserUsage(userId)

  // Send random usage tip (weekly)
  const shouldSendTip = Math.random() < 0.1 // 10% chance
  if (shouldSendTip) {
    await sendUsageTip(userId)
  }
}

// ============================================================================
// EXAMPLE 8: Error/Warning Notifications
// ============================================================================

export async function notifyPaymentIssue(userId: string) {
  await createNotification({
    userId,
    type: 'usage_alert',
    title: 'Payment Issue ⚠️',
    message: 'There was an issue processing your payment. Please update your payment method.',
    actionUrl: '/dashboard/billing',
    priority: 'urgent',
  })
}

export async function notifyTrialExpiring(userId: string, daysLeft: number) {
  await createNotification({
    userId,
    type: 'plan_limit',
    title: `Trial Ending in ${daysLeft} Days`,
    message: 'Upgrade now to keep your QR codes active and unlock advanced features.',
    actionUrl: '/pricing',
    priority: 'high',
  })
}

// ============================================================================
// EXAMPLE 9: Creating Email Campaign
// ============================================================================

export async function createEmailCampaign() {
  // POST /api/campaigns
  const campaignData = {
    name: 'Summer Promotion 2025',
    subject: '50% Off All Plans - Limited Time!',
    template: `
      <div style="font-family: Arial, sans-serif;">
        <h1>Special Summer Offer!</h1>
        <p>Get 50% off all plans for the first 3 months.</p>
        <a href="https://theqrcode.io/pricing">Upgrade Now</a>
      </div>
    `,
    targetAudience: 'free', // Target free users
    scheduledFor: new Date('2025-07-01T09:00:00'),
  }

  return campaignData
}

// ============================================================================
// EXAMPLE 10: React Component Usage
// ============================================================================

/*
// Layout with all engagement features
import NotificationBell from '@/components/NotificationBell'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import FeedbackButton from '@/components/FeedbackButton'

export default function DashboardLayout({ children }) {
  return (
    <>
      <header>
        <nav>
          {/* Navigation items *\/}
          <NotificationBell />
        </nav>
      </header>
      
      <AnnouncementBanner />
      
      <main>{children}</main>
      
      <FeedbackButton />
    </>
  )
}
*/

