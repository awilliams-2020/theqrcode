import { prisma } from './prisma'
import { logger } from './logger'

const GOOGLE_ADS_API_VERSION = 'v20'
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`

async function getAdminAccessToken(): Promise<string> {
  const account = await prisma.account.findFirst({
    where: { provider: 'google-admin' },
    select: { refresh_token: true },
    orderBy: { expires_at: 'desc' },
  })

  if (!account?.refresh_token) {
    throw new Error('No Google Ads refresh token found. Sign into the admin app first.')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.ADMIN_GOOGLE_CLIENT_ID || '',
      client_secret: process.env.ADMIN_GOOGLE_CLIENT_SECRET || '',
      refresh_token: account.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Google Ads access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function uploadClickConversion({
  gclid,
  conversionDateTime,
  conversionValue,
  currencyCode = 'USD',
  conversionActionId: explicitConversionActionId,
}: {
  gclid: string
  conversionDateTime: Date
  conversionValue: number
  currencyCode?: string
  /** Optional: use this conversion action instead of default purchase. Pass env GOOGLE_ADS_TRIAL_CONVERSION_ACTION_ID for trial. */
  conversionActionId?: string
}) {
  // Manager (MCC) = auth only. Customer (client) = account that owns campaigns and conversion actions.
  const managerCustomerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
  const conversionActionId =
    explicitConversionActionId ?? process.env.GOOGLE_ADS_CONVERSION_ACTION_ID ?? ''

  if (!managerCustomerId || !customerId || !developerToken || !conversionActionId) {
    logger.warn('GOOGLE-ADS', 'Conversion skipped — missing env', { hasManagerId: !!managerCustomerId, hasCustomerId: !!customerId, hasToken: !!developerToken, hasActionId: !!conversionActionId })
    throw new Error('Missing Google Ads env vars: GOOGLE_ADS_MANAGER_CUSTOMER_ID, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_DEVELOPER_TOKEN, or conversion action ID')
  }

  logger.info('GOOGLE-ADS', 'Uploading click conversion', { gclid, conversionValue, currencyCode, conversionActionId, customerId })
  const accessToken = await getAdminAccessToken()

  // Format required by Google Ads API: "yyyy-MM-dd HH:mm:ss+00:00"
  const formatted = conversionDateTime
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '+00:00')

  const debugConversions = process.env.GOOGLE_ADS_DEBUG_CONVERSIONS === 'true'
  const body = {
    conversions: [
      {
        gclid,
        conversionAction: `customers/${customerId}/conversionActions/${conversionActionId}`,
        conversionDateTime: formatted,
        conversionValue,
        currencyCode,
      },
    ],
    partialFailure: true,
    debugEnabled: debugConversions,
  }

  const response = await fetch(
    `${GOOGLE_ADS_BASE_URL}/customers/${customerId}:uploadClickConversions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'login-customer-id': managerCustomerId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    logger.error('GOOGLE-ADS', 'API error', { status: response.status, body: error })
    throw new Error(`Google Ads API error: ${response.status} ${error}`)
  }

  const result = await response.json()
  const partialFailureJson = result.partialFailureError
    ? JSON.stringify(result.partialFailureError, null, 2)
    : undefined
  // Log each result so we can see if Google actually accepted the conversion (e.g. conversionDateTime may be present on success)
  const resultSummary = result.results?.map((r: { gclid?: string; conversionDateTime?: string; conversionAction?: string }) => ({
    gclid: r.gclid ? `${String(r.gclid).slice(0, 20)}…` : undefined,
    conversionDateTime: r.conversionDateTime,
    conversionAction: r.conversionAction,
  }))
  logger.info('GOOGLE-ADS', 'Conversion upload response', {
    partialFailureError: partialFailureJson,
    resultsCount: result.results?.length,
    results: resultSummary == null ? undefined : JSON.stringify(resultSummary),
  })
  return result
}

// Using REST API approach instead of heavy SDK

interface GoogleAdsConfig {
  customerId: string
  developerToken: string
  clientId: string
  clientSecret: string
}

export function getGoogleAdsConfig(): GoogleAdsConfig {
  return {
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  }
}

export async function getGoogleAdsClient(accessToken: string) {
  const config = getGoogleAdsConfig()
  
  if (!config.customerId || !config.developerToken || !config.clientId || !config.clientSecret) {
    throw new Error('Google Ads API configuration is incomplete')
  }

  // Return a REST API client configuration
  return {
    customerId: config.customerId,
    developerToken: config.developerToken,
    accessToken,
    baseUrl: 'https://googleads.googleapis.com/v16'
  }
}

export async function getCampaigns(accessToken: string) {
  try {
    const client = await getGoogleAdsClient(accessToken)
    
    const response = await fetch(`${client.baseUrl}/customers/${client.customerId}/campaigns:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`,
        'developer-token': client.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type
          FROM campaign
          ORDER BY campaign.name
          LIMIT 20
        `
      })
    })

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    logger.logError(error as Error, 'GOOGLE-ADS', 'Error fetching campaigns')
    throw new Error('Failed to fetch campaigns')
  }
}

export async function getCampaignPerformance(accessToken: string, campaignId: string, startDate: string, endDate: string) {
  try {
    const client = await getGoogleAdsClient(accessToken)
    
    const response = await fetch(`${client.baseUrl}/customers/${client.customerId}/googleAds:search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`,
        'developer-token': client.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          SELECT 
            campaign.id, 
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            segments.date
          FROM campaign
          WHERE campaign.id = ${campaignId}
          AND segments.date BETWEEN '${startDate}' AND '${endDate}'
          ORDER BY segments.date
        `
      })
    })

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    logger.logError(error as Error, 'GOOGLE-ADS', 'Error fetching campaign performance')
    throw new Error('Failed to fetch campaign performance')
  }
}

export async function createCampaign(accessToken: string, campaignData: any) {
  try {
    const client = await getGoogleAdsClient(accessToken)
    
    const response = await fetch(`${client.baseUrl}/customers/${client.customerId}/campaigns:mutate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`,
        'developer-token': client.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operations: [{
          create: {
            name: campaignData.name,
            advertising_channel_type: campaignData.type,
            status: campaignData.status,
            budget: {
              amount_micros: campaignData.budget * 1000000, // Convert to micros
              delivery_method: 'STANDARD',
            },
          }
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results?.[0] || null
  } catch (error) {
    logger.logError(error as Error, 'GOOGLE-ADS', 'Error creating campaign')
    throw new Error('Failed to create campaign')
  }
}

export async function updateCampaign(accessToken: string, campaignId: string, updates: any) {
  try {
    const client = await getGoogleAdsClient(accessToken)
    
    const response = await fetch(`${client.baseUrl}/customers/${client.customerId}/campaigns:mutate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`,
        'developer-token': client.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operations: [{
          update: {
            resource_name: `customers/${client.customerId}/campaigns/${campaignId}`,
            ...updates
          }
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results?.[0] || null
  } catch (error) {
    logger.logError(error as Error, 'GOOGLE-ADS', 'Error updating campaign')
    throw new Error('Failed to update campaign')
  }
}

export async function deleteCampaign(accessToken: string, campaignId: string) {
  try {
    const client = await getGoogleAdsClient(accessToken)
    
    const response = await fetch(`${client.baseUrl}/customers/${client.customerId}/campaigns:mutate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${client.accessToken}`,
        'developer-token': client.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operations: [{
          remove: `customers/${client.customerId}/campaigns/${campaignId}`
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    logger.logError(error as Error, 'GOOGLE-ADS', 'Error deleting campaign')
    throw new Error('Failed to delete campaign')
  }
}