'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	const currentUser = session?.user
	const name = currentUser?.name?.split(' ')[0] ?? 'Anonymous'
	const surname = currentUser?.name?.split(' ')[1] ?? 'Anonymous'
	const email = currentUser?.email ?? 'Anonymous'

	return {
		currentUser,
		name,
		surname,
		email
	}
}
