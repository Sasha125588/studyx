'use cache'

import { cacheLife } from 'next/cache'

import { api } from '@/lib/elysia/client'

export const getCourses = async () => {
	cacheLife('minutes')

	try {
		const { data, error } = await api.courses.get()

		return {
			data: data ?? [],
			error: error ? String(error.value) : null
		}
	} catch {
		return {
			data: [],
			error: 'API unavailable'
		}
	}
}
