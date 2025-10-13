import { PrismaClient } from '@prisma/client'
import { createTransporter } from '../email'
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
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: campaign.subject,
        html: campaign.template,
      })

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

    // Rate limiting: wait 100ms between emails
    await new Promise(resolve => setTimeout(resolve, 100))
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

  const trialDays = user.subscription?.trialEndsAt
    ? Math.ceil((user.subscription.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 14

  const transporter = createTransporter()
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: emailTemplates.welcome.subject,
    html: emailTemplates.welcome.html({ name: user.name || 'there', trialDays }),
    text: emailTemplates.welcome.text({ name: user.name || 'there', trialDays }),
  })

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

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject,
      html: emailTemplates.trialEnding.html({ name: user.name || 'there', daysLeft, qrCodeCount, scanCount }),
      text: emailTemplates.trialEnding.text({ name: user.name || 'there', daysLeft, qrCodeCount, scanCount }),
    })

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject,
        status: 'sent',
      },
    })

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
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

    const scanGrowth = lastMonthScans > 0 
      ? Math.round(((scanCount - lastMonthScans) / lastMonthScans) * 100)
      : 100

    // Find top performing QR code
    const topQrCode = user.qrCodes[0]?.name || 'N/A'

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.usageInsights.subject,
        status: 'sent',
      },
    })

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
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
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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
      updatedAt: { lt: thirtyDaysAgo },
    },
  })

  const transporter = createTransporter()

  for (const user of users) {
    if (!user.email) continue

    const daysSinceLastLogin = Math.ceil((Date.now() - user.updatedAt.getTime()) / (1000 * 60 * 60 * 24))

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: emailTemplates.reEngagement.subject,
      html: emailTemplates.reEngagement.html({ name: user.name || 'there', daysSinceLastLogin }),
      text: emailTemplates.reEngagement.text({ name: user.name || 'there', daysSinceLastLogin }),
    })

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        emailType: 'notification',
        subject: emailTemplates.reEngagement.subject,
        status: 'sent',
      },
    })

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

