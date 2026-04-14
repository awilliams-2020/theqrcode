import { PrismaClient } from '@prisma/client'
import { createTransporter, createEmailOptions } from '../email'
import { emailTemplates } from './email-templates'
import { PLAN_LIMITS } from '../constants'
import { logger } from '@/lib/logger'

const prisma = new PrismaClient()

interface EmailRecipient {
  userId: string
  email: string
  name: string
  data: any
}

// Send automated email campaign
export async function sendEmailCampaign(campaignId: string) {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
  })

  if (!campaign || campaign.status !== 'scheduled') {
    throw new Error('Campaign not found or not scheduled')
  }

  // Get target users based on audience
  const users = await getTargetAudience(campaign.targetAudience)
  
  if (users.length === 0) {
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: 'sent', sentAt: new Date(), sentCount: 0 },
    })
    return
  }

  const transporter = createTransporter()
  let sentCount = 0

  // Send emails in batches
  for (const user of users) {
    try {
      const emailOptions = createEmailOptions({
        to: user.email,
        subject: campaign.subject,
        html: campaign.template,
        listUnsubscribe: `${process.env.NEXTAUTH_URL}/api/unsubscribe?token={unsubscribe_token}`,
      })
      await transporter.sendMail(emailOptions)

      // Log email sent
      await prisma.emailLog.create({
        data: {
          campaignId,
          userId: user.id,
          emailType: 'campaign',
          subject: campaign.subject,
          status: 'sent',
        },
      })

      sentCount++
    } catch (error) {
      logger.logError(error as Error, 'NOTIFICATION', 'Failed to send email', { email: user.email })
      
      await prisma.emailLog.create({
        data: {
          campaignId,
          userId: user.id,
          emailType: 'campaign',
          subject: campaign.subject,
          status: 'failed',
        },
      })
    }

    // Rate limiting: 2 requests per second = 500ms minimum, use 600ms for safety
    await new Promise(resolve => setTimeout(resolve, 600))
  }

  // Update campaign status
  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: {
      status: 'sent',
      sentAt: new Date(),
      sentCount,
    },
  })
}

// Get target audience based on criteria
async function getTargetAudience(targetAudience: string) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  switch (targetAudience) {
    case 'all':
      return prisma.user.findMany({
        where: { isDeleted: false },
        include: { subscription: true },
      })

    case 'free':
      return prisma.user.findMany({
        where: {
          isDeleted: false,
          subscription: { plan: 'free' },
        },
        include: { subscription: true },
      })

    case 'trial_ending':
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      return prisma.user.findMany({
        where: {
          isDeleted: false,
          subscription: {
            trialEndsAt: {
              gte: now,
              lte: threeDaysFromNow,
            },
          },
        },
        include: { subscription: true },
      })

    case 'inactive':
      return prisma.user.findMany({
        where: {
          isDeleted: false,
          updatedAt: { lt: thirtyDaysAgo },
        },
        include: { subscription: true },
      })

    case 'starter':
    case 'pro':
      return prisma.user.findMany({
        where: {
          isDeleted: false,
          subscription: { plan: targetAudience },
        },
        include: { subscription: true },
      })

    default:
      return []
  }
}

/** Optional overrides so caller can pass just-applied plan/trial (e.g. after verify-email) and avoid race with DB read. */
export type WelcomeEmailOverrides = {
  plan: string
  trialDays?: number
  isOnTrial?: boolean
  qrCodeLimit?: string
}

/** Returns true if user has already received the welcome email (used to avoid duplicates for OAuth flow). */
export async function hasReceivedWelcomeEmail(userId: string): Promise<boolean> {
  const existing = await prisma.emailLog.findFirst({
    where: {
      userId,
      subject: emailTemplates.welcome.subject,
    },
  })
  return !!existing
}

