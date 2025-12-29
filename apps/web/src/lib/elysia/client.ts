'use server'

import type { App } from '@api'
import { treaty } from '@elysiajs/eden'
import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'

const baseUrl =
	process.env.NODE_ENV === 'production'
		? process.env.NEXT_PUBLIC_API_RAILWAY_URL!
		: 'http://localhost:4000'

export const baseApi = treaty<App>(baseUrl)

export const api = treaty<App>(baseUrl, {
	onRequest: async () => {
		const session = await auth.api.getSession({
			headers: await headers()
		})

		return {
			headers: {
				'x-user-id': session?.user.id ?? ''
			}
		}
	}
})
