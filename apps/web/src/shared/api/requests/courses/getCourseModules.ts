'use server'

import { api } from '@/lib/elysia/client'

export const getCourseModules = async (courseId: number) =>
	await api.courses.id({ id: courseId }).modules.get()
