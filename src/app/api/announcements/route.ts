import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscription plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    const userPlan = user?.subscription?.plan || 'free'
    const now = new Date()

    // Get active announcements for user's plan
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
          {
            OR: [
              { targetPlans: { has: 'all' } },
              { targetPlans: { has: userPlan } },
            ],
          },
        ],
      },
      orderBy: [
        { priority: 'desc' },
        { startDate: 'desc' },
      ],
      include: {
        views: {
          where: { userId: session.user.id },
        },
      },
    })

    return NextResponse.json({
      success: true,
      announcements: announcements.map(a => ({
        ...a,
        isViewed: a.views.length > 0,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

