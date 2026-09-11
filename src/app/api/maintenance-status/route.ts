import { NextResponse } from 'next/server'

// This route acts as a reliable local fallback for the middleware maintenance check.
// It proxies the admin dashboard config so that if the external API is slow or
// unavailable, the middleware can still get fresh maintenance state from this
// same-origin endpoint (no cold-start issues, always reachable).

const ADMIN_DASHBOARD_URL =
  process.env.ADMIN_DASHBOARD_URL ||
  process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL ||
  'https://results-admin-dashboard.vercel.app'

// In-memory cache: store the last successfully fetched config with timestamp
let cached: { config: any; fetchedAt: number } | null = null
const CACHE_TTL_MS = 10_000 // 10 seconds

export async function GET() {
  const now = Date.now()

  // Return cached value if fresh
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cached.config, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  try {
    const res = await fetch(
      `${ADMIN_DASHBOARD_URL}/api/public/results-com-maintenance`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
        headers: { Accept: 'application/json' },
      }
    )
    if (res.ok) {
      const config = await res.json()
      cached = { config, fetchedAt: now }
      return NextResponse.json(config, {
        headers: { 'Cache-Control': 'no-store' },
      })
    }
  } catch {
    // Admin API unreachable
  }

  // If fetch fails and we have a stale cache, return that (better than nothing)
  if (cached) {
    return NextResponse.json(cached.config, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  // No data at all — return maintenance OFF as the safe default
  return NextResponse.json(
    { globalMaintenance: false, routes: {} },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}