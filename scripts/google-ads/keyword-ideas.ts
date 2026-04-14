/**
 * Fetch keyword ideas and metrics from Google Ads Keyword Plan API.
 * Uses the same .env as create-campaign.ts.
 *
 * Run from app root (theqrcode):
 *   set -a && source .env && set +a && npx tsx scripts/google-ads/keyword-ideas.ts [seed keywords...]
 *   set -a && source .env && set +a && npx tsx scripts/google-ads/keyword-ideas.ts --seeds-file scripts/google-ads/seed-keywords.txt
 *
 * Examples:
 *   npx tsx scripts/google-ads/keyword-ideas.ts "qr code generator" "tracking"
 *   npx tsx scripts/google-ads/keyword-ideas.ts --seeds-file seed-keywords.txt --url https://theqrcode.io/pricing
 *   npx tsx scripts/google-ads/keyword-ideas.ts --seeds-file seeds.csv --min-volume 100 --json
 *
 * Options:
 *   --seeds-file F  Read seed keywords from file (one per line, or CSV first column). # = comment.
 *   --url URL       Use URL seed (optional). With keywords = KeywordAndUrlSeed.
 *   --min-volume N  Only show ideas with avg monthly searches >= N (default: 0).
 *   --top N         Max ideas to show (default: 50).
 *   --exclude W     Exclude ideas whose text contains any of these words (comma-separated, case-insensitive). e.g. --exclude "free,barcode"
 *   --json          Output JSON array for use in campaign-config.
 */

import * as fs from 'fs'
import * as path from 'path'

/** Read seed keywords from a file. .txt/.keywords = one per line (# comment, blank skip). .csv = first column (optional header row). */
function loadSeedsFromFile(filePath: string): string[] {
  const resolved = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
  if (!fs.existsSync(resolved)) throw new Error(`Seeds file not found: ${resolved}`)
  const raw = fs.readFileSync(resolved, 'utf-8')
  const lines = raw.split(/\r?\n/)
  const isCsv = /\.csv$/i.test(filePath)
  const keywords: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (isCsv) {
      const first = line.split(',')[0]?.trim().replace(/^"|"$/g, '') ?? ''
      if (i === 0 && /^(keyword|seed|key)$/i.test(first)) continue // skip header
      if (first) keywords.push(first)
    } else {
      if (!line || line.startsWith('#')) continue
      keywords.push(line)
    }
  }
  return [...new Set(keywords)]
}

const API_VERSION = 'v20'
const BASE_URL = `https://googleads.googleapis.com/${API_VERSION}`

// Defaults: US, English
const LANGUAGE_ID = '1000' // English
const GEO_TARGET_ID = '2840' // United States

interface KeywordIdeaResult {
  text: string
  avgMonthlySearches?: number
  competition?: string
  competitionIndex?: number
}

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

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

async function generateKeywordIdeas(
  accessToken: string,
  customerId: string,
  keywords: string[],
  urlSeed?: string
): Promise<KeywordIdeaResult[]> {
  const managerId = requireEnv('GOOGLE_ADS_MANAGER_CUSTOMER_ID')
  const developerToken = requireEnv('GOOGLE_ADS_DEVELOPER_TOKEN')

  const languageRn = `languageConstants/${LANGUAGE_ID}`
  const geoTargetRn = `geoTargetConstants/${GEO_TARGET_ID}`

  let seed: object
  if (keywords.length && urlSeed) {
    seed = { keywordAndUrlSeed: { keywords, url: urlSeed } }
  } else if (keywords.length) {
    seed = { keywordSeed: { keywords } }
  } else if (urlSeed) {
    seed = { urlSeed: { url: urlSeed } }
  } else {
    throw new Error('Provide at least one seed keyword or --url')
  }

  const body = {
    language: languageRn,
    geoTargetConstants: [geoTargetRn],
    includeAdultKeywords: false,
    keywordPlanNetwork: 'GOOGLE_SEARCH',
    ...seed,
  }

  const apiUrl = `${BASE_URL}/customers/${customerId}:generateKeywordIdeas`
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': managerId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  if (!res.ok) throw new Error(`Google Ads API generateKeywordIdeas: ${res.status} ${text}`)

  const data = JSON.parse(text) as {
    results?: Array<{
      text?: string
      keywordIdeaMetrics?: {
        avgMonthlySearches?: number
        competition?: string
        competitionIndex?: number
      }
    }>
  }

  const results: KeywordIdeaResult[] = (data.results ?? []).map((r) => ({
    text: r.text ?? '',
    avgMonthlySearches: r.keywordIdeaMetrics?.avgMonthlySearches,
    competition: r.keywordIdeaMetrics?.competition,
    competitionIndex: r.keywordIdeaMetrics?.competitionIndex,
  }))
  return results
}

