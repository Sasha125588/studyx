import { Elysia, t } from 'elysia'

import { auth } from '@/lib/better-auth/server'

const app = new Elysia({ prefix: '/api' })
	// Better Auth routes - /api/auth/*
	.all('/auth/*', ({ request }) => auth.handler(request))
	// Custom API routes
	.get('/', () => 'Hello Next.js with Elysia!')
	.get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
	.post('/echo', ({ body }) => body, {
		body: t.Object({
			name: t.String()
		})
	})

export type App = typeof app

export const GET = app.handle
export const POST = app.handle

