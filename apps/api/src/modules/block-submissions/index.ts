import { Elysia, t } from 'elysia'

import { BlockSubmissionModel } from './model'
import { BlockSubmissionService } from './service'

export const blockSubmissionsRoutes = new Elysia({ prefix: '/block-submissions' })
	.use(BlockSubmissionModel)
	.derive(({ headers }) => ({
		userId: headers['x-user-id'] as string
	}))

	// Створити або оновити submission
	.post(
		'/',
		({ body, userId }) =>
			BlockSubmissionService.upsert({
				lessonId: body.lessonId,
				blockId: body.blockId,
				userId,
				submissionType: body.submissionType,
				content: body.content,
				maxScore: body.maxScore
			}),
		{
			body: 'blockSubmission.create'
		}
	)

	// Получить submission по id
	.get('/:id', ({ params }) => BlockSubmissionService.getById(params.id), {
		params: 'blockSubmission.params.id'
	})

	// Получить submissions пользователя для урока
	.get(
		'/lesson/:lessonId/my',
		({ params, userId }) => BlockSubmissionService.getByLessonAndUser(params.lessonId, userId),
		{
			params: 'blockSubmission.params.lessonId'
		}
	)

	// Получить все submissions для урока (для преподавателя)
	.get(
		'/lesson/:lessonId/all',
		({ params }) => BlockSubmissionService.getByLesson(params.lessonId),
		{
			params: 'blockSubmission.params.lessonId'
		}
	)

	// Получить непроверенные submissions
	.get('/ungraded', ({ query }) => BlockSubmissionService.getUngraded(query.limit), {
		query: t.Object({
			limit: t.Optional(t.Numeric())
		})
	})

	// Оценить submission (для преподавателя)
	.patch(
		'/:id/grade',
		({ params, body, userId }) =>
			BlockSubmissionService.grade(params.id, {
				score: body.score,
				feedback: body.feedback,
				gradedBy: userId
			}),
		{
			params: 'blockSubmission.params.id',
			body: 'blockSubmission.grade'
		}
	)

	// Статистика по уроку
	.get(
		'/lesson/:lessonId/stats',
		({ params }) => BlockSubmissionService.getLessonStats(params.lessonId),
		{
			params: 'blockSubmission.params.lessonId'
		}
	)

	// Удалить submission
	.delete('/:id', ({ params }) => BlockSubmissionService.delete(params.id), {
		params: 'blockSubmission.params.id'
	})
