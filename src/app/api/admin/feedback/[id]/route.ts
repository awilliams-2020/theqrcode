import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Admin only: Update feedback status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { status, priority, adminNotes } = body

    const feedback = await prisma.feedback.update({
      where: { id: params.id },
      data: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    })

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error('Failed to update feedback:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    )
  }
}

