import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Allow access to public routes
  const publicRoutes = [
    '/auth/signin',
    '/auth/callback',
    '/api/auth',
    '/',
    '/api/seed-demo-user',
    '/api/sync-user-profile',
    '/api/create-supabase-user'
  ]
  const { pathname } = req.nextUrl

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for Supabase session token in cookies
  const supabaseToken = req.cookies.get('sb-access-token') || req.cookies.get('supabase-auth-token')

  // Check for NextAuth session token
  const nextAuthToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token')

  // Allow if either authentication method has a token
  if (supabaseToken || nextAuthToken) {
    return NextResponse.next()
  }

  // If no authentication found, redirect to signin
  const signInUrl = new URL('/auth/signin', req.url)
  signInUrl.searchParams.set('callbackUrl', req.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    // Temporarily disable middleware for testing
    // '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}