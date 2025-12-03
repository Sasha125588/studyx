import { cors } from '@elysiajs/cors'
import { Elysia, t } from 'elysia'

import { auth } from './lib/auth'

const app = new Elysia()
	// CORS middleware
	.use(
		cors({
			origin: [
				'http://localhost:3000',
				'http://localhost:3001',
				process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
			].filter(Boolean),
			credentials: true
		})
	)
	// Better Auth routes - /auth/*
	.all('/auth/*', ({ request }) => auth.handler(request))
	// Health check
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: '1.0.0'
	}))
	// Echo endpoint for testing
	.post('/echo', ({ body }) => body, {
		body: t.Object({
			name: t.String()
		})
	})
	// API info
	.get('/', () => ({
		name: 'StudyX API',
		version: '1.0.0',
		endpoints: {
			health: '/health',
			auth: '/auth/*',
			echo: '/echo'
		}
	}))

export type App = typeof app

const port = process.env.PORT ?? 4000

app.listen(port, () => {
	console.log(`🚀 API server running on http://localhost:${port}`)
})

export default app
