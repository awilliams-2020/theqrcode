import { NextRequest } from 'next/server'
import { POST as checkoutHandler } from '@/app/api/stripe/checkout/route'
import { POST as portalHandler } from '@/app/api/stripe/portal/route'
import { POST as webhookHandler } from '@/app/api/stripe/webhook/route'
import { POST as createCustomerHandler } from '@/app/api/stripe/create-customer/route'
import { createMockRequest, cleanupTestData } from './test-utils'

// Mock the database
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock auth options
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

// Mock Stripe
jest.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
    customers: {
      create: jest.fn(),
    },
    subscriptions: {
      retrieve: jest.fn(),
    },
  },
  createCheckoutSession: jest.fn(),
  createPortalSession: jest.fn(),
  createStripeCustomer: jest.fn(),
  STRIPE_PLANS: {
    starter: { priceId: 'price_starter', name: 'Starter', price: 9 },
    pro: { priceId: 'price_pro', name: 'Pro', price: 29 },
    business: { priceId: 'price_business', name: 'Business', price: 99 },
  },
  constructWebhookEvent: jest.fn(),
}))

// Mock Matomo tracking
jest.mock('@/lib/matomo-tracking', () => ({
  trackSubscription: {
    purchase: jest.fn().mockResolvedValue(undefined),
    cancel: jest.fn().mockResolvedValue(undefined),
    renew: jest.fn().mockResolvedValue(undefined),
  },
}))

// Mock Sentry
jest.mock('@/lib/sentry', () => ({
  captureException: jest.fn(),
}))

// Mock Next.js headers
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

