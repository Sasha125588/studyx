import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET!,
	baseURL:
		process.env.NODE_ENV === 'production' ? process.env.API_RAILWAY_URL : 'http://localhost:4000',
	database: new Pool({
		connectionString: process.env.SUPABASE_URL
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
		process.env.FRONTEND_VERCEL_URL,
		process.env.FRONTEND_RAILWAY_URL
	].filter(Boolean) as string[]
})
