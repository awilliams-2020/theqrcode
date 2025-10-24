import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { calculateTrialEndDate } from './trial'
import { createStripeCustomer } from './stripe'
import { sendWelcomeEmail } from './engagement/email-automation'
import { verifyOTPToken } from './otp'
import { verifyPassword } from './password'
import { trackUser } from './matomo-tracking'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: "openid profile email"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'password',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const email = credentials.email.toLowerCase().trim()

        // Find user
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.')
        }

        // Verify password
        const isValid = await verifyPassword(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    CredentialsProvider({
      id: 'otp',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        token: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.token) {
          throw new Error('Email and code are required')
        }

        const email = credentials.email.toLowerCase().trim()

        // Verify the OTP
        const result = await verifyOTPToken(email, credentials.token)

        if (!result.success) {
          throw new Error(result.message)
        }

        // Find user (don't create new users for sign-in)
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          throw new Error('No account found with this email. Please sign up first.')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // For JWT strategy, user info comes from token
      // For database strategy, it comes from user
      if (session.user) {
        if (token?.sub) {
          // JWT strategy (used by Credentials provider)
          session.user.id = token.sub
        } else if (user) {
          // Database strategy (used by OAuth providers)
          session.user.id = (user as any).id
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Add user id to token on sign in
      if (user) {
        token.sub = user.id
        
        
        // Track user login in Matomo (async, don't block)
        prisma.subscription.findUnique({
          where: { userId: user.id }
        }).then(subscription => {
          trackUser.login(user.id, subscription?.plan || 'free').catch(err => 
            console.error('[Auth] Login tracking failed:', err instanceof Error ? err.message : 'Unknown error')
          );
        }).catch(err => console.error('[Auth] Subscription fetch for tracking failed:', err instanceof Error ? err.message : 'Unknown error'));
      }
      return token
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers (Google, GitHub), allow both signup and signin
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user?.email) {
          return false
        }
        // Allow both existing users and new signups
        return true
      }

      // Allow existing users to sign in
      return true
    },
  },
  events: {
    async signOut({ token }) {
      // Handle sign out if needed
    },
    async createUser({ user }) {
      // Create subscription record for new users
      try {
        // Default to free plan with active status - the actual plan will be set by the setup-subscription API
        // Free plans don't get trials, so no trialEndsAt

        // Create subscription record first with default free plan and active status
        await prisma.subscription.create({
          data: {
            userId: user.id,
            plan: 'free' as 'free' | 'starter' | 'pro' | 'business',
            status: 'active',
            trialEndsAt: null
          }
        })

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
            console.error('[Auth] Stripe customer creation failed (will retry later):', stripeError instanceof Error ? stripeError.message : 'Unknown error')
          }
        }

        // Track user signup for OAuth users (async, don't block)
        trackUser.signup(user.id).catch(err => 
          console.error('[Auth] Signup tracking failed:', err instanceof Error ? err.message : 'Unknown error')
        );

        // Send welcome email asynchronously (don't block signup)
        sendWelcomeEmail(user.id).catch(error => {
          console.error('[Auth] Welcome email failed:', error instanceof Error ? error.message : 'Unknown error')
        })
      } catch (error) {
        console.error('[Auth] Subscription creation failed:', error instanceof Error ? error.message : 'Unknown error')
        throw error
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt', // Changed to JWT to support Credentials provider
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