describe('Stripe Payment APIs', () => {
  let mockSession: any

  beforeEach(async () => {
    await cleanupTestData()
    jest.clearAllMocks()

    // Mock user session
    mockSession = {
      user: {
        id: 'user123',
        email: 'test@example.com',
      },
    }

    const { getServerSession } = require('next-auth')
    getServerSession.mockResolvedValue(mockSession)
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  describe('POST /api/stripe/checkout', () => {
    it('should create checkout session successfully', async () => {
      const { prisma } = require('@/lib/prisma')
      const { createCheckoutSession } = require('@/lib/stripe')

      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: 'cus_test123',
      })

      createCheckoutSession.mockResolvedValue({
        id: 'cs_test123',
        url: 'https://checkout.stripe.com/c/pay/cs_test123',
      })

      const request = createMockRequest('POST', '/api/stripe/checkout', {
        plan: 'pro',
      })

      const response = await checkoutHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sessionId).toBe('cs_test123')
      expect(data.url).toBe('https://checkout.stripe.com/c/pay/cs_test123')
    })

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth')
      getServerSession.mockResolvedValue(null)

      const request = createMockRequest('POST', '/api/stripe/checkout', {
        plan: 'pro',
      })

      const response = await checkoutHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 400 for invalid plan', async () => {
      const request = createMockRequest('POST', '/api/stripe/checkout', {
        plan: 'invalid-plan',
      })

      const response = await checkoutHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid plan')
    })

    it('should handle missing plan', async () => {
      const request = createMockRequest('POST', '/api/stripe/checkout', {})

      const response = await checkoutHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid plan')
    })

    it('should handle checkout session creation failure', async () => {
      const { createCheckoutSession } = require('@/lib/stripe')
      createCheckoutSession.mockRejectedValue(new Error('Stripe error'))

      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: 'cus_test123',
      })

      const request = createMockRequest('POST', '/api/stripe/checkout', {
        plan: 'pro',
      })

      const response = await checkoutHandler(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create checkout session')
    })
  })

  describe('POST /api/stripe/portal', () => {
    it('should create portal session successfully', async () => {
      const { prisma } = require('@/lib/prisma')
      const { createPortalSession } = require('@/lib/stripe')

      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: 'cus_test123',
      })

      createPortalSession.mockResolvedValue({
        url: 'https://billing.stripe.com/session/test123',
      })

      const request = createMockRequest('POST', '/api/stripe/portal', {})

      const response = await portalHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBe('https://billing.stripe.com/session/test123')
    })

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth')
      getServerSession.mockResolvedValue(null)

      const request = createMockRequest('POST', '/api/stripe/portal', {})

      const response = await portalHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 when no subscription found', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue(null)

      const request = createMockRequest('POST', '/api/stripe/portal', {})

      const response = await portalHandler(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('No active subscription found')
    })

    it('should return 404 when no Stripe customer ID', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: null,
      })

      const request = createMockRequest('POST', '/api/stripe/portal', {})

      const response = await portalHandler(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('No active subscription found')
    })

    it('should handle portal session creation failure', async () => {
      const { createPortalSession } = require('@/lib/stripe')
      createPortalSession.mockRejectedValue(new Error('Stripe error'))

      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: 'cus_test123',
      })

      const request = createMockRequest('POST', '/api/stripe/portal', {})

      const response = await portalHandler(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create portal session')
    })
  })

  describe('POST /api/stripe/webhook', () => {
    beforeEach(() => {
      // Mock headers function
      const { headers } = require('next/headers')
      headers.mockResolvedValue({
        get: jest.fn().mockReturnValue('test-signature'),
      })
    })

    it('should handle checkout.session.completed event', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { prisma } = require('@/lib/prisma')

      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test123',
            metadata: {
              userId: 'user123',
              plan: 'pro',
            },
            customer: 'cus_test123',
            subscription: 'sub_test123',
            amount_total: 2900,
            line_items: {
              data: [{
                price: {
                  id: 'price_pro',
                },
              }],
            },
          },
        },
      }

      constructWebhookEvent.mockReturnValue(mockEvent)
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        plan: 'free',
      })
      prisma.subscription.upsert.mockResolvedValue({})

      // Mock request.text() for webhook body
      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
    })

    it('should handle customer.subscription.updated event', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { prisma } = require('@/lib/prisma')

      const mockEvent = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_test123',
            metadata: {
              userId: 'user123',
            },
            status: 'active',
            current_period_end: Math.floor(Date.now() / 1000) + 86400,
            items: {
              data: [{
                price: {
                  id: 'price_pro',
                },
              }],
            },
          },
        },
      }

      constructWebhookEvent.mockReturnValue(mockEvent)
      prisma.subscription.update.mockResolvedValue({})

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
    })

    it('should handle customer.subscription.deleted event', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { prisma } = require('@/lib/prisma')

      const mockEvent = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_test123',
            metadata: {
              userId: 'user123',
            },
            cancel_at_period_end: false,
            current_period_end: Math.floor(Date.now() / 1000) + 86400,
          },
        },
      }

      constructWebhookEvent.mockReturnValue(mockEvent)
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        plan: 'pro',
      })
      prisma.subscription.update.mockResolvedValue({})

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
    })

    it('should handle invoice.payment_succeeded event', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { prisma } = require('@/lib/prisma')

      const mockEvent = {
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            id: 'in_test123',
            subscription: 'sub_test123',
            amount_paid: 2900,
            billing_reason: 'subscription_cycle',
          },
        },
      }

      constructWebhookEvent.mockReturnValue(mockEvent)
      prisma.subscription.findFirst.mockResolvedValue({
        userId: 'user123',
        plan: 'pro',
      })
      prisma.subscription.updateMany.mockResolvedValue({})

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
    })

    it('should handle invoice.payment_failed event', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { prisma } = require('@/lib/prisma')

      const mockEvent = {
        type: 'invoice.payment_failed',
        data: {
          object: {
            id: 'in_test123',
            subscription: 'sub_test123',
          },
        },
      }

      constructWebhookEvent.mockReturnValue(mockEvent)
      prisma.subscription.updateMany.mockResolvedValue({})

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
    })

    it('should return 400 for missing signature', async () => {
      const { headers } = require('next/headers')
      headers.mockResolvedValue({
        get: jest.fn().mockReturnValue(null),
      })

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No signature')
    })

    it('should return 400 for invalid signature', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { headers } = require('next/headers')
      
      constructWebhookEvent.mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      headers.mockResolvedValue({
        get: jest.fn().mockReturnValue('invalid-signature'),
      })

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid signature')
    })

    it('should handle webhook processing errors', async () => {
      const { constructWebhookEvent } = require('@/lib/stripe')
      const { captureException } = require('@/lib/sentry')

      constructWebhookEvent.mockReturnValue({
        type: 'checkout.session.completed',
        data: { object: {} },
      })

      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockRejectedValue(new Error('Database error'))

      const { headers } = require('next/headers')
      headers.mockResolvedValue({
        get: jest.fn().mockReturnValue('test-signature'),
      })

      const request = createMockRequest('POST', '/api/stripe/webhook', 'webhook-body')
      request.text = jest.fn().mockResolvedValue('webhook-body')

      const response = await webhookHandler(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Webhook handler failed')
      expect(captureException).toHaveBeenCalled()
    })
  })

  describe('POST /api/stripe/create-customer', () => {
    it('should create Stripe customer successfully', async () => {
      const { createStripeCustomer } = require('@/lib/stripe')
      const { prisma } = require('@/lib/prisma')

      createStripeCustomer.mockResolvedValue({
        id: 'cus_test123',
      })

      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: null,
      })
      prisma.subscription.update.mockResolvedValue({})

      const request = createMockRequest('POST', '/api/stripe/create-customer', {})

      const response = await createCustomerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.customerId).toBe('cus_test123')
    })

    it('should return 401 for unauthenticated user', async () => {
      const { getServerSession } = require('next-auth')
      getServerSession.mockResolvedValue(null)

      const request = createMockRequest('POST', '/api/stripe/create-customer', {})

      const response = await createCustomerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return existing customer if already created', async () => {
      const { prisma } = require('@/lib/prisma')

      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: 'cus_existing123',
      })

      const request = createMockRequest('POST', '/api/stripe/create-customer', {})

      const response = await createCustomerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.customerId).toBe('cus_existing123')
      expect(data.message).toBe('User already has Stripe customer')
    })

    it('should handle customer creation failure', async () => {
      const { createStripeCustomer } = require('@/lib/stripe')
      createStripeCustomer.mockRejectedValue(new Error('Stripe error'))

      const { prisma } = require('@/lib/prisma')
      prisma.subscription.findUnique.mockResolvedValue({
        userId: 'user123',
        stripeCustomerId: null,
      })

      const request = createMockRequest('POST', '/api/stripe/create-customer', {})

      const response = await createCustomerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create Stripe customer')
    })
  })
})
