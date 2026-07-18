import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const path = req.nextUrl.pathname
  const isAuthPage = path === '/signin' || path === '/signup'

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
