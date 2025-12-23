import { api } from '@/lib/elysia/client'

export const getUserEnrollments = async (userId: string) =>
	await api.enrollments.user({ userId }).get()
