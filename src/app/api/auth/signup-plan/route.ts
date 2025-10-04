import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()
    
    // Validate plan
    if (!['free', 'starter', 'pro', 'business'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Store the plan in a cookie that will be available during auth
    const response = NextResponse.json({ success: true })
    response.cookies.set('signupPlan', plan, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    })

    return response
  } catch (error) {
    console.error('Error setting signup plan:', error)
    return NextResponse.json({ error: 'Failed to set signup plan' }, { status: 500 })
  }
}
