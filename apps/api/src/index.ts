import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { blockSubmissionsRoutes } from './modules/block-submissions'
import { coursesRoutes } from './modules/courses'
import { enrollmentsRoutes } from './modules/enrollments'
import { lessonProgressRoutes } from './modules/lesson-progress'
import { lessonsRoutes } from './modules/lessons'
import { modulesRoutes } from './modules/modules'
import { roadmapPositions } from './modules/roadmap-positions'
import { skillsRoutes } from './modules/skills'

const publicPaths = ['/', '/health']

const app = new Elysia()
	.use(
		cors({
			origin: [
				'http://localhost:3000',
				process.env.FRONTEND_VERCEL_URL!,
				process.env.FRONTEND_RAILWAY_URL!
			].filter(Boolean),
			credentials: true
		})
	)
	.onBeforeHandle(({ headers, status, path }) => {
		if (publicPaths.includes(path)) return

		if (!headers['x-user-id']) {
			return status(401)
		}
	})
	.derive(({ headers }) => ({
		userId: headers['x-user-id'] as string
	}))
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
	.use(blockSubmissionsRoutes)
	.use(coursesRoutes)
	.use(enrollmentsRoutes)
	.use(lessonProgressRoutes)
	.use(lessonsRoutes)
	.use(modulesRoutes)
	.use(roadmapPositions)
	.use(skillsRoutes)

const port = process.env.API_PORT ?? 4000

app.listen(port, () => {
	console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
})

export default app

export type App = typeof app
