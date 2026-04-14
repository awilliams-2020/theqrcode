/**
 * Create a Google Ads Search campaign from a JSON config file.
 *
 * Run from app root (theqrcode, where .env and package.json live). Load env first, e.g.:
 *   set -a && source .env && set +a && npx tsx scripts/google-ads/create-campaign.ts
 *
 * Usage:
 *   npx tsx scripts/google-ads/create-campaign.ts [path/to/campaign-config.json]
 *
 * Default config path: scripts/google-ads/campaign-config.json
 *
 * Required env: GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_MANAGER_CUSTOMER_ID,
 *   GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_REFRESH_TOKEN,
 *   and either ADMIN_GOOGLE_CLIENT_ID + ADMIN_GOOGLE_CLIENT_SECRET
 *   or GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET (for refreshing the token).
 */

import * as fs from 'fs'
import * as path from 'path'

const API_VERSION = 'v20'
const BASE_URL = `https://googleads.googleapis.com/${API_VERSION}`

// --- Config types (from JSON) ---
interface BudgetConfig {
  name: string
  dailyAmountUsd: number
  deliveryMethod?: 'STANDARD' | 'ACCELERATED'
}

interface CampaignConfig {
  name: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
  networkSettings?: {
    targetGoogleSearch?: boolean
    targetSearchNetwork?: boolean
    targetContentNetwork?: boolean
    targetPartnerSearchNetwork?: boolean
  }
}

interface ResponsiveSearchAdConfig {
  headlines: string[]
  descriptions: string[]
  finalUrl: string
  path1?: string
  path2?: string
}

interface KeywordConfig {
  text: string
  matchType: 'EXACT' | 'PHRASE' | 'BROAD'
}

interface AdGroupConfig {
  name: string
  ads: ResponsiveSearchAdConfig[]
  keywords: KeywordConfig[]
}

interface SitelinkConfig {
  text: string
  url: string
  description1?: string
  description2?: string
}

interface NegativeKeywordConfig {
  text: string
  matchType: 'EXACT' | 'PHRASE' | 'BROAD'
}

interface CampaignFileConfig {
  budget: BudgetConfig
  campaign: CampaignConfig
  adGroups: AdGroupConfig[]
  sitelinks?: SitelinkConfig[]
  negativeKeywords?: NegativeKeywordConfig[]
}

// --- Validation ---
const MAX_HEADLINE_LEN = 30
const MAX_DESCRIPTION_LEN = 90
const MAX_PATH_LEN = 15

function validateConfig(config: CampaignFileConfig): string[] {
  const errors: string[] = []
  if (!config.budget?.name) errors.push('budget.name is required')
  if (config.budget?.dailyAmountUsd == null || config.budget.dailyAmountUsd <= 0)
    errors.push('budget.dailyAmountUsd must be a positive number')
  if (!config.campaign?.name) errors.push('campaign.name is required')
  if (!Array.isArray(config.adGroups) || config.adGroups.length === 0)
    errors.push('adGroups must be a non-empty array')
  config.negativeKeywords?.forEach((n, i) => {
    if (!n.text?.trim()) errors.push(`negativeKeywords[${i}].text is required`)
    if (!['EXACT', 'PHRASE', 'BROAD'].includes(n.matchType))
      errors.push(`negativeKeywords[${i}].matchType must be EXACT, PHRASE, or BROAD`)
  })

  config.adGroups?.forEach((ag, i) => {
    if (!ag.name) errors.push(`adGroups[${i}].name is required`)
    if (!Array.isArray(ag.ads) || ag.ads.length === 0)
      errors.push(`adGroups[${i}].ads must be a non-empty array`)
    ag.ads.forEach((ad, j) => {
      if (!Array.isArray(ad.headlines) || ad.headlines.length < 3)
        errors.push(`adGroups[${i}].ads[${j}]: at least 3 headlines required`)
      ad.headlines.forEach((h, k) => {
        if (h.length > MAX_HEADLINE_LEN)
          errors.push(`adGroups[${i}].ads[${j}].headlines[${k}] exceeds ${MAX_HEADLINE_LEN} chars`)
      })
      if (!Array.isArray(ad.descriptions) || ad.descriptions.length < 2)
        errors.push(`adGroups[${i}].ads[${j}]: at least 2 descriptions required`)
      ad.descriptions.forEach((d, k) => {
        if (d.length > MAX_DESCRIPTION_LEN)
          errors.push(`adGroups[${i}].ads[${j}].descriptions[${k}] exceeds ${MAX_DESCRIPTION_LEN} chars`)
      })
      if (!ad.finalUrl?.trim()) errors.push(`adGroups[${i}].ads[${j}].finalUrl is required`)
      if (ad.path1 && ad.path1.length > MAX_PATH_LEN)
        errors.push(`adGroups[${i}].ads[${j}].path1 exceeds ${MAX_PATH_LEN} chars`)
      if (ad.path2 && ad.path2.length > MAX_PATH_LEN)
        errors.push(`adGroups[${i}].ads[${j}].path2 exceeds ${MAX_PATH_LEN} chars`)
    })
    if (!Array.isArray(ag.keywords) || ag.keywords.length === 0)
      errors.push(`adGroups[${i}].keywords must be a non-empty array`)
    ag.keywords.forEach((kw, j) => {
      if (!kw.text?.trim()) errors.push(`adGroups[${i}].keywords[${j}].text is required`)
      if (!['EXACT', 'PHRASE', 'BROAD'].includes(kw.matchType))
        errors.push(`adGroups[${i}].keywords[${j}].matchType must be EXACT, PHRASE, or BROAD`)
    })
  })

  return errors
}

