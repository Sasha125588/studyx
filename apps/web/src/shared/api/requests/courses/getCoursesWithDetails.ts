'use cache'

import { cacheLife } from 'next/cache'

import { api } from '@/lib/elysia/client'

export const getCoursesWithDetails = async () => {
	cacheLife('minutes')

	try {
		const { data, error } = await api.courses['with-details'].get()

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
