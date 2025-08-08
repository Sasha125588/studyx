import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = async (request: NextRequest) => {
	const sessionCookie = getSessionCookie(request)

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/courses/:path*']
}
