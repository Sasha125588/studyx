import { api } from '@/lib/elysia/client'

export const getCourseSkills = async (courseId: number) =>
	await api.courses.id({ id: courseId }).skills.get()
