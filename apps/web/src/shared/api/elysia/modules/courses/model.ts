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
	'course.query.with-details': t.Object({
		authorId: t.Optional(t.String()),
		userId: t.Optional(t.String()),
		category: t.Optional(t.String()),
		status: t.Optional(t.String()),
		search: t.Optional(t.String()),
		limit: t.Optional(t.Number()),
		offset: t.Optional(t.Number()),
		sort: t.Optional(t.String()),
		tab: t.Optional(t.String()), // 'all', 'my', 'new', 'recommended'
		myCoursesStatus: t.Optional(t.String()), // 'all', 'not_started', 'in_progress', 'completed'
		skill: t.Optional(t.String())
	}),
	'course.params.userId': t.Object({
		userId: t.String()
	}),
	'course.query.search': t.Object({
		search: t.Optional(t.String())
	})
})

export interface getAllWithDetailsRequest {
	userId?: string
	authorId?: string
	status?: string
	search?: string
	limit?: number
	offset?: number
	sort?: string
	tab?: string
	skill?: string
}
