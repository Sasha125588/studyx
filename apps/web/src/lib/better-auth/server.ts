import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET!,
	baseURL: 'http://localhost:4000',
	database: new Pool({
		connectionString: process.env.NEXT_PUBLIC_DATABASE_URL
	}),

	socialProviders: {
		google: {
			prompt: 'select_account',
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!
		},
		github: {
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
			clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!
		}
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	},
	trustedOrigins: [
		'http://localhost:3000',
		(process.env.NEXT_PUBLIC_VERCEL_URL
			? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
			: undefined) as string
	],
	plugins: [nextCookies()]
})
