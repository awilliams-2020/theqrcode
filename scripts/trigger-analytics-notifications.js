#!/usr/bin/env node

/**
 * Script to manually trigger analytics notifications for theqrcode-dev database
 * This will run the analytics checks and create notifications based on the mock data
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5433/theqrcode-dev'
    }
  }
})

async function triggerAnalyticsNotifications() {
  try {
    console.log('🚀 Starting analytics notification triggers...')
    
    // Get the user ID
    const user = await prisma.user.findFirst({
      where: { email: 'adam.lee.williams.1989@gmail.com' }
    })
    
    if (!user) {
      console.error('❌ User not found')
      return
    }
    
    console.log(`👤 Found user: ${user.email} (${user.id})`)
    
    // Get all QR codes for this user
    const qrCodes = await prisma.qrCode.findMany({
      where: { 
        userId: user.id,
        isDeleted: false 
      }
    })
    
    console.log(`📱 Found ${qrCodes.length} QR codes`)
    
    // Import the analytics notification functions
    const { 
      detectScanSpike,
      notifyNewLocation,
      notifyDeviceTrend,
      sendHourlyAnalyticsSummary,
      notifyPerformanceRecord,
      notifyScanVelocity,
      runAnalyticsChecks
    } = require('../src/lib/engagement/analytics-notifications')
    
    // Run analytics checks for each QR code
    for (const qrCode of qrCodes) {
      console.log(`\n🔍 Analyzing QR Code: ${qrCode.name} (${qrCode.type})`)
      
      // Run comprehensive analytics checks
      const results = await runAnalyticsChecks(user.id, qrCode.id, {
        country: 'United States',
        city: 'New York'
      })
      
      console.log('   Results:', {
        spikeDetection: results.spikeDetection?.spikeDetected || false,
        newLocation: results.newLocation?.isNewLocation || false,
        velocity: results.velocity?.velocityAlert || false,
        performanceRecord: results.performanceRecord?.isRecord || false
      })
    }
    
    // Run general analytics checks
    console.log('\n📊 Running general analytics checks...')
    
    // Check for device trends
    const deviceTrendResult = await notifyDeviceTrend(user.id)
    console.log('   Device trend:', deviceTrendResult.trendDetected ? '✅ Detected' : '❌ None')
    
    // Check for scan velocity
    const velocityResult = await notifyScanVelocity(user.id)
    console.log('   Scan velocity:', velocityResult.velocityAlert ? '✅ High velocity detected' : '❌ Normal')
    
    // Send hourly summary
    const hourlyResult = await sendHourlyAnalyticsSummary(user.id)
    console.log('   Hourly summary:', hourlyResult.sent ? '✅ Sent' : '❌ Not enough activity')
    
    // Check for new locations on specific QR codes
    console.log('\n🌍 Checking for new locations...')
    for (const qrCode of qrCodes.slice(0, 3)) { // Check first 3 QR codes
      const locationResult = await notifyNewLocation(user.id, qrCode.id, 'South Korea', 'Seoul')
      console.log(`   ${qrCode.name}:`, locationResult.isNewLocation ? '✅ New location' : '❌ Known location')
    }
    
    // Get all notifications created
    const notifications = await prisma.notification.findMany({
      where: { 
        userId: user.id,
        type: {
          in: ['analytics_spike', 'analytics_location', 'analytics_trend', 'analytics_summary', 'analytics_record']
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    console.log(`\n📬 Created ${notifications.length} analytics notifications:`)
    notifications.forEach(notif => {
      console.log(`   ${notif.type}: ${notif.title}`)
    })
    
    console.log('\n✅ Analytics notification triggers completed!')
    
  } catch (error) {
    console.error('❌ Error triggering analytics notifications:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
triggerAnalyticsNotifications()
