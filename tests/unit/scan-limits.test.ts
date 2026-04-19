/**
 * Unit tests for scan limit workflow per plan.
 * Verifies that each plan (free, starter, pro) has the correct scan limit and that
 * allowing/blocking works as expected. When period-based scan resets are implemented
 * (e.g. monthly billing period), the same limit logic applies to "current period" count.
 */

import {
  evaluateScanLimit,
  checkScanLimit,
  SCAN_LIMITS,
} from '@/lib/scan-limits'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    subscription: {
      findUnique: jest.fn(),
    },
    scan: {
      count: jest.fn(),
    },
  },
}))

describe('Scan limits (evaluateScanLimit)', () => {
  describe('limit values per plan', () => {
    it('free plan has limit 1000', () => {
      expect(SCAN_LIMITS.free).toBe(1000)
      const r = evaluateScanLimit('free', 0)
      expect(r.limit).toBe(1000)
    })

    it('starter plan has limit 10000', () => {
      expect(SCAN_LIMITS.starter).toBe(10000)
      const r = evaluateScanLimit('starter', 0)
      expect(r.limit).toBe(10000)
    })

    it('developer plan has limit 250000', () => {
      expect(SCAN_LIMITS.developer).toBe(250000)
      const r = evaluateScanLimit('developer', 0)
      expect(r.limit).toBe(250000)
    })

    it('pro plan has limit 500000', () => {
      expect(SCAN_LIMITS.pro).toBe(500000)
      const r = evaluateScanLimit('pro', 0)
      expect(r.limit).toBe(500000)
    })

    it('unknown plan falls back to developer limit', () => {
      const r = evaluateScanLimit('unknown', 0)
      expect(r.limit).toBe(250000)
    })
  })

  describe('free plan workflow', () => {
    it('allows scan when under limit', () => {
      expect(evaluateScanLimit('free', 0).allowed).toBe(true)
      expect(evaluateScanLimit('free', 500).allowed).toBe(true)
      expect(evaluateScanLimit('free', 999).allowed).toBe(true)
    })

    it('blocks scan when at limit', () => {
      const r = evaluateScanLimit('free', 1000)
      expect(r.allowed).toBe(false)
      expect(r.currentCount).toBe(1000)
      expect(r.limit).toBe(1000)
    })

    it('blocks scan when over limit', () => {
      expect(evaluateScanLimit('free', 1001).allowed).toBe(false)
      expect(evaluateScanLimit('free', 2000).allowed).toBe(false)
    })
  })

  describe('starter plan workflow', () => {
    it('allows scan when under limit', () => {
      expect(evaluateScanLimit('starter', 0).allowed).toBe(true)
      expect(evaluateScanLimit('starter', 5000).allowed).toBe(true)
      expect(evaluateScanLimit('starter', 9999).allowed).toBe(true)
    })

    it('blocks scan when at limit', () => {
      const r = evaluateScanLimit('starter', 10000)
      expect(r.allowed).toBe(false)
      expect(r.currentCount).toBe(10000)
      expect(r.limit).toBe(10000)
    })

    it('blocks scan when over limit', () => {
      expect(evaluateScanLimit('starter', 10001).allowed).toBe(false)
    })
  })

  describe('developer plan workflow', () => {
    it('allows scan when under limit', () => {
      expect(evaluateScanLimit('developer', 0).allowed).toBe(true)
      expect(evaluateScanLimit('developer', 249999).allowed).toBe(true)
    })

    it('blocks scan when at limit', () => {
      const r = evaluateScanLimit('developer', 250000)
      expect(r.allowed).toBe(false)
      expect(r.limit).toBe(250000)
    })
  })

  describe('pro plan workflow', () => {
    it('allows scan when under limit', () => {
      expect(evaluateScanLimit('pro', 0).allowed).toBe(true)
      expect(evaluateScanLimit('pro', 100000).allowed).toBe(true)
      expect(evaluateScanLimit('pro', 499999).allowed).toBe(true)
    })

    it('blocks scan when at limit', () => {
      const r = evaluateScanLimit('pro', 500000)
      expect(r.allowed).toBe(false)
      expect(r.currentCount).toBe(500000)
      expect(r.limit).toBe(500000)
    })

    it('blocks scan when over limit', () => {
      expect(evaluateScanLimit('pro', 500001).allowed).toBe(false)
    })
  })

  describe('return shape (ScanLimitResult)', () => {
    it('returns allowed, currentCount, and limit', () => {
      const r = evaluateScanLimit('free', 100)
      expect(r).toMatchObject({
        allowed: true,
        currentCount: 100,
        limit: 1000,
      })
    })

    it('when blocked, allowed is false and counts are correct', () => {
      const r = evaluateScanLimit('starter', 10000)
      expect(r).toMatchObject({
        allowed: false,
        currentCount: 10000,
        limit: 10000,
      })
    })
  })
})

describe('Scan limits (checkScanLimit workflow per plan)', () => {
  const { prisma } = require('@/lib/prisma')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('free plan: allows when under limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'free' })
    prisma.scan.count.mockResolvedValue(500)

    const result = await checkScanLimit('user-1')

    expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    })
    expect(prisma.scan.count).toHaveBeenCalledWith({
      where: { qrCode: { userId: 'user-1' } },
    })
    expect(result).toMatchObject({
      allowed: true,
      currentCount: 500,
      limit: 1000,
    })
  })

  it('free plan: blocks when at limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'free' })
    prisma.scan.count.mockResolvedValue(1000)

    const result = await checkScanLimit('user-free')

    expect(result.allowed).toBe(false)
    expect(result.currentCount).toBe(1000)
    expect(result.limit).toBe(1000)
  })

  it('starter plan: allows when under limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'starter' })
    prisma.scan.count.mockResolvedValue(5000)

    const result = await checkScanLimit('user-2')

    expect(result.allowed).toBe(true)
    expect(result.currentCount).toBe(5000)
    expect(result.limit).toBe(10000)
  })

  it('starter plan: blocks when over limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'starter' })
    prisma.scan.count.mockResolvedValue(10000)

    const result = await checkScanLimit('user-starter')

    expect(result.allowed).toBe(false)
    expect(result.limit).toBe(10000)
  })

  it('developer plan: allows when under limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'developer' })
    prisma.scan.count.mockResolvedValue(100000)

    const result = await checkScanLimit('user-dev')

    expect(result.allowed).toBe(true)
    expect(result.currentCount).toBe(100000)
    expect(result.limit).toBe(250000)
  })

  it('pro plan: allows when under limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'pro' })
    prisma.scan.count.mockResolvedValue(100000)

    const result = await checkScanLimit('user-3')

    expect(result.allowed).toBe(true)
    expect(result.currentCount).toBe(100000)
    expect(result.limit).toBe(500000)
  })

  it('pro plan: blocks when at limit', async () => {
    prisma.subscription.findUnique.mockResolvedValue({ plan: 'pro' })
    prisma.scan.count.mockResolvedValue(500000)

    const result = await checkScanLimit('user-pro')

    expect(result.allowed).toBe(false)
    expect(result.limit).toBe(500000)
  })

  it('no subscription defaults to free plan', async () => {
    prisma.subscription.findUnique.mockResolvedValue(null)
    prisma.scan.count.mockResolvedValue(999)

    const result = await checkScanLimit('user-no-sub')

    expect(result.allowed).toBe(true)
    expect(result.limit).toBe(1000)
  })
})
