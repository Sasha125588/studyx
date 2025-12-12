import { cacheLife } from 'next/cache'

import { api } from '@/lib/elysia/client'

export const getCourse = async (courseSlug: string) => {
	'use cache'
	cacheLife('minutes')

	try {
		const { data, error } = await api.courses({ slug: courseSlug }).get()

		return {
			data: data ?? null,
			error: error ? String(error.value) : null
		}
	} catch {
		return {
			data: null,
			error: 'API unavailable'
		}
	}
}
