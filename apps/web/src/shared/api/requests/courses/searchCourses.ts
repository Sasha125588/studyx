import { api } from '@/lib/elysia/client'

export const searchCourses = async (search?: string, eduProgram?: string) =>
	await api.courses.search.get({
		query: { search, edu_program: eduProgram }
	})
