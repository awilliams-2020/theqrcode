// Automated cron jobs for user engagement
// Run these functions on a schedule using cron or a job scheduler

import { 
  sendTrialEndingReminders as sendTrialEndingRemindersOriginal,
  sendTrialExpiredEmail,
  sendMonthlyInsights as sendMonthlyInsightsOriginal,
  sendReEngagementEmails as sendReEngagementEmailsOriginal,
  sendEmailCampaign,
  sendInactiveUserDeletionWarnings as sendInactiveUserDeletionWarningsOriginal,
} from './email-automation'
import { deleteOldNotifications as deleteOldNotificationsOriginal } from './notifications'
import { sendPeriodicAnalyticsSummaries as sendPeriodicAnalyticsSummariesOriginal } from './analytics-notifications'
import { PrismaClient } from '@prisma/client'
import { createTransporter, createEmailOptions } from '../email'
import { logger } from '../logger'

const prisma = new PrismaClient()

interface ActionSummary {
  task: string
  status: 'success' | 'error'
  count?: number
  message?: string
  error?: string
}

interface CronJobSummary {
  jobName: string
  startTime: Date
  endTime: Date
  duration: number
  actions: ActionSummary[]
  totalActions: number
  successfulActions: number
  failedActions: number
}

// Run daily at 9 AM
export async function dailyEngagementTasks() {
  const startTime = new Date()
  const summary: CronJobSummary = {
    jobName: 'Daily Engagement Tasks',
    startTime,
    endTime: new Date(),
    duration: 0,
    actions: [],
    totalActions: 0,
    successfulActions: 0,
    failedActions: 0,
  }

  try {
    // Downgrade expired trials and send emails
    const downgradeResult = await downgradeExpiredTrials()
    summary.actions.push({
      task: 'Downgrade Expired Trials',
      status: downgradeResult.success ? 'success' : 'error',
      count: downgradeResult.count,
      message: downgradeResult.message,
      error: downgradeResult.error,
    })
    if (!downgradeResult.success) {
      logger.warn('CRON-JOBS', 'Failed to downgrade expired trials', {
        component: 'dailyEngagementTasks',
        action: 'downgradeExpiredTrials',
        error: downgradeResult.error,
        count: downgradeResult.count,
      })
    }

    // Send trial ending reminders
    const trialRemindersResult = await sendTrialEndingRemindersWrapper()
    summary.actions.push({
      task: 'Send Trial Ending Reminders',
      status: trialRemindersResult.success ? 'success' : 'error',
      count: trialRemindersResult.count,
      message: trialRemindersResult.message,
      error: trialRemindersResult.error,
    })
    if (!trialRemindersResult.success) {
      logger.warn('CRON-JOBS', 'Failed to send trial ending reminders', {
        component: 'dailyEngagementTasks',
        action: 'sendTrialEndingReminders',
        error: trialRemindersResult.error,
        count: trialRemindersResult.count,
      })
    }

    // Process scheduled email campaigns
    const campaignsResult = await processScheduledCampaigns()
    summary.actions.push({
      task: 'Process Scheduled Campaigns',
      status: campaignsResult.success ? 'success' : 'error',
      count: campaignsResult.count,
      message: campaignsResult.message,
      error: campaignsResult.error,
    })
    if (!campaignsResult.success) {
      logger.warn('CRON-JOBS', 'Failed to process scheduled campaigns', {
        component: 'dailyEngagementTasks',
        action: 'processScheduledCampaigns',
        error: campaignsResult.error,
        count: campaignsResult.count,
      })
    }

    // Send daily analytics summaries to active users
    const analyticsResult = await sendPeriodicAnalyticsSummariesWrapper()
    summary.actions.push({
      task: 'Send Analytics Summaries',
      status: analyticsResult.success ? 'success' : 'error',
      count: analyticsResult.count,
      message: analyticsResult.message,
      error: analyticsResult.error,
    })
    if (!analyticsResult.success) {
      logger.warn('CRON-JOBS', 'Failed to send analytics summaries', {
        component: 'dailyEngagementTasks',
        action: 'sendPeriodicAnalyticsSummaries',
        error: analyticsResult.error,
        count: analyticsResult.count,
      })
    }

    // Send inactive user deletion warnings
    const warningsResult = await sendInactiveUserDeletionWarningsWrapper()
    summary.actions.push({
      task: 'Send Inactive User Deletion Warnings',
      status: warningsResult.success ? 'success' : 'error',
      count: warningsResult.count,
      message: warningsResult.message,
      error: warningsResult.error,
    })
    if (!warningsResult.success) {
      logger.warn('CRON-JOBS', 'Failed to send inactive user deletion warnings', {
        component: 'dailyEngagementTasks',
        action: 'sendInactiveUserDeletionWarnings',
        error: warningsResult.error,
        count: warningsResult.count,
      })
    }

    // Delete inactive users after 90 days
    const deleteUsersResult = await deleteInactiveUsers()
    summary.actions.push({
      task: 'Delete Inactive Users',
      status: deleteUsersResult.success ? 'success' : 'error',
      count: deleteUsersResult.count,
      message: deleteUsersResult.message,
      error: deleteUsersResult.error,
    })
    if (!deleteUsersResult.success) {
      logger.warn('CRON-JOBS', 'Failed to delete inactive users', {
        component: 'dailyEngagementTasks',
        action: 'deleteInactiveUsers',
        error: deleteUsersResult.error,
        count: deleteUsersResult.count,
      })
    }

    // Clean up old read notifications
    const notificationsResult = await deleteOldNotificationsWrapper(90)
    summary.actions.push({
      task: 'Clean Up Old Notifications',
      status: notificationsResult.success ? 'success' : 'error',
      count: notificationsResult.count,
      message: notificationsResult.message,
      error: notificationsResult.error,
    })
    if (!notificationsResult.success) {
      logger.warn('CRON-JOBS', 'Failed to clean up old notifications', {
        component: 'dailyEngagementTasks',
        action: 'deleteOldNotifications',
        error: notificationsResult.error,
        count: notificationsResult.count,
      })
    }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Daily engagement tasks failed', {
      component: 'dailyEngagementTasks',
    })
    summary.actions.push({
      task: 'Daily Engagement Tasks',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  } finally {
    summary.endTime = new Date()
    summary.duration = summary.endTime.getTime() - summary.startTime.getTime()
    summary.totalActions = summary.actions.length
    summary.successfulActions = summary.actions.filter(a => a.status === 'success').length
    summary.failedActions = summary.actions.filter(a => a.status === 'error').length

    // Send summary email to admins
    try {
      await sendAdminSummaryEmail(summary)
    } catch (emailError) {
      logger.logError(emailError, 'CRON-JOBS', 'Failed to send admin summary email', {
        component: 'dailyEngagementTasks',
        action: 'sendAdminSummaryEmail',
      })
    }
  }
}

