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

// Cookie used to persist maintenance state between requests.
// If the admin API is unreachable, the middleware falls back to this cookie
// so the site stays locked down instead of letting visitors through.
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

    // Fetch maintenance config from Admin Dashboard public endpoint
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
      // Fetch failed — fall through to cookie fallback below
    }

    if (config) {
      // API responded — determine maintenance state from fresh data
      const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
      const isInMaintenance =
        config.globalMaintenance === true ||
        (config.routes && config.routes[normalizedPath] === true)

      if (isInMaintenance) {
        // Redirect and stamp the persistence cookie.
        // The cookie is refreshed on every blocked request so it stays alive
        // for as long as maintenance mode is active.
        const response = NextResponse.redirect(maintenanceUrl, 307)
        response.cookies.set(MAINTENANCE_COOKIE, '1', {
          path: '/',
          maxAge: 60, // seconds – re-stamped on every blocked request
          sameSite: 'strict',
          httpOnly: true,
        })
        return response
      }

      // API says maintenance is OFF — clear the cookie and let the user through
      const response = NextResponse.next()
      response.cookies.delete(MAINTENANCE_COOKIE)
      return response
    }

    // ── API fetch failed or returned non-OK ───────────────────────────────────
    // Fail-CLOSED: check the persisted cookie.  If it is set the site was in
    // maintenance mode the last time the API successfully responded, so keep
    // blocking until we can confirm otherwise.
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

