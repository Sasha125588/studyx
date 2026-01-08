import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from './lib/better-auth/server'
import { updateSession } from './lib/supabase/proxy'

export const proxy = async (request: NextRequest) => {
	const pathname = request.nextUrl.pathname
	const session = await auth.api.getSession({ headers: await headers() })

	if (pathname.startsWith('/admin')) {
		if (!session) {
			return NextResponse.redirect(new URL('/login', request.url))
		}

		if (!['admin', 'teacher'].includes(session.user.role)) {
			return NextResponse.redirect(new URL('/', request.url))
		}
	}

	const isAuthenticated = !!session?.session

	const isAuthPage = pathname === '/login' || pathname === '/signup'
	const isProtectedPage = !isAuthPage

	if (!isAuthenticated && isProtectedPage) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	if (isAuthenticated && isAuthPage) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return await updateSession(request)
}

export const config = {
	matcher: ['/courses/:path*', '/', '/login', '/signup', '/admin/:path*']
}