// Run on the 1st of each month
export async function monthlyEngagementTasks() {
  const startTime = new Date()
  const summary: CronJobSummary = {
    jobName: 'Monthly Engagement Tasks',
    startTime,
    endTime: new Date(),
    duration: 0,
    actions: [],
    totalActions: 0,
    successfulActions: 0,
    failedActions: 0,
  }

  try {
    // Send monthly usage insights
    const insightsResult = await sendMonthlyInsightsWrapper()
    summary.actions.push({
      task: 'Send Monthly Insights',
      status: insightsResult.success ? 'success' : 'error',
      count: insightsResult.count,
      message: insightsResult.message,
      error: insightsResult.error,
    })
    if (!insightsResult.success) {
      logger.warn('CRON-JOBS', 'Failed to send monthly insights', {
        component: 'monthlyEngagementTasks',
        action: 'sendMonthlyInsights',
        error: insightsResult.error,
        count: insightsResult.count,
      })
    }

    // Clean up old uptime check records
    const uptimeResult = await deleteOldUptimeChecks(30)
    summary.actions.push({
      task: 'Clean Up Old Uptime Checks',
      status: uptimeResult.success ? 'success' : 'error',
      count: uptimeResult.count,
      message: uptimeResult.message,
      error: uptimeResult.error,
    })
    if (!uptimeResult.success) {
      logger.warn('CRON-JOBS', 'Failed to clean up old uptime checks', {
        component: 'monthlyEngagementTasks',
        action: 'deleteOldUptimeChecks',
        error: uptimeResult.error,
        count: uptimeResult.count,
      })
    }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Monthly engagement tasks failed', {
      component: 'monthlyEngagementTasks',
    })
    summary.actions.push({
      task: 'Monthly Engagement Tasks',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  } finally {
    summary.endTime = new Date()
    summary.duration = summary.endTime.getTime() - summary.startTime.getTime()
    summary.totalActions = summary.actions.length
    summary.successfulActions = summary.actions.filter(a => a.status === 'success').length
    summary.failedActions = summary.actions.filter(a => a.status === 'error').length

    // Send summary email to admins
    try {
      await sendAdminSummaryEmail(summary)
    } catch (emailError) {
      logger.logError(emailError, 'CRON-JOBS', 'Failed to send admin summary email', {
        component: 'monthlyEngagementTasks',
        action: 'sendAdminSummaryEmail',
      })
    }
  }
}

