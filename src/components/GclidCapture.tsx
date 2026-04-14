'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

function getGclidSentKey(userId: string) {
  return `gclid-sent-${userId}`
}

function getGclidFromCookie(): string | null {
  const row = document.cookie
    .split('; ')
    .find((r) => r.startsWith('gclid='))
  if (!row) return null
  const eq = row.indexOf('=')
  return eq >= 0 ? row.slice(eq + 1).trim() : null
}

/**
 * 1. Any page (blog, tool, home): store ?gclid= in a cookie.
 * 2. After signup (OAuth or password): when session exists and cookie has gclid, persist to user in DB (once per user per browser session).
 */
export function GclidCapture() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  // Store gclid from URL in cookie on any entry page (params are lost on nav)
  useEffect(() => {
    const fromUrl = searchParams.get('gclid')
    if (fromUrl) {
      const expires = new Date()
      expires.setDate(expires.getDate() + 90)
      const secure = location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `gclid=${fromUrl}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`
    }
  }, [searchParams])

  // Once authenticated, persist gclid to user if present in cookie (covers OAuth signup; password signup also does this in signup page). Per-user key so each new user gets a send.
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return
    if (typeof sessionStorage === 'undefined' || sessionStorage.getItem(getGclidSentKey(userId))) return
    const gclid = getGclidFromCookie()
    if (!gclid) return
    fetch('/api/user/save-gclid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gclid }),
    })
      .then((r) => r.ok && sessionStorage.setItem(getGclidSentKey(userId), '1'))
      .catch(() => {})
  }, [status, userId])

  return null
}
