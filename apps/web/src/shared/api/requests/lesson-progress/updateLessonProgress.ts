import { api } from '@/lib/elysia/client'

export const updateLessonProgress = async (lessonId: number, userId: string, completed: boolean) =>
	await api['lesson-progress'].update.post({
		lesson_id: lessonId,
		user_id: userId,
		completed
	})