// Run weekly on Monday at 10 AM
export async function weeklyEngagementTasks() {
  const startTime = new Date()
  const summary: CronJobSummary = {
    jobName: 'Weekly Engagement Tasks',
    startTime,
    endTime: new Date(),
    duration: 0,
    actions: [],
    totalActions: 0,
    successfulActions: 0,
    failedActions: 0,
  }

  try {
    // Send re-engagement emails to inactive users
    const reEngagementResult = await sendReEngagementEmailsWrapper()
    summary.actions.push({
      task: 'Send Re-engagement Emails',
      status: reEngagementResult.success ? 'success' : 'error',
      count: reEngagementResult.count,
      message: reEngagementResult.message,
      error: reEngagementResult.error,
    })
    if (!reEngagementResult.success) {
      logger.warn('CRON-JOBS', 'Failed to send re-engagement emails', {
        component: 'weeklyEngagementTasks',
        action: 'sendReEngagementEmails',
        error: reEngagementResult.error,
        count: reEngagementResult.count,
      })
    }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Weekly engagement tasks failed', {
      component: 'weeklyEngagementTasks',
    })
    summary.actions.push({
      task: 'Weekly Engagement Tasks',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  } finally {
    summary.endTime = new Date()
    summary.duration = summary.endTime.getTime() - summary.startTime.getTime()
    summary.totalActions = summary.actions.length
    summary.successfulActions = summary.actions.filter(a => a.status === 'success').length
    summary.failedActions = summary.actions.filter(a => a.status === 'error').length

    // Send summary email to admins
    try {
      await sendAdminSummaryEmail(summary)
    } catch (emailError) {
      logger.logError(emailError, 'CRON-JOBS', 'Failed to send admin summary email', {
        component: 'weeklyEngagementTasks',
        action: 'sendAdminSummaryEmail',
      })
    }
  }
}

