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
 */

// Routes that are fully public (no session required) — prefix matches
const PUBLIC_PREFIXES = [
  '/login',
  '/register',
  '/signup',
  '/portal',
  '/forgot-password',
  '/reset-password',
];

// Exact public paths (not prefix-matched to avoid accidental catch-all)
const PUBLIC_EXACT = ['/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the access_token cookie set by the .NET backend
  const hasSession = request.cookies.has('access_token');

  // Landing page: redirect authenticated users straight to the dashboard
  if (pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isPublic =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isPublic && !hasSession) {
    // Unauthenticated request to a protected route → redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already-authenticated users visiting auth pages → redirect to dashboard
  if (hasSession && (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
