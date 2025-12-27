import { Elysia, t } from 'elysia'

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

	// Get lesson by course slug and lesson slug with full context
	.get('/by-slug', ({ query }) => LessonService.getBySlug(query.courseSlug, query.lessonSlug), {
		query: t.Object({
			courseSlug: t.String(),
			lessonSlug: t.String()
		})
	})
