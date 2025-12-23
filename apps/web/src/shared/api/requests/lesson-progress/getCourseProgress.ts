import { api } from '@/lib/elysia/client'

export const getCourseProgress = async (courseId: number, userId: string) =>
	await api['lesson-progress']
		.course({ courseId: String(courseId) })
		.user({ userId })
		.get()
