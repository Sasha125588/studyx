import { api } from '@/lib/elysia/client'

export const getContinueLearningCourses = async (userId: string) =>
	await api.courses['continue-learning']({ userId }).get()
