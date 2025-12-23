import { api } from '@/lib/elysia/client'

export const enrollInCourse = async (courseId: number, userId: string) =>
	await api.enrollments.enroll.post({
		course_id: courseId,
		user_id: userId
	})
