import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/api']

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow all public and API paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // NextAuth v5 beta uses authjs.session-token OR next-auth.session-token
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value

  const isLoggedIn = Boolean(sessionToken)

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
