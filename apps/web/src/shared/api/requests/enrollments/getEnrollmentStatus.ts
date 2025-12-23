import { api } from '@/lib/elysia/client'

export const getEnrollmentStatus = async (courseId: number, userId: string) =>
	await api.enrollments.status({ courseId: courseId })({ userId }).get()
