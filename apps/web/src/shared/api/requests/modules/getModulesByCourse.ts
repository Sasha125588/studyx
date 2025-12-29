'use client'

import { api } from '@/lib/elysia/client'

export const getModulesByCourse = async (courseId: number) =>
	await api.modules.course({ courseId }).get()
