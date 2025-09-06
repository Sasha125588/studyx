import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {
	const pathname = request.nextUrl.pathname
	const sessionCookie = getSessionCookie(request)

	const isAuthenticated = !!sessionCookie
	const isAuthPage = pathname === '/login' || pathname === '/signup'
	const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/courses')

	if (!isAuthenticated && isProtectedPage) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	if (isAuthenticated && isAuthPage) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	if (pathname === '/') {
		const redirectUrl = isAuthenticated ? '/dashboard' : '/login'
		return NextResponse.redirect(new URL(redirectUrl, request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/courses/:path*', '/', '/login', '/signup']
}
