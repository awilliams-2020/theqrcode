import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!existingUser) {
      // For OAuth users, this shouldn't happen as they should be auto-created
      // But if it does, return a more helpful error
      return NextResponse.json({ 
        error: 'User account not found. Please try signing in again.',
        needsReauth: true 
      }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: existingUser })
  } catch (error) {
    console.error('Check user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
