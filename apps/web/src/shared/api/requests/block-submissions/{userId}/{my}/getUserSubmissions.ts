import { api } from '@/lib/elysia/client'

export const getMySubmissions = async (lessonId: number) =>
	await api['block-submissions'].lesson({ lessonId }).my.get()
