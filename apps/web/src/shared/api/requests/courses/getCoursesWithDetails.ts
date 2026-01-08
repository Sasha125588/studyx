import { api } from '@/lib/elysia/client'

export interface GetCoursesWithDetailsParams {
	userId: string
	authorId?: string
	category?: string
	status?: string
	search?: string
	limit?: number
	offset?: number
	sort?: string
	tab?: string
	myCoursesStatus?: string
	skill?: string
}

export const getCoursesWithDetails = async (params?: GetCoursesWithDetailsParams) =>
	await api.courses['with-details'].get({ query: params })
