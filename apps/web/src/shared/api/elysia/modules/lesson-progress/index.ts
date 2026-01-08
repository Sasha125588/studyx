import { Elysia } from 'elysia'

import { LessonProgressModel } from './model'
import { LessonProgressService } from './service'

export const lessonProgressRoutes = new Elysia({ prefix: '/lesson-progress' })
	.use(LessonProgressModel)
	.decorate('lessonProgressService', null as unknown as LessonProgressService)

	// Get course progress for user
	.get(
		'/course/:courseId/user/:userId',
		({ params, lessonProgressService }) =>
			lessonProgressService.getCourseProgress(params.userId, Number(params.courseId)),
		{
			params: 'lessonProgress.params.course'
		}
	)

	// Update lesson progress
	.post(
		'/update',
		({ body, lessonProgressService }) =>
			lessonProgressService.updateLessonProgress(body.lesson_id, body.user_id, body.completed),
		{
			body: 'lessonProgress.body.update'
		}
	)
