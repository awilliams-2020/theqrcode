import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create or update view record
    await prisma.announcementView.upsert({
      where: {
        announcementId_userId: {
          announcementId: params.id,
          userId: session.user.id,
        },
      },
      create: {
        announcementId: params.id,
        userId: session.user.id,
      },
      update: {
        viewedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to mark announcement as viewed:', error)
    return NextResponse.json(
      { error: 'Failed to mark announcement as viewed' },
      { status: 500 }
    )
  }
}

