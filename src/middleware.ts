import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {
	const pathname = request.nextUrl.pathname
	const sessionCookie = getSessionCookie(request)

	const isAuthenticated = !!sessionCookie
	const isAuthPage = pathname === '/login' || pathname === '/signup'
	const isProtectedPage = !isAuthPage

	if (!isAuthenticated && isProtectedPage) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	if (isAuthenticated && isAuthPage) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/courses/:path*', '/', '/login', '/signup']
}
