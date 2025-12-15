import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protected admin routes
  const adminRoutes = ['/dashboard', '/barang', '/kategori', '/lokasi-penyimpanan', '/account-settings']

  // Check if requesting admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isUserDashboardRoute = pathname.startsWith('/user-dashboard')

  if (isAdminRoute || isUserDashboardRoute) {
    const userSession = request.cookies.get('user_session')

    // If no session, redirect to login
    if (!userSession) {
      console.log(`[Middleware] No session found for ${pathname}, redirecting to login`)

      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const session = JSON.parse(userSession.value)

      console.log(`[Middleware] Session found for ${pathname}:`, { role: session.role })

      // Check if trying to access admin route
      if (isAdminRoute) {
        if (session.role !== 'admin') {
          console.log(`[Middleware] Non-admin trying to access ${pathname}, redirecting to user-dashboard`)

          return NextResponse.redirect(new URL('/user-dashboard', request.url))
        }
      }

      // Check if trying to access user dashboard
      if (isUserDashboardRoute) {
        if (session.role === 'admin') {
          console.log(`[Middleware] Admin trying to access ${pathname}, redirecting to dashboard`)

          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    } catch (error) {
      console.log(`[Middleware] Invalid session for ${pathname}, redirecting to login`)

      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/barang/:path*',
    '/kategori/:path*',
    '/lokasi-penyimpanan/:path*',
    '/account-settings/:path*',
    '/user-dashboard/:path*'
  ]
}
