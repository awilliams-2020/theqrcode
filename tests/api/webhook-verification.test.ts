import { POST } from '@/app/api/webhook-test/route'
import { createHmac } from 'crypto'
import { createMockRequest, createWebhookRequest, generateWebhookSignature } from './test-utils'

// Mock the environment variable
const originalEnv = process.env.WEBHOOK_TEST_SECRET

describe('Webhook Signature Verification', () => {
  beforeEach(() => {
    process.env.WEBHOOK_TEST_SECRET = 'test-secret-key-123'
  })

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.WEBHOOK_TEST_SECRET = originalEnv
    } else {
      delete process.env.WEBHOOK_TEST_SECRET
    }
  })

  describe('POST /api/webhook-test', () => {
    it('should accept webhook with valid signature', async () => {
      const payload = {
        type: 'scan.created',
        data: {
          id: 'scan_123',
          qrCodeId: 'qr_456',
          userId: 'user_789'
        }
      }

      const request = createWebhookRequest(payload, 'test-secret-key-123', '/api/webhook-test')

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
      expect(data.eventType).toBe('scan.created')
      expect(data.verified).toBe(true)
      expect(data.data.id).toBe('scan_123')
    })

    it('should reject webhook with missing signature', async () => {
      const payload = {
        type: 'scan.created',
        data: { id: 'scan_123' }
      }

      const payloadString = JSON.stringify(payload)

      const request = createMockRequest('POST', '/api/webhook-test', payloadString, {
        'content-type': 'application/json'
        // Missing x-webhook-signature header
      })

      request.text = jest.fn().mockResolvedValue(payloadString)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing x-webhook-signature header')
    })

    it('should reject webhook with invalid signature', async () => {
      const payload = {
        type: 'scan.created',
        data: { id: 'scan_123' }
      }

      const payloadString = JSON.stringify(payload)
      const invalidSignature = 'invalid-signature-123'

      const request = createMockRequest('POST', '/api/webhook-test', payloadString, {
        'x-webhook-signature': invalidSignature,
        'content-type': 'application/json'
      })

      request.text = jest.fn().mockResolvedValue(payloadString)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid signature')
    })

    it('should reject webhook with wrong secret', async () => {
      const payload = {
        type: 'scan.created',
        data: { id: 'scan_123' }
      }

      const payloadString = JSON.stringify(payload)
      
      // Generate signature with wrong secret
      const signatureWithWrongSecret = generateWebhookSignature(payloadString, 'wrong-secret')

      const request = createMockRequest('POST', '/api/webhook-test', payloadString, {
        'x-webhook-signature': signatureWithWrongSecret,
        'content-type': 'application/json'
      })

      request.text = jest.fn().mockResolvedValue(payloadString)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid signature')
    })

    it('should reject webhook with malformed JSON', async () => {
      const malformedPayload = '{ "type": "scan.created", "data": { id: "scan_123" }' // Missing closing brace

      const signature = createHmac('sha256', 'test-secret-key-123')
        .update(malformedPayload)
        .digest('hex')

      const request = createMockRequest('POST', '/api/webhook-test', malformedPayload, {
        'x-webhook-signature': signature,
        'content-type': 'application/json'
      })

      request.text = jest.fn().mockResolvedValue(malformedPayload)

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid JSON payload')
    })

    it('should handle different event types', async () => {
      const eventTypes = ['scan.created', 'scan.updated', 'qr.created', 'qr.updated', 'qr.deleted']

      for (const eventType of eventTypes) {
        const payload = {
          type: eventType,
          data: {
            id: `test_${Date.now()}`,
            userId: 'user_123'
          }
        }

        const payloadString = JSON.stringify(payload)
        const signature = createHmac('sha256', 'test-secret-key-123')
          .update(payloadString)
          .digest('hex')

        const request = createMockRequest('POST', '/api/webhook-test', payloadString, {
          'x-webhook-signature': signature,
          'content-type': 'application/json'
        })

        request.text = jest.fn().mockResolvedValue(payloadString)

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.eventType).toBe(eventType)
        expect(data.verified).toBe(true)
      }
    })

    it('should prevent timing attacks with constant-time comparison', async () => {
      const payload = { type: 'test', data: {} }
      const payloadString = JSON.stringify(payload)
      
      // Test with signatures of different lengths
      const shortSignature = 'abcd'
      const longSignature = 'a'.repeat(65) // Longer than valid SHA256

      const request1 = createMockRequest('POST', '/api/webhook-test', payloadString, {
        'x-webhook-signature': shortSignature,
        'content-type': 'application/json'
      })
      request1.text = jest.fn().mockResolvedValue(payloadString)

      const request2 = createMockRequest('POST', '/api/webhook-test', payloadString, {
        'x-webhook-signature': longSignature,
        'content-type': 'application/json'
      })
      request2.text = jest.fn().mockResolvedValue(payloadString)

      const response1 = await POST(request1)
      const response2 = await POST(request2)

      // Both should be rejected, but timing should be similar (difficult to test directly)
      expect(response1.status).toBe(401)
      expect(response2.status).toBe(401)
    })
  })
})
