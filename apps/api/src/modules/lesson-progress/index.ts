import { Elysia } from 'elysia'

import { LessonProgressModel } from './model'
import { LessonProgressService } from './service'

export const lessonProgressRoutes = new Elysia({ prefix: '/lesson-progress' })
	.use(LessonProgressModel)

	// Get course progress for user
	.get(
		'/course/:courseId/user/:userId',
		({ params }) => LessonProgressService.getCourseProgress(params.userId, Number(params.courseId)),
		{
			params: 'lessonProgress.params.course'
		}
	)

	// Update lesson progress
	.post(
		'/update',
		({ body }) =>
			LessonProgressService.updateLessonProgress(body.lesson_id, body.user_id, body.completed),
		{
			body: 'lessonProgress.body.update'
		}
	)
