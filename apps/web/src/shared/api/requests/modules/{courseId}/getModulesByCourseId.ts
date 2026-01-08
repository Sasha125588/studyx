import { api } from '@/lib/elysia/client'

export const getModulesByCourseId = async (courseId: number) =>
	await api.modules.course({ courseId }).get()