function parseArgs(): {
  keywords: string[]
  url?: string
  minVolume: number
  top: number
  exclude: string[]
  json: boolean
} {
  const args = process.argv.slice(2)
  const cliKeywords: string[] = []
  let seedsFile: string | undefined
  let url: string | undefined
  let minVolume = 0
  let top = 50
  const exclude: string[] = []
  let json = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--seeds-file' && args[i + 1]) {
      seedsFile = args[++i]
    } else if (args[i] === '--url' && args[i + 1]) {
      url = args[++i]
    } else if (args[i] === '--min-volume' && args[i + 1]) {
      minVolume = parseInt(args[++i], 10) || 0
    } else if (args[i] === '--top' && args[i + 1]) {
      top = parseInt(args[++i], 10) || 50
    } else if (args[i] === '--exclude' && args[i + 1]) {
      const val = args[++i]
      exclude.push(...val.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean))
    } else if (args[i] === '--json') {
      json = true
    } else if (!args[i].startsWith('-')) {
      cliKeywords.push(args[i])
    }
  }

  const fileKeywords = seedsFile ? loadSeedsFromFile(seedsFile) : []
  const pathUsed = seedsFile ? new Set([seedsFile]) : new Set<string>()
  const keywords = [...new Set([...fileKeywords, ...cliKeywords.filter((k) => !pathUsed.has(k))])]
  return { keywords, url, minVolume, top, exclude, json }
}

async function main() {
  const { keywords, url, minVolume, top, exclude, json: outputJson } = parseArgs()

  if (!keywords.length && !url) {
    console.error('Usage: npx tsx scripts/google-ads/keyword-ideas.ts [seed keyword ...] [--seeds-file FILE] [--url URL] [--min-volume N] [--top N] [--json]')
    console.error('  --seeds-file: one keyword per line (# comment); or CSV with first column "keyword" or "seed"')
    console.error('Example: npx tsx scripts/google-ads/keyword-ideas.ts --seeds-file seed-keywords.txt --min-volume 100 --top 20')
    process.exit(1)
  }

  const customerId = requireEnv('GOOGLE_ADS_CUSTOMER_ID')
  const accessToken = await getAccessToken()

  const raw = await generateKeywordIdeas(accessToken, customerId, keywords, url)
  let filtered = raw.filter((r) => (r.avgMonthlySearches ?? 0) >= minVolume)
  if (exclude?.length) {
    filtered = filtered.filter((r) => {
      const lower = r.text.toLowerCase()
      return !exclude.some((w) => lower.includes(w))
    })
  }
  filtered.sort((a, b) => (b.avgMonthlySearches ?? 0) - (a.avgMonthlySearches ?? 0))
  filtered = filtered.slice(0, top)

  if (outputJson) {
    const forConfig = filtered.map((r) => ({
      text: r.text,
      matchType: 'PHRASE' as const,
      avgMonthlySearches: r.avgMonthlySearches,
      competition: r.competition,
    }))
    console.log(JSON.stringify(forConfig, null, 2))
    return
  }

  console.log(`Seed: ${keywords.length ? keywords.join(', ') : '—'}${url ? ` | URL: ${url}` : ''}${exclude?.length ? ` | Exclude: ${exclude.join(', ')}` : ''}`)
  console.log(`Geo: US | Language: English | Min volume: ${minVolume} | Showing up to ${top}\n`)
  console.log('Keyword'.padEnd(50) + 'Avg/mo'.padStart(10) + '  Competition')
  console.log('-'.repeat(72))
  for (const r of filtered) {
    const vol = r.avgMonthlySearches != null ? String(r.avgMonthlySearches) : '—'
    const comp = r.competition ?? '—'
    console.log(r.text.slice(0, 48).padEnd(50) + vol.padStart(10) + '  ' + comp)
  }
  console.log(`\n${filtered.length} ideas (of ${raw.length} total)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
