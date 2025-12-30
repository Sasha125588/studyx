'use server'

import { auth } from '@/lib/better-auth/server'

interface handleSignUpProps {
	name: string
	email: string
	password: string
}

export const handleSignUp = async ({ name, email, password }: handleSignUpProps) =>
	await auth.api.signUpEmail({
		body: {
			email,
			password,
			name
		}
	})
