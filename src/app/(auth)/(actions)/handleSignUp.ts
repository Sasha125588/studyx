'use server'

import { auth } from '@/lib/better-auth/server'

export const handleSignUp = async (email: string, password: string, username: string) => 
		await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: username
			}
		})

