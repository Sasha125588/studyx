import { api } from '@/lib/elysia/client'

export const searchCourses = async (search?: string) =>
	await api.courses.search.get({
		query: { search }
	})
