/**
 * Retrigger the trial conversion upload for a user (by ID).
 * Use when the app reported success but the conversion didn't show in Google Ads,
 * or to re-send after fixing conversion action / env.
 *
 * Run from the app root (where src/, Prisma and .env live) with .env loaded, e.g.:
 *   set -a && source .env && set +a && npx tsx scripts/google-ads/retrigger-trial-conversion.ts <userId>
 *
 * Example (user from your log):
 *   npx tsx scripts/google-ads/retrigger-trial-conversion.ts cmlztm7g80007l54yehrpwrcm
 *
 * Required env: same as conversion upload (GOOGLE_ADS_*, ADMIN_GOOGLE_* or refresh token),
 *   plus GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID and DATABASE_URL for Prisma.
 */

import { PrismaClient } from '@prisma/client'
import { uploadClickConversion } from '../../src/lib/google-ads'

const prisma = new PrismaClient()

async function main() {
  const userId = process.argv[2]
  if (!userId) {
    console.error('Usage: npx tsx scripts/google-ads/retrigger-trial-conversion.ts <userId>')
    process.exit(1)
  }

  const trialActionId = process.env.GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID
  if (!trialActionId) {
    console.error('GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID is not set.')
    process.exit(1)
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, gclid: true },
  })

  if (!user) {
    console.error('User not found:', userId)
    process.exit(1)
  }

  if (!user.gclid) {
    console.error('User has no gclid; cannot upload click conversion. User:', user.id, user.email ?? '')
    process.exit(1)
  }

  console.log('Uploading trial conversion for user', user.id, user.email ?? '', 'gclid:', user.gclid.slice(0, 24) + '…')
  const result = await uploadClickConversion({
    gclid: user.gclid,
    conversionDateTime: new Date(),
    conversionValue: 0,
    conversionActionId: trialActionId,
  })
  console.log('Done. Response results count:', result.results?.length)
  if (result.partialFailureError) {
    console.warn('Partial failure:', JSON.stringify(result.partialFailureError, null, 2))
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
