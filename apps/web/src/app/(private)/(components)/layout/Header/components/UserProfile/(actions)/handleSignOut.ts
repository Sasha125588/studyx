'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'

export const handleSignOut = async () =>
	await auth.api.signOut({
		headers: await headers()
	})
