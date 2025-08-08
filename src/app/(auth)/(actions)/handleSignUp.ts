'use server'

import { auth } from '@/lib/better-auth/server'

export const handleSignUp = async (email: string, password: string, username: string) => {
	try {
		return await auth.api.signUpEmail({
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
