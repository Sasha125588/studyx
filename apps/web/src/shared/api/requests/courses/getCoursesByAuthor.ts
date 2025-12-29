'use server'

import { api } from '@/lib/elysia/client'

export const getCoursesByAuthor = async (userId: string) =>
	await api.courses.author({ userId }).get()
