import { Elysia } from 'elysia'

import { LessonModel } from './model'
import { LessonService } from './service'

export const lessonsRoutes = new Elysia({ prefix: '/lessons' })
	.use(LessonModel)

	// Get lesson by id
	.get('/:id', ({ params }) => LessonService.getById(params.id), {
		params: 'lesson.params.id'
	})

	// Get lessons by module
	.get('/module/:id', ({ params }) => LessonService.getByModuleId(params.id), {
		params: 'lesson.params.id'
	})
