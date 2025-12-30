'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	const user = session?.user

	return user
}
