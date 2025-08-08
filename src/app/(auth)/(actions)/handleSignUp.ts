'use server'

import { auth } from '@/lib/better-auth/auth'

export const handleSignUp = async (email: string, password: string, username: string) => {
	try {
		await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: username
			}
		})
	} catch (error) {
		return error instanceof Error ? { code: error.message } : { code: 'Unknown error' }
	}
}
