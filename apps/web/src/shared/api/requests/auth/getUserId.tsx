'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'

export const getUserId = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	return session?.user.id
}