// --- Auth (script uses env only; no Prisma) ---
async function getAccessToken(): Promise<string> {
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
  const clientId = process.env.ADMIN_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.ADMIN_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error(
      'Missing env: GOOGLE_ADS_REFRESH_TOKEN and (ADMIN_GOOGLE_CLIENT_ID + ADMIN_GOOGLE_CLIENT_SECRET) or (GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET)'
    )
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

// --- API client ---
function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

async function mutate(
  accessToken: string,
  customerId: string,
  resource: string,
  operations: object[]
): Promise<{ results?: { resourceName: string }[] }> {
  const managerId = requireEnv('GOOGLE_ADS_MANAGER_CUSTOMER_ID')
  const developerToken = requireEnv('GOOGLE_ADS_DEVELOPER_TOKEN')

  const url = `${BASE_URL}/customers/${customerId}/${resource}:mutate`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': managerId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operations }),
  })

  const body = await res.text()
  if (!res.ok) throw new Error(`Google Ads API ${resource}: ${res.status} ${body}`)
  return JSON.parse(body) as { results?: { resourceName: string }[] }
}

// --- Create resources in order ---
async function main() {
  const args = process.argv.slice(2)
  const validateOnly = args.includes('--validate') || args.includes('-v')
  const configPath =
    args.find((a) => !a.startsWith('-')) ||
    path.join(process.cwd(), 'scripts', 'google-ads', 'campaign-config.json')

  if (!fs.existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`)
    console.error('Copy campaign-config.example.json to campaign-config.json and edit it.')
    process.exit(1)
  }

  const raw = fs.readFileSync(configPath, 'utf-8')
  let config: CampaignFileConfig
  try {
    config = JSON.parse(raw) as CampaignFileConfig
  } catch (e) {
    console.error('Invalid JSON in config file:', e)
    process.exit(1)
  }

  const errors = validateConfig(config)
  if (errors.length > 0) {
    console.error('Config validation failed:')
    errors.forEach((e) => console.error('  -', e))
    process.exit(1)
  }
  console.log('Config validated.')
  if (validateOnly) {
    console.log('--validate passed. Run without --validate to create resources.')
    return
  }
  console.log('')

  const customerId = requireEnv('GOOGLE_ADS_CUSTOMER_ID')
  const accessToken = await getAccessToken()
  console.log('Authenticated.\n')

  // 1. Campaign budget
  const budgetRes = await mutate(accessToken, customerId, 'campaignBudgets', [
    {
      create: {
        name: config.budget.name,
        amountMicros: Math.round(config.budget.dailyAmountUsd * 1_000_000),
        deliveryMethod: config.budget.deliveryMethod || 'STANDARD',
        explicitlyShared: false, // required for Maximize conversions (single-campaign budget)
      },
    },
  ])
  const budgetResourceName = budgetRes.results?.[0]?.resourceName
  if (!budgetResourceName) {
    console.error('Failed to create budget:', budgetRes)
    process.exit(1)
  }
  console.log('Created budget:', budgetResourceName)

  // 2. Campaign
  const network = config.campaign.networkSettings ?? {}
  const campaignRes = await mutate(accessToken, customerId, 'campaigns', [
    {
      create: {
        name: config.campaign.name,
        status: config.campaign.status || 'PAUSED',
        campaignBudget: budgetResourceName,
        advertisingChannelType: 'SEARCH',
        containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING',
        networkSettings: {
          targetGoogleSearch: network.targetGoogleSearch ?? true,
          targetSearchNetwork: network.targetSearchNetwork ?? true,
          targetContentNetwork: network.targetContentNetwork ?? false,
          targetPartnerSearchNetwork: network.targetPartnerSearchNetwork ?? false,
        },
        maximizeConversions: {},
      },
    },
  ])
  const campaignResourceName = campaignRes.results?.[0]?.resourceName
  if (!campaignResourceName) {
    console.error('Failed to create campaign:', campaignRes)
    process.exit(1)
  }
  console.log('Created campaign:', campaignResourceName)

  // 2b. Sitelinks (optional): create assets, then link to campaign
  if (config.sitelinks?.length) {
    const assetOps = config.sitelinks.map((s) => {
      const sitelinkAsset: Record<string, string> = {
        linkText: String(s.text),
        ...(typeof s.description1 === 'string' && typeof s.description2 === 'string'
          ? { description1: s.description1, description2: s.description2 }
          : {}),
      }
      return {
        create: {
          sitelinkAsset,
          finalUrls: [s.url],
        },
      }
    })
    const assetRes = await mutate(accessToken, customerId, 'assets', assetOps)
    const assetNames = (assetRes.results ?? []).map((r) => r.resourceName).filter(Boolean) as string[]
    if (assetNames.length) {
      const campaignAssetOps = assetNames.map((assetRn) => ({
        create: {
          asset: assetRn,
          campaign: campaignResourceName,
          fieldType: 'SITELINK',
        },
      }))
      await mutate(accessToken, customerId, 'campaignAssets', campaignAssetOps)
      console.log(`Created ${assetNames.length} sitelink(s).`)
    }
  }

  // 2c. Campaign negative keywords (optional)
  if (config.negativeKeywords?.length) {
    const negOps = config.negativeKeywords.map((n) => ({
      create: {
        campaign: campaignResourceName,
        negative: true,
        keyword: { text: n.text, matchType: n.matchType },
      },
    }))
    await mutate(accessToken, customerId, 'campaignCriteria', negOps)
    console.log(`Added ${config.negativeKeywords.length} campaign negative keyword(s).`)
  }

  // 3. Ad groups, then ads, then keywords per ad group
  for (const ag of config.adGroups) {
    const agRes = await mutate(accessToken, customerId, 'adGroups', [
      {
        create: {
          name: ag.name,
          status: 'ENABLED',
          campaign: campaignResourceName,
          type: 'SEARCH_STANDARD',
        },
      },
    ])
    const adGroupResourceName = agRes.results?.[0]?.resourceName
    if (!adGroupResourceName) {
      console.error('Failed to create ad group:', ag.name, agRes)
      continue
    }
    console.log('Created ad group:', adGroupResourceName)

    for (const ad of ag.ads) {
      const headlines = ad.headlines.slice(0, 15).map((text) => ({ text }))
      const descriptions = ad.descriptions.slice(0, 4).map((text) => ({ text }))
      const rsa: Record<string, unknown> = {
        headlines,
        descriptions,
      }
      if (ad.path1) rsa.path1 = ad.path1
      if (ad.path2) rsa.path2 = ad.path2

      const adRes = await mutate(accessToken, customerId, 'adGroupAds', [
        {
          create: {
            status: 'ENABLED',
            adGroup: adGroupResourceName,
            ad: {
              finalUrls: [ad.finalUrl],
              responsiveSearchAd: rsa,
            },
          },
        },
      ])
      if (adRes.results?.[0]?.resourceName) {
        console.log('  Created ad:', adRes.results[0].resourceName)
      } else {
        console.error('  Failed to create ad:', adRes)
      }
    }

    const keywordOps = ag.keywords.map((kw) => ({
      create: {
        status: 'ENABLED',
        adGroup: adGroupResourceName,
        keyword: {
          text: kw.text,
          matchType: kw.matchType,
        },
      },
    }))
    const kwRes = await mutate(accessToken, customerId, 'adGroupCriteria', keywordOps)
    const created = kwRes.results?.length ?? 0
    console.log(`  Created ${created} keyword(s).`)
  }

  console.log('\nDone. Campaign is created in PAUSED state. Enable it in Google Ads when ready.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
