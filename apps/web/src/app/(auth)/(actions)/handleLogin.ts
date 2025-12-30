'use server'

import { auth } from '@/lib/better-auth/server'

interface handleLoginProps {
	email: string
	password: string
}

export const handleLogin = async ({ email, password }: handleLoginProps) =>
	await auth.api.signInEmail({
		body: {
			email,
			password
		}
	})