// Send welcome email to new user
export async function sendWelcomeEmail(userId: string, overrides?: WelcomeEmailOverrides) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user || !user.email) return

  const currentPlan = overrides?.plan ?? user.subscription?.plan ?? 'free'
  const isOnTrial = overrides?.isOnTrial ?? !!(user.subscription?.trialEndsAt && user.subscription.trialEndsAt > new Date())
  const trialDays = overrides?.trialDays ?? (isOnTrial && user.subscription?.trialEndsAt
    ? Math.ceil((user.subscription.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : undefined)
  const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  const qrCodesNum = (limits as { qrCodes: number }).qrCodes
  const qrCodeLimit = overrides?.qrCodeLimit ?? (qrCodesNum === -1 ? 'unlimited' : qrCodesNum.toLocaleString())

  const transporter = createTransporter()
  
  const welcomeEmail = createEmailOptions({
    to: user.email,
    subject: emailTemplates.welcome.subject,
    html: emailTemplates.welcome.html({ 
      name: user.name || 'there', 
      trialDays, 
      isOnTrial,
      qrCodeLimit,
      plan: currentPlan
    }),
    text: emailTemplates.welcome.text({ 
      name: user.name || 'there', 
      trialDays, 
      isOnTrial,
      qrCodeLimit,
      plan: currentPlan
    }),
  })
  await transporter.sendMail(welcomeEmail)

  await prisma.emailLog.create({
    data: {
      userId,
      emailType: 'notification',
      subject: emailTemplates.welcome.subject,
      status: 'sent',
    },
  })
}

// Send trial ending reminder
export async function sendTrialEndingReminders() {
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      subscription: {
        trialEndsAt: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
    },
    include: {
      subscription: true,
      qrCodes: true,
      _count: {
        select: {
          qrCodes: true,
        },
      },
    },
  })

  const transporter = createTransporter()

  for (const user of users) {
    if (!user.email) continue

    const daysLeft = Math.ceil((user.subscription!.trialEndsAt!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    const qrCodeCount = user._count.qrCodes
    const scanCount = await prisma.scan.count({
      where: { qrCode: { userId: user.id } },
    })

    const subject = emailTemplates.trialEnding.subject.replace('{days}', daysLeft.toString())

    const currentPlan = user.subscription?.plan || 'starter'
    
    const trialEndingEmail = createEmailOptions({
      to: user.email,
      subject,
      html: emailTemplates.trialEnding.html({ name: user.name || 'there', daysLeft, qrCodeCount, scanCount, plan: currentPlan }),
      text: emailTemplates.trialEnding.text({ name: user.name || 'there', daysLeft, qrCodeCount, scanCount, plan: currentPlan }),
    })
    await transporter.sendMail(trialEndingEmail)

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject,
        status: 'sent',
      },
    })

    // Rate limiting: 2 requests per second = 500ms minimum, use 600ms for safety
    await new Promise(resolve => setTimeout(resolve, 600))
  }
}

// Send monthly usage insights
export async function sendMonthlyInsights() {
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    include: {
      qrCodes: {
        where: { isDeleted: false },
      },
      subscription: true,
    },
  })

  const transporter = createTransporter()
  const now = new Date()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const month = lastMonthStart.toLocaleDateString('en-US', { month: 'long' })

  for (const user of users) {
    // Filter to only active (non-deleted) QR codes
    const activeQrCodes = user.qrCodes.filter(qr => !qr.isDeleted)

    if (!user.email || activeQrCodes.length === 0) continue

    const qrCodeIds = activeQrCodes.map(qr => qr.id)
    const scanCount = await prisma.scan.count({
      where: {
        qrCodeId: { in: qrCodeIds },
        scannedAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    })

    // Get the month before last's scan count for growth calculation
    const twoMonthsAgoStart = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    const twoMonthsAgoEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0)
    const lastMonthScans = await prisma.scan.count({
      where: {
        qrCodeId: { in: qrCodeIds },
        scannedAt: { gte: twoMonthsAgoStart, lte: twoMonthsAgoEnd },
      },
    })

    // Calculate growth percentage
    let scanGrowth: number
    if (lastMonthScans > 0) {
      // Normal case: calculate percentage change
      scanGrowth = Math.round(((scanCount - lastMonthScans) / lastMonthScans) * 100)
    } else if (scanCount > 0) {
      // Last month had 0, this month has scans: infinite growth, cap at 999%
      scanGrowth = 999
    } else {
      // Both months are 0: no change
      scanGrowth = 0
    }

    // Find top performing QR code (from active QR codes only)
    const topQrCode = activeQrCodes[0]?.name || 'N/A'

    const insightsEmail = createEmailOptions({
      to: user.email,
      subject: emailTemplates.usageInsights.subject,
      html: emailTemplates.usageInsights.html({
        name: user.name || 'there',
        month,
        qrCodeCount: activeQrCodes.length,
        scanCount,
        topQrCode,
        scanGrowth,
      }),
      text: emailTemplates.usageInsights.text({
        name: user.name || 'there',
        month,
        qrCodeCount: activeQrCodes.length,
        scanCount,
        topQrCode,
        scanGrowth,
      }),
    })
    await transporter.sendMail(insightsEmail)

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.usageInsights.subject,
        status: 'sent',
      },
    })

    // Rate limiting: 2 requests per second = 500ms minimum, use 600ms for safety
    await new Promise(resolve => setTimeout(resolve, 600))
  }
}

