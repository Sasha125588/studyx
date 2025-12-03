import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
	database: new Pool({
		connectionString: process.env.DATABASE_URL
	}),

	socialProviders: {
		google: {
			prompt: 'select_account',
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!
		}
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	},
	trustedOrigins: [
		'http://localhost:3000', // web app
		'http://localhost:3001', // admin (future)
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
	].filter(Boolean) as string[]
})