// Downgrade expired trials to free plan
async function downgradeExpiredTrials(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
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
      return { success: true, count: 0, message: 'No expired trials to downgrade' }
    }


    let processedCount = 0

    // Process each expired trial
    for (const subscription of expiredTrials) {
      const { user, plan: previousPlan } = subscription

      try {
        // Create email hash for trial abuse prevention
        // Normalize email to prevent duplicate hashes from case/whitespace differences
        const crypto = require('crypto')
        const normalizedEmail = user.email.toLowerCase().trim()
        const emailHash = crypto.createHash('sha256').update(normalizedEmail).digest('hex')

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

        // Downgrade subscription to free plan and mark as active
        // This ensures users can continue using the free plan after trial expires
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            plan: 'free',
            status: 'active', // Mark subscription as active so user can continue using free plan
            trialEndsAt: null,
          },
        })

        // Send email notification
        try {
          await sendTrialExpiredEmail(user.id, previousPlan)
        } catch (emailError) {
          logger.warn('CRON-JOBS', 'Failed to send trial expired email', {
            component: 'downgradeExpiredTrials',
            action: 'sendTrialExpiredEmail',
            userId: user.id,
            email: user.email,
            error: emailError instanceof Error ? emailError.message : String(emailError),
          })
        }

        processedCount++

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        logger.warn('CRON-JOBS', 'Failed to downgrade trial for user', {
          component: 'downgradeExpiredTrials',
          action: 'downgradeTrial',
          userId: user.id,
          email: user.email,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return { success: true, count: processedCount, message: `Downgraded ${processedCount} expired trial(s)` }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Failed to downgrade expired trials', {
      component: 'downgradeExpiredTrials',
    })
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Process scheduled email campaigns
async function processScheduledCampaigns(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    const now = new Date()

    const campaigns = await prisma.emailCampaign.findMany({
      where: {
        status: 'scheduled',
        scheduledFor: { lte: now },
      },
    })

    if (campaigns.length === 0) {
      return { success: true, count: 0, message: 'No scheduled campaigns to process' }
    }

    let processedCount = 0
    let failedCount = 0

    for (const campaign of campaigns) {
      try {
        await sendEmailCampaign(campaign.id)
        processedCount++
      } catch (error) {
        logger.warn('CRON-JOBS', 'Failed to send campaign', {
          component: 'processScheduledCampaigns',
          action: 'sendEmailCampaign',
          campaignId: campaign.id,
          campaignName: campaign.name,
          error: error instanceof Error ? error.message : String(error),
        })
        failedCount++
        
        // Mark as failed
        await prisma.emailCampaign.update({
          where: { id: campaign.id },
          data: { status: 'cancelled' },
        })
      }
    }

    return { 
      success: failedCount === 0, 
      count: processedCount, 
      message: `Processed ${processedCount} campaign(s)${failedCount > 0 ? `, ${failedCount} failed` : ''}` 
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Delete old uptime check records
async function deleteOldUptimeChecks(daysToKeep: number): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
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

    return { success: true, count: result.count, message: `Deleted ${result.count} uptime check record(s)` }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Failed to delete old uptime checks', {
      component: 'deleteOldUptimeChecks',
      daysToKeep,
    })
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Delete inactive users after 90 days of inactivity
async function deleteInactiveUsers(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Find users who have been inactive for 90+ days and are not already deleted
    // Include users with null lastLoginAt (never logged in) as they are also considered inactive
    const inactiveUsers = await prisma.user.findMany({
      where: {
        isDeleted: false,
        OR: [
          { lastLoginAt: { lt: ninetyDaysAgo } },
          { lastLoginAt: null },
        ],
      },
      include: {
        subscription: true,
        qrCodes: {
          select: {
            id: true,
          },
        },
      },
    })

    if (inactiveUsers.length === 0) {
      return { success: true, count: 0, message: 'No inactive users to delete' }
    }


    let deletedCount = 0

    // Process each inactive user
    for (const user of inactiveUsers) {
      try {
        // Soft delete the user (mark as deleted rather than hard delete)
        // This preserves referential integrity while marking them as deleted
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isDeleted: true,
            deletedAt: now,
            // Anonymize email to prevent reuse
            email: `deleted_${user.id}@deleted.local`,
            name: null,
            image: null,
            password: null,
          },
        })

        // If user has a subscription, cancel it
        if (user.subscription) {
          try {
            await prisma.subscription.update({
              where: { id: user.subscription.id },
              data: {
                status: 'canceled',
              },
            })
          } catch (subError) {
            logger.warn('CRON-JOBS', 'Failed to cancel subscription for user', {
              component: 'deleteInactiveUsers',
              action: 'cancelSubscription',
              userId: user.id,
              error: subError instanceof Error ? subError.message : String(subError),
            })
          }
        }

        deletedCount++

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        logger.warn('CRON-JOBS', 'Failed to delete inactive user', {
          component: 'deleteInactiveUsers',
          action: 'deleteUser',
          userId: user.id,
          email: user.email,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    return { success: true, count: deletedCount, message: `Deleted ${deletedCount} inactive user(s)` }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Failed to delete inactive users', {
      component: 'deleteInactiveUsers',
    })
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
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

