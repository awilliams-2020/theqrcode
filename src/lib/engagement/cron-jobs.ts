// Automated cron jobs for user engagement
// Run these functions on a schedule using cron or a job scheduler

import { 
  sendTrialEndingReminders,
  sendTrialExpiredEmail,
  sendMonthlyInsights,
  sendReEngagementEmails,
  sendEmailCampaign,
} from './email-automation'
import { deleteOldNotifications } from './notifications'
import { sendPeriodicAnalyticsSummaries } from './analytics-notifications'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Run daily at 9 AM
export async function dailyEngagementTasks() {
  console.log('Running daily engagement tasks...')

  try {
    // Downgrade expired trials and send emails
    await downgradeExpiredTrials()
    console.log('✓ Expired trials downgraded')

    // Send trial ending reminders
    await sendTrialEndingReminders()
    console.log('✓ Trial ending reminders sent')

    // Process scheduled email campaigns
    await processScheduledCampaigns()
    console.log('✓ Scheduled campaigns processed')

    // Send daily analytics summaries to active users
    await sendPeriodicAnalyticsSummaries()
    console.log('✓ Analytics summaries sent')

    // Clean up old read notifications
    await deleteOldNotifications(90)
    console.log('✓ Old notifications cleaned up')
  } catch (error) {
    console.error('Daily engagement tasks failed:', error)
  }
}

// Run on the 1st of each month
export async function monthlyEngagementTasks() {
  console.log('Running monthly engagement tasks...')

  try {
    // Send monthly usage insights
    await sendMonthlyInsights()
    console.log('✓ Monthly insights sent')

    // Clean up old uptime check records
    await deleteOldUptimeChecks(30)
    console.log('✓ Old uptime checks cleaned up')
  } catch (error) {
    console.error('Monthly engagement tasks failed:', error)
  }
}

// Run weekly on Monday at 10 AM
export async function weeklyEngagementTasks() {
  console.log('Running weekly engagement tasks...')

  try {
    // Send re-engagement emails to inactive users
    await sendReEngagementEmails()
    console.log('✓ Re-engagement emails sent')
  } catch (error) {
    console.error('Weekly engagement tasks failed:', error)
  }
}

// Downgrade expired trials to free plan
async function downgradeExpiredTrials() {
  try {
    const now = new Date()

    // Find all expired trials
    const expiredTrials = await prisma.subscription.findMany({
      where: {
        status: 'trialing',
        trialEndsAt: {
          lte: now,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (expiredTrials.length === 0) {
      return
    }

    console.log(`Found ${expiredTrials.length} expired trial(s) to downgrade`)

    // Process each expired trial
    for (const subscription of expiredTrials) {
      const { user, plan: previousPlan } = subscription

      try {
        // Create email hash for trial abuse prevention
        const crypto = require('crypto')
        const emailHash = crypto.createHash('sha256').update(user.email).digest('hex')

        // Add to trial abuse prevention table (before downgrade)
        await prisma.trialAbusePrevention.upsert({
          where: { emailHash },
          create: {
            emailHash,
            deletedAt: now,
          },
          update: {
            deletedAt: now,
          },
        })

        // Downgrade subscription to free/active
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            plan: 'free',
            status: 'active',
            trialEndsAt: null,
          },
        })

        console.log(`✓ Downgraded ${user.email} from ${previousPlan} to free`)

        // Send email notification
        try {
          await sendTrialExpiredEmail(user.id, previousPlan)
          console.log(`✓ Trial expired email sent to ${user.email}`)
        } catch (emailError) {
          console.error(`Failed to send trial expired email to ${user.email}:`, emailError)
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Failed to downgrade trial for ${user.email}:`, error)
      }
    }

    console.log(`Downgraded ${expiredTrials.length} expired trial(s) to free plan`)
  } catch (error) {
    console.error('Failed to downgrade expired trials:', error)
    throw error
  }
}

// Process scheduled email campaigns
async function processScheduledCampaigns() {
  const now = new Date()

  const campaigns = await prisma.emailCampaign.findMany({
    where: {
      status: 'scheduled',
      scheduledFor: { lte: now },
    },
  })

  for (const campaign of campaigns) {
    try {
      await sendEmailCampaign(campaign.id)
      console.log(`✓ Campaign sent: ${campaign.name}`)
    } catch (error) {
      console.error(`Failed to send campaign ${campaign.name}:`, error)
      
      // Mark as failed
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: 'cancelled' },
      })
    }
  }
}

// Delete old uptime check records
async function deleteOldUptimeChecks(daysToKeep: number) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await prisma.uptimeCheck.deleteMany({
      where: {
        checkedAt: {
          lt: cutoffDate,
        },
      },
    })

    console.log(`Deleted ${result.count} uptime check record(s) older than ${daysToKeep} days`)
    return result.count
  } catch (error) {
    console.error('Failed to delete old uptime checks:', error)
    throw error
  }
}

// Example cron schedule setup (using node-cron or similar)
/*
import cron from 'node-cron'

// Daily at 9:00 AM
cron.schedule('0 9 * * *', dailyEngagementTasks)

// Monthly on the 1st at 10:00 AM
cron.schedule('0 10 1 * *', monthlyEngagementTasks)

// Weekly on Monday at 10:00 AM
cron.schedule('0 10 * * 1', weeklyEngagementTasks)
*/

// For Vercel/serverless environments, use Vercel Cron Jobs or external services like:
// - GitHub Actions with scheduled workflows
// - Upstash QStash
// - AWS EventBridge
// - Google Cloud Scheduler

