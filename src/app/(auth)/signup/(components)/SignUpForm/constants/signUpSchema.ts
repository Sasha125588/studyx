import z from 'zod'

export const signUpFormSchema = z
	.object({
		email: z
			.string()
			.min(1, { message: 'Email is required' })
			.email({ message: 'Must be a valid email' }),
		username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
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
