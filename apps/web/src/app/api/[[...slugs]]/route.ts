import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
// import { serverTiming } from '@elysiajs/server-timing'
import type { SocketAddress } from 'bun'
import { Elysia, NotFoundError } from 'elysia'
// import { helmet } from 'elysia-helmet'
import { DefaultContext, rateLimit } from 'elysia-rate-limit'
import { notFound } from 'next/navigation'

import { logger } from '@/lib/pino/logger'
import { createClient } from '@/lib/supabase/server'
// import { docsCsp } from '@/shared/api/constants'
import { blockSubmissionsRoutes } from '@/shared/api/elysia/modules/block-submissions'
import { BlockSubmissionService } from '@/shared/api/elysia/modules/block-submissions/service'
import { coursesRoutes } from '@/shared/api/elysia/modules/courses'
import { CourseService } from '@/shared/api/elysia/modules/courses/service'
import { enrollmentsRoutes } from '@/shared/api/elysia/modules/enrollments'
import { EnrollmentService } from '@/shared/api/elysia/modules/enrollments/service'
import { lessonProgressRoutes } from '@/shared/api/elysia/modules/lesson-progress'
import { LessonProgressService } from '@/shared/api/elysia/modules/lesson-progress/service'
import { lessonsRoutes } from '@/shared/api/elysia/modules/lessons'
import { LessonService } from '@/shared/api/elysia/modules/lessons/service'
import { modulesRoutes } from '@/shared/api/elysia/modules/modules'
import { ModuleService } from '@/shared/api/elysia/modules/modules/service'
import { roadmapPositions } from '@/shared/api/elysia/modules/roadmap-positions'
import { RoadmapPositionsService } from '@/shared/api/elysia/modules/roadmap-positions/service'
import { APIError, isNextJsInternalError } from '@/shared/api/errors'

const ipGenerator = (_r: unknown, _s: unknown, { ip }: { ip?: SocketAddress }) =>
	ip?.address ?? 'unknown'

export const app = new Elysia({ prefix: '/api' })
	// .onRequest(({ request }) => {
	// 	logger.info(
	// 		{
	// 			method: request.method,
	// 			url: request.url
	// 		},
	// 		'Request started'
	// 	)
	// })
	// .onAfterResponse(({ request, set }) => {
	// 	logger.info(
	// 		{
	// 			method: request.method,
	// 			url: request.url,
	// 			status: set.status || 200
	// 		},
	// 		'Request completed'
	// 	)
	// })

	.onError(({ code, error, request, set }) => {
		if (isNextJsInternalError(error)) {
			logger.debug(
				{
					method: request.method,
					url: request.url,
					digest: error.digest
				},
				'Next.js internal error - re-throwing'
			)
			throw error
		}

		if (error instanceof NotFoundError) {
			logger.info(
				{
					method: request.method,
					url: request.url,
					message: error.message
				},
				'NotFoundError - triggering Next.js notFound()'
			)

			notFound()
		}

		if (error instanceof APIError) {
			logger.warn(
				{
					method: request.method,
					url: request.url,
					status: error.status,
					code: error.code,
					message: error.message
				},
				'API Error'
			)

			set.status = error.status
			return {
				success: false,
				message: error.message,
				code: error.code
			}
		}

		logger.error(
			{
				method: request.method,
				url: request.url,
				code,
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined
			},
			'Internal Server Error'
		)

		set.status = 500
		return {
			success: false,
			message: 'Internal Server Error'
		}
	})

	.derive(async () => {
		const supabase = await createClient()

		return {
			roadmapPositionsService: new RoadmapPositionsService(supabase),
			courseService: new CourseService(supabase),
			enrollmentService: new EnrollmentService(supabase),
			lessonService: new LessonService(supabase),
			moduleService: new ModuleService(supabase),
			blockSubmissionService: new BlockSubmissionService(supabase),
			lessonProgressService: new LessonProgressService(supabase)
		}
	})

	// .trace(async ({ onBeforeHandle, onAfterHandle, onRequest, onError }) => {
	// 	onRequest(({ begin, onStop }) => {
	// 		onStop(({ end }) => {
	// 			logger.info(
	// 				{
	// 					phase: 'request',
	// 					duration: end - begin
	// 				},
	// 				'Request took'
	// 			)
	// 		})
	// 	})

	// 	onBeforeHandle(({ begin, onStop }) => {
	// 		onStop(({ end }) => {
	// 			logger.debug(
	// 				{
	// 					phase: 'beforeHandle',
	// 					duration: end - begin
	// 				},
	// 				'BeforeHandle took'
	// 			)
	// 		})
	// 	})

	// 	onAfterHandle(({ begin, onStop }) => {
	// 		onStop(({ end }) => {
	// 			logger.debug(
	// 				{
	// 					phase: 'afterHandle',
	// 					duration: end - begin
	// 				},
	// 				'AfterHandle took'
	// 			)
	// 		})
	// 	})

	// 	onError(({ begin, onStop }) => {
	// 		onStop(({ end, error }) => {
	// 			logger.error(
	// 				{
	// 					phase: 'error',
	// 					duration: end - begin,
	// 					error: error?.message
	// 				},
	// 				'Error occurred in trace'
	// 			)
	// 		})
	// 	})
	// })

	// .use(
	// 	helmet({
	// 		contentSecurityPolicy: {
	// 			useDefaults: false,
	// 			directives: strictCsp
	// 		},
	// 		hsts: {
	// 			maxAge: 31_536_000,
	// 			includeSubDomains: true,
	// 			preload: true
	// 		},
	// 		xFrameOptions: { action: 'deny' },
	// 		referrerPolicy: {
	// 			policy: ['strict-origin-when-cross-origin']
	// 		}
	// 	})
	// )

	// .use(
	// 	serverTiming({
	// 		trace: {
	// 			request: true,
	// 			parse: true,
	// 			transform: true,
	// 			beforeHandle: true,
	// 			handle: true,
	// 			afterHandle: true,
	// 			error: true,
	// 			mapResponse: true,
	// 			total: true
	// 		}
	// 	})
	// )

	.use(
		cors({
			origin: [
				process.env.FRONTEND_VERCEL_URL!,
				process.env.FRONTEND_RAILWAY_URL!,
				'http://localhost:3000',
				'http://localhost:3001',
				'http://localhost:3024'
			],
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
			maxAge: 86_400
		})
	)

	.use(
		rateLimit({
			duration: 60_000,
			max: 100,
			headers: true,
			scoping: 'scoped',
			countFailedRequest: true,
			errorResponse: new Response(
				String({
					error: 'Too many requests'
				}),
				{ status: 429 }
			),
			generator: ipGenerator,
			context: new DefaultContext(10_000)
		})
	)

	// .group('', app =>
	// 	app
	// 		.use(
	// 			helmet({
	// 				contentSecurityPolicy: {
	// 					useDefaults: false,
	// 					directives: docsCsp
	// 				}
	// 			})
	// 		)
	// 		.use(openapi())
	// )

	.use(openapi())

	.use(blockSubmissionsRoutes)
	.use(coursesRoutes)
	.use(enrollmentsRoutes)
	.use(lessonProgressRoutes)
	.use(lessonsRoutes)
	.use(modulesRoutes)
	.use(roadmapPositions)
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: '1.0.0'
	}))

export const GET = app.fetch
export const POST = app.fetch
export const DELETE = app.fetch
export const PUT = app.fetch
export const PATCH = app.fetch

export type App = typeof app
