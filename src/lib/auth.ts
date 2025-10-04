import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { calculateTrialEndDate } from './trial'
import { createStripeCustomer } from './stripe'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = (user as any).id
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Check if user is soft-deleted (anonymized but kept for trial abuse prevention)
      if (user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { isDeleted: true }
        })
        
        if (existingUser?.isDeleted) {
          console.log('Sign-in blocked for deleted user:', user.email)
          return false
        }
      }
      return true
    },
  },
  events: {
    async signOut({ token }) {
      // Handle sign out if needed
    },
            async createUser({ user }) {
              // Create subscription record for new users with 14-day trial
              try {
                // Default to free plan with trialing status - the actual plan will be set by the setup-subscription API
                const trialEndsAt = calculateTrialEndDate();
                
                // Create subscription record first with default free plan and trialing status
                await prisma.subscription.create({
                  data: {
                    userId: user.id,
                    plan: 'free' as 'free' | 'starter' | 'pro' | 'business',
                    status: 'trialing',
                    trialEndsAt: trialEndsAt
                  }
                })
                // Created default free subscription with trial

                // Try to create Stripe customer (only if Stripe is properly configured)
                if (process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'development') {
                  try {
                    const stripeCustomer = await createStripeCustomer({
                      userId: user.id,
                      userEmail: user.email!,
                      userName: user.name || undefined,
                    })
                    
                    // Update subscription with Stripe customer ID
                    await prisma.subscription.update({
                      where: { userId: user.id },
                      data: { stripeCustomerId: stripeCustomer.id }
                    })
                  } catch (stripeError) {
                    console.error('Error creating Stripe customer (will retry later):', stripeError)
                  }
                } else {
                  // Skipping Stripe customer creation - not in production or Stripe not configured
                }
              } catch (error) {
                console.error('Error creating subscription:', error)
                throw error
              }
            },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database',
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      },
    },
  },
  debug: true,
}
