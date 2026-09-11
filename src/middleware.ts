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

const MAINTENANCE_COOKIE = 'r3sults_maintenance_active'

function shouldBypass(pathname: string): boolean {
  if (BYPASS_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true
  if (BYPASS_EXTENSIONS.some(ext => pathname.endsWith(ext))) return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldBypass(pathname)) {
    return NextResponse.next()
  }

  const maintenanceUrl = new URL('/maintenance', request.url)

  // LAYER 1: Environment variable (instant, zero latency, set in Vercel dashboard)
  // This is the primary and most reliable source of truth.
  // Set MAINTENANCE_MODE=1 in Vercel project env vars to enable global maintenance.
  const envMaintenance = process.env.MAINTENANCE_MODE === '1' || process.env.MAINTENANCE_MODE === 'true'

  if (envMaintenance) {
    const response = NextResponse.redirect(maintenanceUrl, 307)
    response.cookies.set(MAINTENANCE_COOKIE, '1', {
      path: '/',
      maxAge: 120,
      sameSite: 'strict',
      httpOnly: true,
    })
    return response
  }

  // If env var explicitly says OFF, clear any stale cookie and allow through
  // so that disabling maintenance via env var ALWAYS works instantly.
  if (process.env.MAINTENANCE_MODE === '0' || process.env.MAINTENANCE_MODE === 'false') {
    const response = NextResponse.next()
    response.cookies.delete(MAINTENANCE_COOKIE)
    return response
  }

  // LAYER 2: Cookie fallback (for returning users when env var not set)
  // Only used as a last resort when MAINTENANCE_MODE env var is not configured.
  const maintenanceCookie = request.cookies.get(MAINTENANCE_COOKIE)
  if (maintenanceCookie?.value === '1') {
    return NextResponse.redirect(maintenanceUrl, 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}