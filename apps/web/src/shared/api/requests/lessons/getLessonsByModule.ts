import { api } from '@/lib/elysia/client'

export const getLessonsByModule = async (moduleId: number) =>
	await api.lessons.module({ id: moduleId }).get()
