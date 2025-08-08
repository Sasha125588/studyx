'use server'

import { auth } from '@/lib/better-auth/server'

export const handleLogin = async (email: string, password: string) => {
	return await auth.api.signInEmail({
		body: {
			email,
			password
		}
	})
}
