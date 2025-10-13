import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Update user timezone preference
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { timezone } = body

    // Validate timezone
    if (!timezone || typeof timezone !== 'string') {
      return NextResponse.json({ error: 'Timezone is required' }, { status: 400 })
    }

    // Basic timezone validation - check if it's a valid IANA timezone
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid timezone' }, { status: 400 })
    }

    // Update user timezone
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { timezone },
      select: {
        id: true,
        timezone: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating user timezone:', error)
    return NextResponse.json(
      { error: 'Failed to update timezone' },
      { status: 500 }
    )
  }
}

/**
 * Get user timezone preference
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      timezone: user.timezone || 'UTC'
    })

  } catch (error) {
    console.error('Error getting user timezone:', error)
    return NextResponse.json(
      { error: 'Failed to get timezone' },
      { status: 500 }
    )
  }
}
