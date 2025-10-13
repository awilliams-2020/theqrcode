import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { subDays, subMonths, format } from 'date-fns'
import { startRequestTiming, endRequestTiming } from '@/lib/monitoring-setup'

function extractIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  return 'unknown'
}

export async function GET(req: NextRequest) {
  const requestId = startRequestTiming()
  
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days

    const now = new Date()
    const daysAgo = parseInt(period)
    const startDate = subDays(now, daysAgo)

    // ====================
    // USER ACQUISITION METRICS
    // ====================
    
    // Total users and growth
    const [totalUsers, newUsersInPeriod, previousPeriodUsers] = await Promise.all([
      prisma.user.count({
        where: { isDeleted: false }
      }),
      prisma.user.count({
        where: {
          isDeleted: false,
          createdAt: { gte: startDate }
        }
      }),
      prisma.user.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: subDays(startDate, daysAgo),
            lt: startDate
          }
        }
      })
    ])

    const growthRate = previousPeriodUsers > 0 
      ? ((newUsersInPeriod - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 100

    // Daily user signups for chart
    const dailySignups = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
      FROM "User"
      WHERE "createdAt" >= ${startDate}
        AND "isDeleted" = false
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

    // ====================
    // CONVERSION METRICS
    // ====================
    
    // Users by plan
    const usersByPlan = await prisma.subscription.groupBy({
      by: ['plan'],
      _count: { plan: true },
      where: {
        status: { in: ['active', 'trialing'] }
      }
    })

    const freeUsers = await prisma.user.count({
      where: {
        isDeleted: false,
        subscription: { is: null }
      }
    })

    const planDistribution = [
      { plan: 'free', count: freeUsers },
      ...usersByPlan.map(p => ({ plan: p.plan, count: p._count.plan }))
    ]

    // Conversion rates
    const paidUsers = usersByPlan.reduce((sum, p) => 
      p.plan !== 'free' ? sum + p._count.plan : sum, 0
    )
    const totalActiveUsers = totalUsers
    const freeToAnyPaidRate = totalActiveUsers > 0 
      ? (paidUsers / totalActiveUsers) * 100 
      : 0

    // Trial conversions
    const [activeTrials, convertedTrials] = await Promise.all([
      prisma.subscription.count({
        where: {
          status: 'trialing',
          trialEndsAt: { gt: now }
        }
      }),
      prisma.subscription.count({
        where: {
          status: 'active',
          trialEndsAt: { lte: now },
          updatedAt: { gte: startDate }
        }
      })
    ])

    // ====================
    // CHURN ANALYSIS
    // ====================
    
    const [cancelledSubs, totalEverPaid, downgrades, deletedPaidUsers] = await Promise.all([
      // Cancelled subscriptions in period (excluding deleted accounts to avoid double-counting)
      prisma.subscription.count({
        where: {
          status: 'cancelled',
          updatedAt: { gte: startDate },
          user: {
            isDeleted: false // Exclude deleted accounts - they're counted separately
          }
        }
      }),
      // Total users who ever had a paid plan
      prisma.subscription.count({
        where: {
          plan: { not: 'free' }
        }
      }),
      // Downgrades (paid to free, but account still active)
      prisma.subscription.count({
        where: {
          plan: 'free',
          updatedAt: { gte: startDate },
          user: {
            isDeleted: false // Only count downgrades for active users
          }
        }
      }),
      // Deleted accounts that had paid plans
      prisma.user.count({
        where: {
          isDeleted: true,
          deletedAt: { gte: startDate },
          subscription: {
            plan: { not: 'free' }
          }
        }
      })
    ])

    // Total churn includes cancellations, downgrades, and deleted accounts
    const totalChurned = cancelledSubs + downgrades + deletedPaidUsers
    const churnRate = totalEverPaid > 0 
      ? (totalChurned / totalEverPaid) * 100 
      : 0

    // Monthly churn trend
    const monthlyChurn = await prisma.$queryRaw<Array<{ month: Date; churned: bigint; total: bigint }>>`
      SELECT 
        DATE_TRUNC('month', "updatedAt") as month,
        COUNT(*)::bigint as churned,
        (SELECT COUNT(*)::bigint FROM "Subscription" WHERE plan != 'free' AND status != 'cancelled') as total
      FROM "Subscription"
      WHERE status = 'cancelled'
        AND "updatedAt" >= ${subMonths(now, 6)}
      GROUP BY DATE_TRUNC('month', "updatedAt")
      ORDER BY month ASC
    `

    // ====================
    // REVENUE TRACKING
    // ====================
    
    // Plan pricing (should match your actual pricing)
    const planPrices: Record<string, number> = {
      starter: 9,
      pro: 29,
      business: 99
    }

    // Calculate MRR (Monthly Recurring Revenue)
    const revenueByPlan = await Promise.all(
      Object.keys(planPrices).map(async (plan) => {
        const count = await prisma.subscription.count({
          where: {
            plan,
            status: { in: ['active', 'trialing'] }
          }
        })
        return {
          plan,
          subscribers: count,
          mrr: count * planPrices[plan]
        }
      })
    )

    const totalMRR = revenueByPlan.reduce((sum, p) => sum + p.mrr, 0)
    const totalARR = totalMRR * 12

    // Revenue growth (comparing to previous period)
    const previousPeriodSubs = await prisma.subscription.count({
      where: {
        status: { in: ['active', 'trialing'] },
        createdAt: {
          gte: subDays(startDate, daysAgo),
          lt: startDate
        }
      }
    })

    const currentPeriodSubs = await prisma.subscription.count({
      where: {
        status: { in: ['active', 'trialing'] },
        createdAt: { gte: startDate }
      }
    })

    const revenueGrowthRate = previousPeriodSubs > 0
      ? ((currentPeriodSubs - previousPeriodSubs) / previousPeriodSubs) * 100
      : 100

    // ARPU (Average Revenue Per User)
    const arpu = paidUsers > 0 ? totalMRR / paidUsers : 0

    // ====================
    // FEATURE USAGE ANALYTICS
    // ====================
    
    const [
      totalQRCodes,
      qrCodesInPeriod,
      totalScans,
      scansInPeriod,
      activeAPIKeys,
      apiCallsInPeriod,
      dynamicQRCodes
    ] = await Promise.all([
      prisma.qrCode.count({
        where: { isDeleted: false } // Only count active QR codes
      }),
      prisma.qrCode.count({
        where: { 
          createdAt: { gte: startDate },
          isDeleted: false // Only count active QR codes
        }
      }),
      prisma.scan.count(),
      prisma.scan.count({
        where: { scannedAt: { gte: startDate } }
      }),
      prisma.apiKey.count({
        where: { isActive: true }
      }),
      prisma.apiUsage.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.qrCode.count({
        where: { 
          isDynamic: true,
          isDeleted: false // Only count active dynamic QR codes
        }
      })
    ])

    const avgScansPerQRCode = totalQRCodes > 0 ? totalScans / totalQRCodes : 0

    // QR codes by type
    const qrCodesByType = await prisma.qrCode.groupBy({
      by: ['type'],
      _count: { type: true }
    })

    // Daily scans for chart
    const dailyScans = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE("scannedAt") as date, COUNT(*)::bigint as count
      FROM "Scan"
      WHERE "scannedAt" >= ${startDate}
      GROUP BY DATE("scannedAt")
      ORDER BY date ASC
    `

    // Most active users by feature usage
    const topUsersByQRCodes = await prisma.user.findMany({
      where: { 
        isDeleted: false,
        qrCodes: {
          some: {
            isDeleted: false // Only count active QR codes
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            qrCodes: {
              where: {
                isDeleted: false // Only count active QR codes
              }
            },
            apiKeys: true
          }
        },
        subscription: {
          select: { plan: true }
        }
      },
      orderBy: {
        qrCodes: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Engagement rate (users who created QR codes in period / total users)
    const activeUsersInPeriod = await prisma.user.count({
      where: {
        isDeleted: false,
        qrCodes: {
          some: {
            createdAt: { gte: startDate },
            isDeleted: false // Only count active QR codes
          }
        }
      }
    })

    const engagementRate = totalUsers > 0 
      ? (activeUsersInPeriod / totalUsers) * 100 
      : 0

    // ====================
    // RETURN METRICS
    // ====================
    
    endRequestTiming(requestId, new URL(req.url).pathname, req.method, 200, 
      req.headers.get('user-agent') || undefined, extractIP(req))
    
    return NextResponse.json({
      success: true,
      period: daysAgo,
      userAcquisition: {
        total: totalUsers,
        newInPeriod: newUsersInPeriod,
        growthRate: Math.round(growthRate * 100) / 100,
        dailySignups: dailySignups.map(d => ({
          date: format(new Date(d.date), 'yyyy-MM-dd'),
          count: Number(d.count)
        }))
      },
      conversion: {
        planDistribution,
        freeToAnyPaidRate: Math.round(freeToAnyPaidRate * 100) / 100,
        paidUsers,
        freeUsers,
        activeTrials,
        convertedTrials,
        trialConversionRate: activeTrials > 0 
          ? Math.round((convertedTrials / activeTrials) * 100 * 100) / 100
          : 0
      },
      churn: {
        rate: Math.round(churnRate * 100) / 100,
        cancelledInPeriod: cancelledSubs,
        downgradesInPeriod: downgrades,
        deletedAccountsInPeriod: deletedPaidUsers,
        totalAtRisk: cancelledSubs + downgrades + deletedPaidUsers,
        monthlyTrend: monthlyChurn.map(m => ({
          month: format(new Date(m.month), 'MMM yyyy'),
          rate: Number(m.total) > 0 
            ? Math.round((Number(m.churned) / Number(m.total)) * 100 * 100) / 100
            : 0
        }))
      },
      revenue: {
        mrr: totalMRR,
        arr: totalARR,
        arpu: Math.round(arpu * 100) / 100,
        growthRate: Math.round(revenueGrowthRate * 100) / 100,
        byPlan: revenueByPlan,
        newSubscriptions: currentPeriodSubs
      },
      featureUsage: {
        qrCodes: {
          total: totalQRCodes,
          newInPeriod: qrCodesInPeriod,
          dynamic: dynamicQRCodes,
          avgScansPerCode: Math.round(avgScansPerQRCode * 100) / 100,
          byType: qrCodesByType.map(t => ({
            type: t.type,
            count: t._count.type
          }))
        },
        scans: {
          total: totalScans,
          inPeriod: scansInPeriod,
          dailyScans: dailyScans.map(d => ({
            date: format(new Date(d.date), 'yyyy-MM-dd'),
            count: Number(d.count)
          }))
        },
        api: {
          activeKeys: activeAPIKeys,
          callsInPeriod: apiCallsInPeriod
        },
        engagement: {
          rate: Math.round(engagementRate * 100) / 100,
          activeUsers: activeUsersInPeriod
        },
        topUsers: topUsersByQRCodes.map(u => ({
          id: u.id,
          name: u.name || 'Anonymous',
          email: u.email,
          qrCodes: u._count.qrCodes,
          apiKeys: u._count.apiKeys,
          plan: u.subscription?.plan || 'free'
        }))
      }
    })
  } catch (error) {
    console.error('Failed to fetch admin metrics:', error)
    
    endRequestTiming(requestId, new URL(req.url).pathname, req.method, 500, 
      req.headers.get('user-agent') || undefined, extractIP(req))
    
    return NextResponse.json(
      { error: 'Failed to fetch metrics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

