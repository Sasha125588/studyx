import { Elysia, t } from 'elysia'

import { LessonModel } from './model'
import { LessonService } from './service'

export const lessonsRoutes = new Elysia({ prefix: '/lessons' })
	.use(LessonModel)

	// Get all lessons (for admin)
	.get('/', () => LessonService.getAll())

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

	// Create a new lesson
	.post(
		'/',
		({ body }) =>
			LessonService.create({
				title: body.title,
				slug: body.slug,
				type: body.type,
				moduleId: body.moduleId,
				blocks: body.blocks,
				orderIndex: body.orderIndex
			}),
		{
			body: t.Object({
				title: t.String(),
				slug: t.String(),
				type: t.Union([t.Literal('lecture'), t.Literal('practical'), t.Literal('test')]),
				moduleId: t.Number(),
				blocks: t.Array(t.Any()),
				orderIndex: t.Optional(t.Number())
			})
		}
	)

	// Update a lesson
	.put(
		'/:id',
		({ params, body }) =>
			LessonService.update(params.id, {
				title: body.title,
				slug: body.slug,
				type: body.type,
				moduleId: body.moduleId,
				blocks: body.blocks,
				orderIndex: body.orderIndex
			}),
		{
			params: 'lesson.params.id',
			body: t.Object({
				title: t.Optional(t.String()),
				slug: t.Optional(t.String()),
				type: t.Optional(
					t.Union([t.Literal('lecture'), t.Literal('practical'), t.Literal('test')])
				),
				moduleId: t.Optional(t.Number()),
				blocks: t.Optional(t.Array(t.Any())),
				orderIndex: t.Optional(t.Number())
			})
		}
	)

	// Delete a lesson
	.delete('/:id', ({ params }) => LessonService.delete(params.id), {
		params: 'lesson.params.id'
	})
