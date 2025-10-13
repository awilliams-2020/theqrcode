/**
 * Script to fix notification URLs in the database
 * Converts /dashboard/analytics to /analytics for all existing notifications
 * 
 * Run with: npx tsx scripts/fix-notification-urls.ts
 * 
 * Note: This is a maintenance script for fixing old notifications.
 * You only need to run this once after URL changes.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixNotificationUrls() {
  console.log('Starting notification URL fix...\n')

  try {
    // Find all notifications with /dashboard/analytics
    const notificationsToUpdate = await prisma.notification.findMany({
      where: {
        actionUrl: {
          contains: '/dashboard/analytics'
        }
      },
      select: {
        id: true,
        actionUrl: true,
        title: true,
      }
    })

    console.log(`Found ${notificationsToUpdate.length} notification(s) to update\n`)

    if (notificationsToUpdate.length === 0) {
      console.log('✓ No notifications need updating!')
      return
    }

    // Update each notification
    let updated = 0
    for (const notification of notificationsToUpdate) {
      const oldUrl = notification.actionUrl
      const newUrl = oldUrl?.replace('/dashboard/analytics', '/analytics')

      if (oldUrl !== newUrl) {
        await prisma.notification.update({
          where: { id: notification.id },
          data: { actionUrl: newUrl }
        })
        
        console.log(`✓ Updated: "${notification.title}"`)
        console.log(`  Old: ${oldUrl}`)
        console.log(`  New: ${newUrl}\n`)
        updated++
      }
    }

    console.log(`\n✓ Successfully updated ${updated} notification(s)!`)
  } catch (error) {
    console.error('Error fixing notification URLs:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
fixNotificationUrls()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })

