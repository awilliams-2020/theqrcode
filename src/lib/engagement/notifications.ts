import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to get the appropriate action URL based on user's plan and notification type
async function getActionUrlByPlan(userId: string, type: 'analytics' | 'milestone' | 'dashboard'): Promise<string | undefined> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true }
  })
  
  const plan = subscription?.plan || 'free'
  const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
  
  // Free plan users get different redirects based on notification type
  if (!hasAnalyticsAccess) {
    if (type === 'milestone') {
      // Milestones are celebratory - let them go to dashboard to see their achievement
      return '/dashboard'
    } else if (type === 'analytics') {
      // Analytics insights - no redirect for free users, just show the info
      return undefined
    }
    // Default to dashboard for other types
    return '/dashboard'
  }
  
  // Paid plan users
  if (type === 'analytics') {
    return '/analytics'
  }
  return '/dashboard'
}

export interface NotificationData {
  userId: string
  type: 'usage_alert' | 'plan_limit' | 'milestone' | 'tip' | 'update' | 'analytics_spike' | 'analytics_location' | 'analytics_trend' | 'analytics_summary' | 'analytics_record'
  title: string
  message: string
  actionUrl?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

// Create a notification
export async function createNotification(data: NotificationData) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      actionUrl: data.actionUrl,
      priority: data.priority || 'normal',
    },
  })
}

// Get user notifications with optional category filtering
export async function getUserNotifications(userId: string, unreadOnly = false, category?: string | null) {
  // Define analytics notification types
  const analyticsTypes = ['analytics_spike', 'analytics_location', 'analytics_trend', 'analytics_summary', 'analytics_record']
  const generalTypes = ['usage_alert', 'plan_limit', 'milestone', 'tip', 'update']
  
  let typeFilter: any = {}
  if (category === 'analytics') {
    typeFilter = { in: analyticsTypes }
  } else if (category === 'general') {
    typeFilter = { in: generalTypes }
  }
  
  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
      ...(category ? { type: typeFilter } : {}),
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 50,
  })
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string, userId: string) {
  return prisma.notification.update({
    where: {
      id: notificationId,
      userId, // Security: ensure user owns the notification
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  })
}

// Delete old notifications (cleanup job)
export async function deleteOldNotifications(daysOld = 90) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)
  
  return prisma.notification.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
      isRead: true,
    },
  })
}

// Automated notification triggers

// Notify when approaching plan limits
export async function notifyPlanLimitApproaching(userId: string, resourceType: string, current: number, limit: number) {
  const percentage = (current / limit) * 100

  if (percentage >= 80) {
    await createNotification({
      userId,
      type: 'plan_limit',
      title: `Approaching ${resourceType} Limit`,
      message: `You've used ${current} of ${limit} ${resourceType}. Consider upgrading your plan.`,
      actionUrl: '/pricing',
      priority: percentage >= 95 ? 'urgent' : 'high',
    })
  }
}

// Notify milestone achievements
export async function notifyMilestone(userId: string, milestone: string, count: number) {
  const milestones: Record<string, string> = {
    scans: '🎉 Congratulations! You\'ve reached {count} total scans!',
    qr_codes: '🎨 Amazing! You\'ve created {count} QR codes!',
  }

  const message = milestones[milestone]?.replace('{count}', count.toString())
  if (!message) return

  const actionUrl = await getActionUrlByPlan(userId, 'milestone')

  await createNotification({
    userId,
    type: 'milestone',
    title: 'Milestone Achieved!',
    message,
    actionUrl,
    priority: 'normal',
  })
}

// Send usage tips
export async function sendUsageTip(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true }
  })
  
  const plan = subscription?.plan || 'free'
  const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
  
  // Different tips for free vs paid users
  const freeTips = [
    {
      title: 'Pro Tip: Use Dynamic QR Codes',
      message: 'Dynamic QR codes allow you to change the destination URL without reprinting. Perfect for marketing campaigns!',
      actionUrl: '/dashboard',
    },
    {
      title: 'Customize Your QR Codes',
      message: 'Add colors and logos to make your QR codes match your brand identity. Stand out from the crowd!',
      actionUrl: '/dashboard',
    },
  ]
  
  const paidTips = [
    {
      title: 'Pro Tip: Use Dynamic QR Codes',
      message: 'Dynamic QR codes allow you to change the destination URL without reprinting. Perfect for marketing campaigns!',
      actionUrl: '/dashboard',
    },
    {
      title: 'Track Your Success',
      message: 'Check your analytics dashboard to see which QR codes perform best and optimize your strategy.',
      actionUrl: '/analytics',
    },
    {
      title: 'Customize Your QR Codes',
      message: 'Add colors and logos to make your QR codes match your brand identity. Stand out from the crowd!',
      actionUrl: '/dashboard',
    },
    {
      title: 'Export Your Data',
      message: 'Did you know you can export your analytics data for deeper analysis? Check it out in the analytics section.',
      actionUrl: '/analytics',
    },
  ]

  const tips = hasAnalyticsAccess ? paidTips : freeTips
  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  await createNotification({
    userId,
    type: 'tip',
    title: randomTip.title,
    message: randomTip.message,
    actionUrl: randomTip.actionUrl,
    priority: 'low',
  })
}

// Monitor usage and send alerts
export async function monitorUserUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      qrCodes: true,
    },
  })

  if (!user || !user.subscription) return

  // Check QR code limits
  const planLimits: Record<string, number> = {
    free: 3,
    starter: 50,
    pro: 500,
    business: -1, // unlimited
  }

  const limit = planLimits[user.subscription.plan]
  if (limit > 0 && user.qrCodes.length >= limit * 0.8) {
    await notifyPlanLimitApproaching(userId, 'QR codes', user.qrCodes.length, limit)
  }

  // Check for milestones
  const scanCount = await prisma.scan.count({
    where: { qrCode: { userId } },
  })

  const milestoneValues = [100, 500, 1000, 5000, 10000, 50000]
  for (const milestone of milestoneValues) {
    if (scanCount === milestone) {
      await notifyMilestone(userId, 'scans', milestone)
    }
  }

  const qrCodeMilestones = [10, 25, 50, 100, 250, 500]
  for (const milestone of qrCodeMilestones) {
    if (user.qrCodes.length === milestone) {
      await notifyMilestone(userId, 'qr_codes', milestone)
    }
  }
}

