import z from 'zod'

export const loginFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Must be a valid email' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' })
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		)
})
