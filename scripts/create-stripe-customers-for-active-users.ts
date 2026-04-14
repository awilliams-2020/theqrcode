/**
 * Create Stripe customers for active users who have a subscription but no stripeCustomerId.
 *
 * Run from the app root with .env loaded, e.g.:
 *   set -a && source .env && set +a && npx tsx scripts/create-stripe-customers-for-active-users.ts
 *
 * Optional: dry run (no Stripe or DB writes):
 *   DRY_RUN=1 npx tsx scripts/create-stripe-customers-for-active-users.ts
 *
 * Required env: STRIPE_SECRET_KEY, DATABASE_URL
 */

import { PrismaClient } from '@prisma/client'
import { createStripeCustomer } from '../src/lib/stripe'

const prisma = new PrismaClient()
const isDryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'

async function main() {
  if (!process.env.STRIPE_SECRET_KEY && !isDryRun) {
    console.error('STRIPE_SECRET_KEY is not set.')
    process.exit(1)
  }

  if (isDryRun) {
    console.log('DRY RUN: no Stripe or DB changes will be made.\n')
  }

  // Subscriptions with no stripeCustomerId, for users that are not deleted
  const subscriptions = await prisma.subscription.findMany({
    where: {
      stripeCustomerId: null,
      user: {
        deletedAt: null,
        isDeleted: false,
      },
    },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  })

  console.log(`Found ${subscriptions.length} active user(s) without a Stripe customer ID.\n`)

  if (subscriptions.length === 0) {
    console.log('Nothing to do.')
    return
  }

  let created = 0
  let failed = 0

  for (const sub of subscriptions) {
    const { user } = sub
    const email = user.email ?? ''
    const name = user.name ?? undefined

    if (!email) {
      console.warn(`Skipping user ${user.id}: no email`)
      failed++
      continue
    }

    console.log(`User ${user.id} (${email}) …`)

    if (isDryRun) {
      console.log(`  [DRY RUN] Would create Stripe customer and set stripeCustomerId on subscription ${sub.id}`)
      created++
      continue
    }

    try {
      const customer = await createStripeCustomer({
        userId: user.id,
        userEmail: email,
        userName: name,
      })

      await prisma.subscription.update({
        where: { id: sub.id },
        data: { stripeCustomerId: customer.id },
      })

      console.log(`  Created Stripe customer ${customer.id}`)
      created++
    } catch (err) {
      console.error(`  Failed:`, err)
      failed++
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
