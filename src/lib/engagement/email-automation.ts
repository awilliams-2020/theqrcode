import { PrismaClient } from '@prisma/client'
import { createTransporter, createEmailOptions } from '../email'
import { emailTemplates } from './email-templates'

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
      console.error(`Failed to send email to ${user.email}:`, error)
      
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
    case 'business':
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

// Send welcome email to new user
export async function sendWelcomeEmail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user || !user.email) return

  const isOnTrial = user.subscription?.trialEndsAt && user.subscription.trialEndsAt > new Date()
  const trialDays = isOnTrial && user.subscription?.trialEndsAt
    ? Math.ceil((user.subscription.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : undefined

  const transporter = createTransporter()
  
  const welcomeEmail = createEmailOptions({
    to: user.email,
    subject: emailTemplates.welcome.subject,
    html: emailTemplates.welcome.html({ 
      name: user.name || 'there', 
      trialDays, 
      isOnTrial 
    }),
    text: emailTemplates.welcome.text({ 
      name: user.name || 'there', 
      trialDays, 
      isOnTrial 
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

    const trialEndingEmail = createEmailOptions({
      to: user.email,
      subject,
      html: emailTemplates.trialEnding.html({ name: user.name || 'there', daysLeft, qrCodeCount, scanCount }),
      text: emailTemplates.trialEnding.text({ name: user.name || 'there', daysLeft, qrCodeCount, scanCount }),
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
      qrCodes: true,
      subscription: true,
    },
  })

  const transporter = createTransporter()
  const now = new Date()
  const month = now.toLocaleDateString('en-US', { month: 'long' })

  for (const user of users) {
    if (!user.email || user.qrCodes.length === 0) continue

    const qrCodeIds = user.qrCodes.map(qr => qr.id)
    const scanCount = await prisma.scan.count({
      where: {
        qrCodeId: { in: qrCodeIds },
        scannedAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
        },
      },
    })

    // Get last month's scan count for growth calculation
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    const lastMonthScans = await prisma.scan.count({
      where: {
        qrCodeId: { in: qrCodeIds },
        scannedAt: { gte: lastMonthStart, lte: lastMonthEnd },
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

    // Find top performing QR code
    const topQrCode = user.qrCodes[0]?.name || 'N/A'

    const insightsEmail = createEmailOptions({
      to: user.email,
      subject: emailTemplates.usageInsights.subject,
      html: emailTemplates.usageInsights.html({
        name: user.name || 'there',
        month,
        qrCodeCount: user.qrCodes.length,
        scanCount,
        topQrCode,
        scanGrowth,
      }),
      text: emailTemplates.usageInsights.text({
        name: user.name || 'there',
        month,
        qrCodeCount: user.qrCodes.length,
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
    console.error(`Failed to send trial expired email to ${user.email}:`, error)
    
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
export async function sendReEngagementEmails() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: { lt: thirtyDaysAgo },
    },
  })

  const transporter = createTransporter()

  for (const user of users) {
    if (!user.email || !user.lastLoginAt) continue

    const daysSinceLastLogin = Math.ceil((Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))

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
export async function sendInactiveUserDeletionWarnings() {
  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Find users who are inactive (not deleted, and lastLoginAt is old)
  // We check for users who haven't logged in for 30-90 days
  const inactiveUsers = await prisma.user.findMany({
    where: {
      isDeleted: false,
      lastLoginAt: {
        lt: thirtyDaysAgo, // At least 30 days since last login
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
    // Send warnings at 60, 30, and 15 days before deletion (30, 60, 75 days inactive)
    // We use ranges to catch users within 2 days of the threshold
    if (daysUntilDeletion <= 15 && daysUntilDeletion >= 14) {
      // 15 days warning (75 days inactive) - send when 14-15 days remaining
      emailTemplate = emailTemplates.inactiveUserWarning15Days
      subject = emailTemplates.inactiveUserWarning15Days.subject
    } else if (daysUntilDeletion <= 30 && daysUntilDeletion >= 29) {
      // 30 days warning (60 days inactive) - send when 29-30 days remaining
      emailTemplate = emailTemplates.inactiveUserWarning30Days
      subject = emailTemplates.inactiveUserWarning30Days.subject
    } else if (daysUntilDeletion <= 60 && daysUntilDeletion >= 59) {
      // 60 days warning (30 days inactive) - send when 59-60 days remaining
      emailTemplate = emailTemplates.inactiveUserWarning60Days
      subject = emailTemplates.inactiveUserWarning60Days.subject
    }

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

      console.log(`✓ Inactive user warning sent to ${user.email} (${daysUntilDeletion} days until deletion)`)
    } catch (error) {
      console.error(`Failed to send inactive user warning to ${user.email}:`, error)
      
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

