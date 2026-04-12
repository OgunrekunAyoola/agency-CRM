import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route protection middleware.
 *
 * Cookie names are set by AuthController.cs:
 *   SetTokenCookie("access_token", accessToken)
 *   SetTokenCookie("refresh_token", refreshToken)
 *
 * Both are HttpOnly — readable in middleware (server-side) but NOT in client JS.
 *
 * NOTE: The audit incorrectly suggested checking 'auth_session' — the real
 * cookie is 'access_token'. Using the wrong name would lock out every user.
 */

// Routes that do NOT require authentication
const PUBLIC_PATHS = ['/login', '/portal'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for explicitly public paths
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Check for the access_token cookie set by the .NET backend
  const hasSession = request.cookies.has('access_token');

  if (!isPublic && !hasSession) {
    // Unauthenticated request to a protected route → redirect to login
    const loginUrl = new URL('/login', request.url);
    // Preserve the original destination so login can redirect back
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasSession) {
    // Already authenticated user visiting the login page → redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals, static files, and the API proxy
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