// Send trial expired email after downgrade to free plan
export async function sendTrialExpiredEmail(userId: string, previousPlan: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      qrCodes: {
        where: { isDeleted: false },
      },
    },
  })

  if (!user || !user.email) return

  const qrCodeCount = user.qrCodes.length
  const scanCount = await prisma.scan.count({
    where: { qrCode: { userId: user.id } },
  })

  const transporter = createTransporter()

  try {
    const trialExpiredEmail = createEmailOptions({
      to: user.email,
      subject: emailTemplates.trialExpired.subject,
      html: emailTemplates.trialExpired.html({
        name: user.name || 'there',
        previousPlan: previousPlan.charAt(0).toUpperCase() + previousPlan.slice(1),
        qrCodeCount,
        scanCount,
      }),
      text: emailTemplates.trialExpired.text({
        name: user.name || 'there',
        previousPlan: previousPlan.charAt(0).toUpperCase() + previousPlan.slice(1),
        qrCodeCount,
        scanCount,
      }),
    })
    await transporter.sendMail(trialExpiredEmail)

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.trialExpired.subject,
        status: 'sent',
      },
    })
  } catch (error) {
    logger.logError(error as Error, 'NOTIFICATION', 'Failed to send trial expired email', { userId: user.id, email: user.email })
    
    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.trialExpired.subject,
        status: 'failed',
      },
    })
  }
}

// Send re-engagement emails to inactive users
// Only sends ONCE per user when they hit ~30 days inactive (before deletion warnings start)
export async function sendReEngagementEmails() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000)

  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: {
        lt: thirtyDaysAgo, // At least 30 days inactive
        gte: thirtyFiveDaysAgo, // But not more than 35 days (narrow window to catch once)
      },
    },
  })

  const transporter = createTransporter()

  for (const user of users) {
    if (!user.email || !user.lastLoginAt) continue

    const daysSinceLastLogin = Math.ceil((Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Double-check we're in the right range (30-35 days)
    if (daysSinceLastLogin < 30 || daysSinceLastLogin > 35) {
      continue
    }

    // Check if we've already sent a re-engagement email to this user (ever)
    const existingReEngagementEmail = await prisma.emailLog.findFirst({
      where: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.reEngagement.subject,
      },
    })

    // Skip if we already sent a re-engagement email (only send once per user)
    if (existingReEngagementEmail) {
      continue
    }

    const reEngagementEmail = createEmailOptions({
      to: user.email,
      subject: emailTemplates.reEngagement.subject,
      html: emailTemplates.reEngagement.html({ name: user.name || 'there', daysSinceLastLogin }),
      text: emailTemplates.reEngagement.text({ name: user.name || 'there', daysSinceLastLogin }),
    })
    await transporter.sendMail(reEngagementEmail)

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.reEngagement.subject,
        status: 'sent',
      },
    })

    // Rate limiting: 2 requests per second = 500ms minimum, use 600ms for safety
    await new Promise(resolve => setTimeout(resolve, 600))
  }
}

