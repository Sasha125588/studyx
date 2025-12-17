import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { coursesRoutes } from './modules/courses'

const app = new Elysia()
	.use(
		cors({
			origin: [
				'http://localhost:3000',
				'http://localhost:3001',
				process.env.FRONTEND_VERCEL_URL!,
				process.env.FRONTEND_RAILWAY_URL!
			].filter(Boolean),
			credentials: true
		})
	)
	.use(coursesRoutes)
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: '1.0.0'
	}))
	.get('/', () => ({
		name: 'StudyX API',
		version: '1.0.0',
		endpoints: {
			health: '/health'
		}
	}))

const port = process.env.API_PORT ?? 4000

app.listen(port, () => {
	console.log(`🚀 API server running on http://localhost:${port}`)
})

export default app

export type App = typeof app
