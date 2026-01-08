import { Elysia, t } from 'elysia'

const Module = t.Object({
	id: t.Number(),
	course_id: t.Nullable(t.Number()),
	name: t.Nullable(t.String()),
	description: t.Nullable(t.String()),
	created_at: t.String()
})

export const ModuleModel = new Elysia({ name: 'Model.Module' }).model({
	'module.base': Module,
	'module.params.id': t.Object({
		id: t.Numeric()
	}),
	'module.params.courseId': t.Object({
		courseId: t.Numeric()
	})
})
