import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to check if user has pro plan access
async function hasProPlanAccess(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true }
  })
  
  const plan = subscription?.plan || 'free'
  return ['pro', 'business'].includes(plan)
}


export interface NotificationData {
  userId: string
  type: 'usage_alert' | 'plan_limit' | 'milestone' | 'tip' | 'update' | 'analytics_spike' | 'analytics_location' | 'analytics_trend' | 'analytics_summary' | 'analytics_record'
  title: string
  message: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}

// Create a notification with plan-based restrictions
export async function createNotification(data: NotificationData) {
  // Check if this is a pro tip notification
  if (data.type === 'tip') {
    const hasProAccess = await hasProPlanAccess(data.userId)
    if (!hasProAccess) {
      // Don't create pro tip notifications for non-pro users
      console.log(`Skipping pro tip notification for user ${data.userId} - not on pro plan`)
      return null
    }
  }
  
  // Check if this is an analytics notification (requires paid plan)
  const analyticsTypes = ['analytics_spike', 'analytics_location', 'analytics_trend', 'analytics_summary', 'analytics_record']
  if (analyticsTypes.includes(data.type)) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: data.userId },
      select: { plan: true }
    })
    
    const plan = subscription?.plan || 'free'
    const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
    
    if (!hasAnalyticsAccess) {
      // Don't create analytics notifications for free users
      console.log(`Skipping analytics notification for user ${data.userId} - not on paid plan`)
      return null
    }
  }
  
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || 'normal',
    },
  })
}

// Get user notifications with optional category filtering and plan-based restrictions
export async function getUserNotifications(userId: string, unreadOnly = false, category?: string | null) {
  // Get user's plan to filter notifications
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true }
  })
  
  const plan = subscription?.plan || 'free'
  const hasProAccess = ['pro', 'business'].includes(plan)
  const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
  
  // Define analytics notification types
  const analyticsTypes = ['analytics_spike', 'analytics_location', 'analytics_trend', 'analytics_summary', 'analytics_record']
  const generalTypes = ['usage_alert', 'plan_limit', 'milestone', 'tip', 'update']
  
  let typeFilter: any = {}
  if (category === 'analytics') {
    typeFilter = { in: analyticsTypes }
  } else if (category === 'general') {
    typeFilter = { in: generalTypes }
  }
  
  // Build plan-based type exclusions
  const excludedTypes: string[] = []
  if (!hasProAccess) {
    excludedTypes.push('tip') // Exclude pro tips for non-pro users
  }
  if (!hasAnalyticsAccess) {
    excludedTypes.push(...analyticsTypes) // Exclude analytics notifications for free users
  }
  
  const whereClause: any = {
    userId,
    ...(unreadOnly ? { isRead: false } : {}),
    ...(category ? { type: typeFilter } : {}),
  }
  
  // Add type exclusions if any
  if (excludedTypes.length > 0) {
    whereClause.type = {
      notIn: excludedTypes,
      ...(category ? typeFilter : {})
    }
  }
  
  return prisma.notification.findMany({
    where: whereClause,
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

  await createNotification({
    userId,
    type: 'milestone',
    title: 'Milestone Achieved!',
    message,
    priority: 'normal',
  })
}

// Send usage tips - only for pro and business plans
export async function sendUsageTip(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true }
  })
  
  const plan = subscription?.plan || 'free'
  const hasAnalyticsAccess = ['starter', 'pro', 'business'].includes(plan)
  const hasProAccess = ['pro', 'business'].includes(plan)
  
  // Only send pro tips to pro and business plan users
  if (!hasProAccess) {
    return // Don't send any tips to free/starter users
  }
  
  // Pro tips for pro and business users
  const proTips = [
    {
      title: 'Pro Tip: Use Dynamic QR Codes',
      message: 'Dynamic QR codes allow you to change the destination URL without reprinting. Perfect for marketing campaigns!',
    },
    {
      title: 'Track Your Success',
      message: 'Check your analytics dashboard to see which QR codes perform best and optimize your strategy.',
    },
    {
      title: 'Customize Your QR Codes',
      message: 'Add colors and logos to make your QR codes match your brand identity. Stand out from the crowd!',
    },
    {
      title: 'Export Your Data',
      message: 'Did you know you can export your analytics data for deeper analysis? Check it out in the analytics section.',
    },
    {
      title: 'Advanced Analytics',
      message: 'Use location tracking and device analytics to understand your audience better and optimize your campaigns.',
    },
    {
      title: 'Bulk Operations',
      message: 'Create and manage multiple QR codes at once using our bulk operations feature. Perfect for large campaigns!',
    },
  ]

  const randomTip = proTips[Math.floor(Math.random() * proTips.length)]

  await createNotification({
    userId,
    type: 'tip',
    title: randomTip.title,
    message: randomTip.message,
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

