import { Elysia, t } from 'elysia'

const Enrollment = t.Object({
	id: t.Number(),
	course_id: t.Nullable(t.Number()),
	user_id: t.Nullable(t.String()),
	status: t.Nullable(t.String()),
	progress: t.Nullable(t.Number()),
	enrolled_at: t.Nullable(t.String()),
	completed_at: t.Nullable(t.String())
})

export const EnrollmentModel = new Elysia({ name: 'Model.Enrollment' }).model({
	'enrollment.base': Enrollment,
	'enrollment.params.id': t.Object({
		id: t.Numeric()
	}),
	'enrollment.params.userId': t.Object({
		userId: t.String()
	}),
	'enrollment.params.status': t.Object({
		courseId: t.String(),
		userId: t.String()
	}),
	'enrollment.body.enroll': t.Object({
		course_id: t.Number(),
		user_id: t.String()
	}),
	'enrollment.body.progress': t.Object({
		progress: t.Number({ minimum: 0, maximum: 100 })
	})
})
