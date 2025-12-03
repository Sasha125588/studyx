import z from 'zod'

export const signUpFormSchema = z
	.object({
		email: z.email({ message: 'Must be a valid email' }),
		name: z.string(),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters' })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number'
			),
		confirmPassword: z.string()
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})
