'use server'

import type { App } from '@api'
import { treaty } from '@elysiajs/eden'
import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/server'
import { APIUrl } from '@/shared/constants/env'

export const baseApi = treaty<App>(APIUrl)

export const api = treaty<App>(APIUrl, {
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
