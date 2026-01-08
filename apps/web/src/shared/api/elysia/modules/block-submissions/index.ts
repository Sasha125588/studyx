import { Elysia, t } from 'elysia'

import { BlockSubmissionModel } from './model'
import { BlockSubmissionService } from './service'

export const blockSubmissionsRoutes = new Elysia({ prefix: '/block-submissions' })
	.use(BlockSubmissionModel)
	.derive(({ headers }) => ({
		userId: headers['x-user-id'] as string
	}))
	.decorate('blockSubmissionService', null as unknown as BlockSubmissionService)

	// Створити або оновити submission
	.post(
		'/',
		({ body, userId, blockSubmissionService }) =>
			blockSubmissionService.upsert({
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
	.get('/:id', ({ params, blockSubmissionService }) => blockSubmissionService.getById(params.id), {
		params: 'blockSubmission.params.id'
	})

	// Получить submissions пользователя для урока
	.get(
		'/lesson/:lessonId/my',
		({ params, userId, blockSubmissionService }) =>
			blockSubmissionService.getByLessonAndUser(params.lessonId, userId),
		{
			params: 'blockSubmission.params.lessonId'
		}
	)

	// Получить все submissions для урока (для преподавателя)
	.get(
		'/lesson/:lessonId/all',
		({ params, blockSubmissionService }) => blockSubmissionService.getByLesson(params.lessonId),
		{
			params: 'blockSubmission.params.lessonId'
		}
	)

	// Получить непроверенные submissions
	.get(
		'/ungraded',
		({ query, blockSubmissionService }) => blockSubmissionService.getUngraded(query.limit),
		{
			query: t.Object({
				limit: t.Optional(t.Numeric())
			})
		}
	)

	// Оценить submission (для преподавателя)
	.patch(
		'/:id/grade',
		({ params, body, userId, blockSubmissionService }) =>
			blockSubmissionService.grade(params.id, {
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
		({ params, blockSubmissionService }) => blockSubmissionService.getLessonStats(params.lessonId),
		{
			params: 'blockSubmission.params.lessonId'
		}
	)

	// Удалить submission
	.delete(
		'/:id',
		({ params, blockSubmissionService }) => blockSubmissionService.delete(params.id),
		{
			params: 'blockSubmission.params.id'
		}
	)
