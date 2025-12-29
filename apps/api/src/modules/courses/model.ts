import { Elysia, t } from 'elysia'

// const CourseBase = t.Object({
// 	id: t.Number(),
// 	title: t.Nullable(t.String()),
// 	description: t.Nullable(t.String()),
// 	slug: t.Nullable(t.String()),
// 	edu_program: t.Nullable(t.String()),
// 	created_at: t.Nullable(t.String())
// })

// const CourseAuthor = t.Object({
// 	id: t.Number(),
// 	course_id: t.Nullable(t.Number()),
// 	user_id: t.Nullable(t.String()),
// 	author_name: t.Nullable(t.String()),
// 	created_at: t.String(),
// 	user: t.Nullable(
// 		t.Object({
// 			id: t.String(),
// 			name: t.String(),
// 			email: t.String(),
// 			image: t.Nullable(t.String())
// 		})
// 	)
// })

export const CourseModel = new Elysia({ name: 'Model.Course' }).model({
	'course.params.slug': t.Object({
		slug: t.String()
	}),
	'course.params.id': t.Object({
		id: t.Numeric()
	}),
	'course.params.userId': t.Object({
		userId: t.String()
	}),
	'course.query.search': t.Object({
		search: t.Optional(t.String())
	})
})
