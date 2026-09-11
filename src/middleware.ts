import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that should NEVER be redirected to maintenance
const BYPASS_PREFIXES = [
  '/admin',
  '/api',
  '/_next',
  '/maintenance',
  '/favicon',
  '/login',
  '/register',
  '/signup',
]

const BYPASS_EXTENSIONS = ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.woff', '.woff2', '.ttf', '.css', '.js', '.map']

// Cookie used to persist maintenance state between requests as a last resort.
const MAINTENANCE_COOKIE = 'r3sults_maintenance_active'

function shouldBypass(pathname: string): boolean {
  if (BYPASS_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true
  if (BYPASS_EXTENSIONS.some(ext => pathname.endsWith(ext))) return true
  return false
}

// Admin dashboard URL - where maintenance config is managed
const ADMIN_DASHBOARD_URL =
  process.env.ADMIN_DASHBOARD_URL ||
  process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL ||
  'https://results-admin-dashboard.vercel.app'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip maintenance check for bypassed paths
  if (shouldBypass(pathname)) {
    return NextResponse.next()
  }

  const maintenanceUrl = new URL('/maintenance', request.url)

  try {
    let config: any = null

    const isDev = process.env.NODE_ENV !== 'production'
    const timeoutMs = isDev ? 500 : 1500

    // ── Primary: Admin Dashboard API ─────────────────────────────────────────
    try {
      const configRes = await fetch(`${ADMIN_DASHBOARD_URL}/api/public/results-com-maintenance`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'Accept': 'application/json' },
      })
      if (configRes.ok) {
        config = await configRes.json()
      }
    } catch {
      // Primary fetch failed — try local API next
    }

    // ── Secondary: Local /api/maintenance-status ──────────────────────────────
    // Same-origin route — always reachable, no cold-start issues. Acts as a
    // reliable fallback so turning maintenance OFF is always reflected quickly.
    if (!config) {
      try {
        const localUrl = new URL('/api/maintenance-status', request.url)
        const localRes = await fetch(localUrl.toString(), {
          cache: 'no-store',
          signal: AbortSignal.timeout(2000),
          headers: { 'Accept': 'application/json' },
        })
        if (localRes.ok) {
          config = await localRes.json()
        }
      } catch {
        // Local fetch also failed — fall through to cookie as last resort
      }
    }

    if (config) {
      // We have fresh config — evaluate maintenance state
      const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
      const isInMaintenance =
        config.globalMaintenance === true ||
        (config.routes && config.routes[normalizedPath] === true)

      if (isInMaintenance) {
        // Redirect and stamp the persistence cookie (refreshed on every block)
        const response = NextResponse.redirect(maintenanceUrl, 307)
        response.cookies.set(MAINTENANCE_COOKIE, '1', {
          path: '/',
          maxAge: 60, // seconds – re-stamped each blocked request
          sameSite: 'strict',
          httpOnly: true,
        })
        return response
      }

      // Maintenance is OFF — clear cookie and let the user through
      const response = NextResponse.next()
      response.cookies.delete(MAINTENANCE_COOKIE)
      return response
    }

    // ── Last resort: Cookie fallback ──────────────────────────────────────────
    // Both API calls failed. Use the persisted cookie to decide.
    const maintenanceCookie = request.cookies.get(MAINTENANCE_COOKIE)
    if (maintenanceCookie?.value === '1') {
      return NextResponse.redirect(maintenanceUrl, 307)
    }

  } catch (error) {
    console.error('[Middleware] Maintenance check failed:', error)

    // On unexpected error also fall back to cookie check
    const maintenanceCookie = request.cookies.get(MAINTENANCE_COOKIE)
    if (maintenanceCookie?.value === '1') {
      return NextResponse.redirect(maintenanceUrl, 307)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

