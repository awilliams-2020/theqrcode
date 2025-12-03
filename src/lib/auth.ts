import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { createStripeCustomer } from './stripe'
import { sendWelcomeEmail } from './engagement/email-automation'
import { verifyOTPToken } from './otp'
import { verifyPassword } from './password'
import { trackUser } from './matomo-tracking'

export const authOptions: NextAuthOptions = {
  // Removed PrismaAdapter since Session table was removed and we're using JWT strategy
  secret: process.env.NEXTAUTH_SECRET,
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
        // For OAuth providers, we need to look up the actual database user
        if (account?.provider === 'google' || account?.provider === 'github') {
          // Look up the user in the database by email
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
        if (dbUser) {
          token.sub = dbUser.id
          // Update last login timestamp
          prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() }
          }).catch(() => {});
          // Track user login in Matomo (async, don't block)
          prisma.subscription.findUnique({
            where: { userId: dbUser.id }
          }).then(subscription => {
            trackUser.login(dbUser.id, subscription?.plan || 'free').catch(() => {});
          }).catch(() => {});
        } else {
          // User doesn't exist yet - create the user now
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || null,
              image: user.image || null,
              emailVerified: new Date(), // OAuth users are automatically verified
            }
          })

          // Create subscription record for new user
          await prisma.subscription.create({
            data: {
              userId: newUser.id,
              plan: 'free',
              status: 'active',
              trialEndsAt: null
            }
          })

          // Try to create Stripe customer (only if Stripe is properly configured)
          if (process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production') {
            try {
              const stripeCustomer = await createStripeCustomer({
                userId: newUser.id,
                userEmail: newUser.email!,
                userName: newUser.name || undefined,
              })

              // Update subscription with Stripe customer ID
              await prisma.subscription.update({
                where: { userId: newUser.id },
                data: { stripeCustomerId: stripeCustomer.id }
              })
            } catch (stripeError) {
              // Stripe customer creation failed, will retry later
            }
          }

          // Track user signup (async, don't block)
          trackUser.signup(newUser.id).catch(() => {})

          // Send welcome email (async, don't block)
          sendWelcomeEmail(newUser.id).catch(() => {})

          token.sub = newUser.id
        }
        } else {
          // For credentials provider, use the user.id directly
          token.sub = user.id
          // Update last login timestamp
          prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          }).catch(() => {});
          // Track user login in Matomo (async, don't block)
          prisma.subscription.findUnique({
            where: { userId: user.id }
          }).then(subscription => {
            trackUser.login(user.id, subscription?.plan || 'free').catch(() => {});
          }).catch(() => {});
        }
      }
      return token
    },
    async signIn({ user, account }) {
      // For OAuth providers, always allow - createUser will handle new users
      if (account?.provider === 'google' || account?.provider === 'github') {
        if (!user?.email) {
          return false
        }
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
