/**
 * Grafana Cloud OTLP logging client with batching
 * Pushes structured logs to Grafana Cloud's /otlp/v1/logs endpoint
 * No-op when env vars are not set (safe for local dev)
 */

import type { LogLevel, LogCategory, LogContext } from './logger'

const BATCH_INTERVAL_MS = 5_000
const BATCH_SIZE_LIMIT = 100

function getConfig() {
  const url = process.env.GRAFANA_OTLP_URL
  const instanceId = process.env.GRAFANA_INSTANCE_ID
  const apiKey = process.env.GRAFANA_API_KEY
  if (!url || !instanceId || !apiKey) return null
  return { url, instanceId, apiKey }
}

interface BufferedLog {
  timeUnixNano: string
  message: string
  level: LogLevel
  category: LogCategory
  context?: LogContext
}

let buffer: BufferedLog[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null

function startFlushTimer() {
  if (flushTimer) return
  flushTimer = setInterval(flush, BATCH_INTERVAL_MS)
  // Allow Node to exit even if the timer is pending
  if (flushTimer && typeof flushTimer === 'object' && 'unref' in flushTimer) {
    flushTimer.unref()
  }
}

function severityNumber(level: LogLevel): number {
  switch (level) {
    case 'DEBUG': return 5
    case 'INFO': return 9
    case 'WARN': return 13
    case 'ERROR': return 17
  }
}

function flush() {
  if (buffer.length === 0) return

  const config = getConfig()
  if (!config) {
    buffer = []
    return
  }

  const entries = buffer
  buffer = []

  const logRecords = entries.map((entry) => {
    const attributes: { key: string; value: { stringValue: string } }[] = [
      { key: 'category', value: { stringValue: entry.category } },
    ]

    if (entry.context) {
      for (const [key, val] of Object.entries(entry.context)) {
        if (val !== undefined) {
          attributes.push({ key, value: { stringValue: String(val) } })
        }
      }
    }

    return {
      timeUnixNano: entry.timeUnixNano,
      severityNumber: severityNumber(entry.level),
      severityText: entry.level,
      body: { stringValue: entry.message },
      attributes,
    }
  })

  const body = JSON.stringify({
    resourceLogs: [
      {
        resource: {
          attributes: [
            { key: 'service.name', value: { stringValue: 'theqrcode' } },
            { key: 'deployment.environment', value: { stringValue: process.env.NODE_ENV || 'development' } },
          ],
        },
        scopeLogs: [
          {
            logRecords,
          },
        ],
      },
    ],
  })

  const auth = Buffer.from(`${config.instanceId}:${config.apiKey}`).toString('base64')

  fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body,
  }).catch(() => {
    // Silent; push failures are non-fatal
  })
}

export function pushToLoki(
  level: LogLevel,
  category: LogCategory,
  message: string,
  context?: LogContext
): void {
  const config = getConfig()
  if (!config) return

  const timeUnixNano = String(BigInt(Date.now()) * 1_000_000n)

  buffer.push({ timeUnixNano, message, level, category, context })

  if (buffer.length >= BATCH_SIZE_LIMIT) {
    flush()
  } else {
    startFlushTimer()
  }
}
