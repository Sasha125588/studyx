import { api } from '@/lib/elysia/client'

export const getCoursesBySkill = async (skillId: number) =>
	await api.skills({ id: skillId }).courses.get()
