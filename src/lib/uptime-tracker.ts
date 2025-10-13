import { prisma } from './prisma'

/**
 * Records a health check result to the database
 */
export async function recordHealthCheck(
  status: 'up' | 'down' | 'degraded',
  responseTime?: number,
  statusCode?: number,
  errorMessage?: string
): Promise<void> {
  try {
    await prisma.uptimeCheck.create({
      data: {
        status,
        responseTime,
        statusCode,
        errorMessage,
        checkedAt: new Date()
      }
    })

    // If system is down, start or update downtime incident
    if (status === 'down') {
      await handleDowntime(errorMessage)
    } else {
      // System is up, resolve any open incidents
      await resolveDowntimeIncidents()
    }
  } catch (error) {
    console.error('Failed to record health check:', error)
  }
}

/**
 * Starts a new downtime incident or updates existing one
 */
async function handleDowntime(errorMessage?: string): Promise<void> {
  try {
    // Check if there's an active downtime incident
    const activeIncident = await prisma.downtimeIncident.findFirst({
      where: { resolved: false },
      orderBy: { startedAt: 'desc' }
    })

    if (!activeIncident) {
      // Create new downtime incident
      await prisma.downtimeIncident.create({
        data: {
          startedAt: new Date(),
          cause: determineCause(errorMessage),
          resolved: false,
          notes: errorMessage || 'System health check failed'
        }
      })
    }
    // If active incident exists, we just keep it open
  } catch (error) {
    console.error('Failed to handle downtime:', error)
  }
}

/**
 * Resolves all open downtime incidents
 */
async function resolveDowntimeIncidents(): Promise<void> {
  try {
    const activeIncidents = await prisma.downtimeIncident.findMany({
      where: { resolved: false }
    })

    const now = new Date()

    for (const incident of activeIncidents) {
      const duration = Math.floor((now.getTime() - incident.startedAt.getTime()) / 1000)
      
      await prisma.downtimeIncident.update({
        where: { id: incident.id },
        data: {
          endedAt: now,
          duration,
          resolved: true
        }
      })
    }
  } catch (error) {
    console.error('Failed to resolve downtime incidents:', error)
  }
}

/**
 * Calculate uptime percentage for a given time period
 */
export async function calculateUptime(
  periodDays: number = 30
): Promise<{ uptimePercentage: number; totalDowntime: number; totalChecks: number }> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // Get all downtime incidents in the period
    const incidents = await prisma.downtimeIncident.findMany({
      where: {
        startedAt: {
          gte: startDate
        }
      }
    })

    // Calculate total downtime in seconds
    let totalDowntime = 0
    const now = new Date()

    for (const incident of incidents) {
      if (incident.duration) {
        totalDowntime += incident.duration
      } else if (!incident.resolved) {
        // Incident is still ongoing
        totalDowntime += Math.floor((now.getTime() - incident.startedAt.getTime()) / 1000)
      }
    }

    // Get total number of health checks in period
    const totalChecks = await prisma.uptimeCheck.count({
      where: {
        checkedAt: {
          gte: startDate
        }
      }
    })

    // Calculate total possible uptime in seconds
    const periodSeconds = periodDays * 24 * 60 * 60
    
    // Calculate uptime percentage
    const uptimePercentage = totalDowntime === 0 
      ? 100 
      : ((periodSeconds - totalDowntime) / periodSeconds) * 100

    return {
      uptimePercentage: parseFloat(Math.max(0, Math.min(100, uptimePercentage)).toFixed(2)),
      totalDowntime,
      totalChecks
    }
  } catch (error) {
    console.error('Failed to calculate uptime:', error)
    return { uptimePercentage: 100, totalDowntime: 0, totalChecks: 0 }
  }
}

/**
 * Get recent uptime checks
 */
export async function getRecentUptimeChecks(limit: number = 100) {
  try {
    return await prisma.uptimeCheck.findMany({
      orderBy: { checkedAt: 'desc' },
      take: limit
    })
  } catch (error) {
    console.error('Failed to get recent uptime checks:', error)
    return []
  }
}

/**
 * Get recent downtime incidents
 */
export async function getRecentDowntimeIncidents(limit: number = 10) {
  try {
    return await prisma.downtimeIncident.findMany({
      orderBy: { startedAt: 'desc' },
      take: limit
    })
  } catch (error) {
    console.error('Failed to get recent downtime incidents:', error)
    return []
  }
}

/**
 * Get uptime statistics
 */
export async function getUptimeStatistics() {
  try {
    const [last24h, last7d, last30d] = await Promise.all([
      calculateUptime(1),
      calculateUptime(7),
      calculateUptime(30)
    ])

    const recentIncidents = await getRecentDowntimeIncidents(5)
    const activeIncident = await prisma.downtimeIncident.findFirst({
      where: { resolved: false },
      orderBy: { startedAt: 'desc' }
    })

    return {
      uptime24h: last24h.uptimePercentage,
      uptime7d: last7d.uptimePercentage,
      uptime30d: last30d.uptimePercentage,
      totalDowntime24h: last24h.totalDowntime,
      totalDowntime7d: last7d.totalDowntime,
      totalDowntime30d: last30d.totalDowntime,
      totalChecks24h: last24h.totalChecks,
      totalChecks7d: last7d.totalChecks,
      totalChecks30d: last30d.totalChecks,
      recentIncidents,
      hasActiveIncident: !!activeIncident,
      activeIncident
    }
  } catch (error) {
    console.error('Failed to get uptime statistics:', error)
    return {
      uptime24h: 100,
      uptime7d: 100,
      uptime30d: 100,
      totalDowntime24h: 0,
      totalDowntime7d: 0,
      totalDowntime30d: 0,
      totalChecks24h: 0,
      totalChecks7d: 0,
      totalChecks30d: 0,
      recentIncidents: [],
      hasActiveIncident: false,
      activeIncident: null
    }
  }
}

/**
 * Cleanup old uptime checks (keep last 30 days)
 */
export async function cleanupOldUptimeChecks() {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await prisma.uptimeCheck.deleteMany({
      where: {
        checkedAt: {
          lt: thirtyDaysAgo
        }
      }
    })
  } catch (error) {
    console.error('Failed to cleanup old uptime checks:', error)
  }
}

/**
 * Determine cause of downtime from error message
 */
function determineCause(errorMessage?: string): string {
  if (!errorMessage) return 'unknown'
  
  const message = errorMessage.toLowerCase()
  
  if (message.includes('database') || message.includes('prisma')) {
    return 'database_error'
  }
  if (message.includes('timeout')) {
    return 'timeout'
  }
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return 'server_error'
  }
  
  return 'unknown'
}

/**
 * Format downtime duration for display
 */
export function formatDowntimeDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
  const hours = Math.floor(seconds / 3600)
  const remainingMinutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${remainingMinutes}m`
}