// Send inactive user deletion warning emails
// Only sends to users who are 60+ days inactive (re-engagement emails handle 30-59 days)
export async function sendInactiveUserDeletionWarnings() {
  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Find users who are inactive (not deleted, and lastLoginAt is old)
  // We check for users who haven't logged in for 60-90 days (60+ days inactive)
  const inactiveUsers = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: {
        lt: sixtyDaysAgo, // At least 60 days since last login (no re-engagement emails)
        gte: ninetyDaysAgo, // But not yet 90 days (those will be deleted)
      },
    },
    include: {
      subscription: true,
    },
  })

  if (inactiveUsers.length === 0) {
    return
  }

  const transporter = createTransporter()

  for (const user of inactiveUsers) {
    if (!user.email || !user.lastLoginAt) continue

    const daysInactive = Math.floor((now.getTime() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
    const daysUntilDeletion = 90 - daysInactive
    const lastActiveDate = user.lastLoginAt.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    let emailTemplate: typeof emailTemplates.inactiveUserWarning60Days | typeof emailTemplates.inactiveUserWarning30Days | typeof emailTemplates.inactiveUserWarning15Days | null = null
    let subject: string | null = null

    // Determine which warning to send based on days until deletion
    // Warnings start at 60 days inactive (30 days until deletion)
    // Send warnings at 30, 15 days before deletion (60, 75 days inactive)
    // We use ranges to catch users within 2 days of the threshold
    if (daysUntilDeletion <= 15 && daysUntilDeletion >= 14) {
      // 15 days warning (75 days inactive) - send when 14-15 days remaining
      emailTemplate = emailTemplates.inactiveUserWarning15Days
      subject = emailTemplates.inactiveUserWarning15Days.subject
    } else if (daysUntilDeletion <= 30 && daysUntilDeletion >= 29) {
      // 30 days warning (60 days inactive) - send when 29-30 days remaining
      // This is the first warning since we start warnings at 60 days inactive
      emailTemplate = emailTemplates.inactiveUserWarning30Days
      subject = emailTemplates.inactiveUserWarning30Days.subject
    }
    // Note: 60-day warning removed since warnings now start at 60 days inactive (30 days until deletion)

    // Only send if we're at a threshold
    if (!emailTemplate || !subject) {
      continue
    }

    // Check if we've already sent this specific warning type
    const specificWarningSent = await prisma.emailLog.findFirst({
      where: {
        userId: user.id,
        emailType: 'notification',
        subject: subject,
        sentAt: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Within last 7 days
        },
      },
    })

    // Skip if we already sent this specific warning
    if (specificWarningSent) {
      continue
    }

    try {
      const warningEmail = createEmailOptions({
        to: user.email,
        subject,
        html: emailTemplate.html({
          name: user.name || 'there',
          daysUntilDeletion,
          lastActiveDate,
        }),
        text: emailTemplate.text({
          name: user.name || 'there',
          daysUntilDeletion,
          lastActiveDate,
        }),
      })
      await transporter.sendMail(warningEmail)

      await prisma.emailLog.create({
        data: {
          userId: user.id,
          emailType: 'notification',
          subject,
          status: 'sent',
        },
      })

      logger.info('NOTIFICATION', 'Inactive user warning sent', { userId: user.id, email: user.email, daysUntilDeletion })
    } catch (error) {
      logger.logError(error as Error, 'NOTIFICATION', 'Failed to send inactive user warning', { userId: user.id, email: user.email })
      
      await prisma.emailLog.create({
        data: {
          userId: user.id,
          emailType: 'notification',
          subject,
          status: 'failed',
        },
      })
    }

    // Rate limiting: 2 requests per second = 500ms minimum, use 600ms for safety
    await new Promise(resolve => setTimeout(resolve, 600))
  }
}