// Get all admin users
async function getAdminUsers() {
  return prisma.user.findMany({
    where: {
      isAdmin: true,
      isDeleted: false,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}

// Send admin summary email
async function sendAdminSummaryEmail(summary: CronJobSummary) {
  try {
    const admins = await getAdminUsers()
    
    if (admins.length === 0) {
      logger.warn('CRON-JOBS', 'No admin users found to send summary email to', {
        component: 'sendAdminSummaryEmail',
      })
      return
    }

    const durationSeconds = Math.round(summary.duration / 1000)
    const durationMinutes = Math.floor(durationSeconds / 60)
    const durationSecondsRemainder = durationSeconds % 60
    const durationText = durationMinutes > 0 
      ? `${durationMinutes}m ${durationSecondsRemainder}s`
      : `${durationSeconds}s`

    const startTimeFormatted = summary.startTime.toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const successRate = summary.totalActions > 0
      ? Math.round((summary.successfulActions / summary.totalActions) * 100)
      : 0

    // Build HTML email
    const actionsHtml = summary.actions.map(action => {
      const statusIcon = action.status === 'success' ? '✅' : '❌'
      const statusColor = action.status === 'success' ? '#059669' : '#dc2626'
      const countText = action.count !== undefined ? ` (${action.count})` : ''
      const messageText = action.message ? ` - ${action.message}` : ''
      const errorText = action.error ? `<br><span style="color: #dc2626; font-size: 12px;">Error: ${action.error}</span>` : ''
      
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="font-size: 18px; margin-right: 8px;">${statusIcon}</span>
            <strong style="color: #374151;">${action.task}</strong>${countText}${messageText}${errorText}
          </td>
        </tr>
      `
    }).join('')

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cron Job Summary</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">📊 Cron Job Summary</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${summary.jobName}</p>
            </td>
          </tr>
          
          <!-- Summary Stats -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 10px; text-align: center; border-right: 1px solid #e5e7eb;">
                          <h3 style="color: #2563eb; font-size: 32px; margin: 0; font-weight: bold;">${summary.totalActions}</h3>
                          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Total Tasks</p>
                        </td>
                        <td width="50%" style="padding: 10px; text-align: center;">
                          <h3 style="color: #059669; font-size: 32px; margin: 0; font-weight: bold;">${summary.successfulActions}</h3>
                          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Successful</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 10px; text-align: center; border-top: 1px solid #e5e7eb;">
                          <h3 style="color: ${summary.failedActions > 0 ? '#dc2626' : '#059669'}; font-size: 32px; margin: 0; font-weight: bold;">${summary.failedActions}</h3>
                          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Failed</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Start Time:</strong> ${startTimeFormatted} UTC</p>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Duration:</strong> ${durationText}</p>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Success Rate:</strong> ${successRate}%</p>
              </div>

              <h2 style="color: #374151; margin: 20px 0 15px 0; font-size: 18px;">Task Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${actionsHtml}
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This is an automated summary from TheQRCode.io cron jobs.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    const text = `
Cron Job Summary: ${summary.jobName}

Summary:
- Total Tasks: ${summary.totalActions}
- Successful: ${summary.successfulActions}
- Failed: ${summary.failedActions}
- Success Rate: ${successRate}%
- Start Time: ${startTimeFormatted} UTC
- Duration: ${durationText}

Task Details:
${summary.actions.map(action => {
  const statusIcon = action.status === 'success' ? '✓' : '✗'
  const countText = action.count !== undefined ? ` (${action.count})` : ''
  const messageText = action.message ? ` - ${action.message}` : ''
  const errorText = action.error ? `\n  Error: ${action.error}` : ''
  return `${statusIcon} ${action.task}${countText}${messageText}${errorText}`
}).join('\n')}

---
This is an automated summary from TheQRCode.io cron jobs.
    `

    const transporter = createTransporter()

    // Send email to all admins
    for (const admin of admins) {
      if (!admin.email) continue

      try {
        const emailOptions = createEmailOptions({
          to: admin.email,
          subject: `Cron Job Summary: ${summary.jobName} - ${summary.successfulActions}/${summary.totalActions} successful`,
          html,
          text,
        })

        await transporter.sendMail(emailOptions)
      } catch (error) {
        logger.warn('CRON-JOBS', 'Failed to send admin summary email', {
          component: 'sendAdminSummaryEmail',
          action: 'sendEmail',
          adminEmail: admin.email,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  } catch (error) {
    logger.logError(error, 'CRON-JOBS', 'Failed to send admin summary emails', {
      component: 'sendAdminSummaryEmail',
    })
    throw error
  }
}

// Wrapper functions to get structured results from email automation functions
async function sendTrialEndingRemindersWrapper(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    // This function doesn't return a count, so we'll need to check the email logs or modify the function
    // For now, we'll wrap it and assume success if no error is thrown
    await sendTrialEndingRemindersOriginal()
    return { success: true, message: 'Trial ending reminders sent' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function sendPeriodicAnalyticsSummariesWrapper(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    const result = await sendPeriodicAnalyticsSummariesOriginal()
    return {
      success: result.success,
      count: result.userCount,
      message: result.success ? `Sent to ${result.userCount} user(s)` : undefined,
      error: result.error ? (typeof result.error === 'string' ? result.error : 'Unknown error') : undefined,
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function sendInactiveUserDeletionWarningsWrapper(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    // This function doesn't return a count, so we'll wrap it
    await sendInactiveUserDeletionWarningsOriginal()
    return { success: true, message: 'Inactive user deletion warnings sent' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function sendMonthlyInsightsWrapper(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    // This function doesn't return a count, so we'll wrap it
    await sendMonthlyInsightsOriginal()
    return { success: true, message: 'Monthly insights sent' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function sendReEngagementEmailsWrapper(): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    // This function doesn't return a count, so we'll wrap it
    await sendReEngagementEmailsOriginal()
    return { success: true, message: 'Re-engagement emails sent' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function deleteOldNotificationsWrapper(daysOld: number): Promise<{ success: boolean; count?: number; message?: string; error?: string }> {
  try {
    const result = await deleteOldNotificationsOriginal(daysOld)
    return {
      success: true,
      count: result.count,
      message: `Deleted ${result.count} old notification(s)`,
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// For Vercel/serverless environments, use Vercel Cron Jobs or external services like:
// - GitHub Actions with scheduled workflows
// - Upstash QStash
// - AWS EventBridge
// - Google Cloud Scheduler

