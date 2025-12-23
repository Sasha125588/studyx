import { api } from '@/lib/elysia/client'

export const updateEnrollmentProgress = async (enrollmentId: number, progress: number) =>
	await api.enrollments({ id: enrollmentId }).progress.patch({ progress })
