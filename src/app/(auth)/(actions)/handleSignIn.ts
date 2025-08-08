'use server'

import { auth } from '@/lib/better-auth/auth'

export const handleSignIn = async (email: string, password: string) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password
			}
		})
	} catch (error) {
		console.log(error)
		return error instanceof Error ? { code: error.message } : { code: 'Unknown error' }
	}
}
