import { Elysia, t } from 'elysia'

const LessonProgress = t.Object({
	id: t.Number(),
	lesson_id: t.Nullable(t.Number()),
	user_id: t.Nullable(t.String()),
	completed: t.Nullable(t.Boolean()),
	started_at: t.Nullable(t.String()),
	completed_at: t.Nullable(t.String())
})

export const LessonProgressModel = new Elysia({ name: 'Model.LessonProgress' }).model({
	'lessonProgress.base': LessonProgress,
	'lessonProgress.params.course': t.Object({
		courseId: t.String(),
		userId: t.String()
	}),
	'lessonProgress.body.update': t.Object({
		lesson_id: t.Number(),
		user_id: t.String(),
		completed: t.Boolean()
	})
})

export type LessonProgressType = typeof LessonProgress.static
