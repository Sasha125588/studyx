import { Elysia } from 'elysia'

import { CourseModel } from './model'
import { CourseService } from './service'

export const coursesRoutes = new Elysia({ prefix: '/courses' })
	.use(CourseModel)
	.decorate('courseService', null as unknown as CourseService)

	.get('/', ({ courseService }) => courseService.getAll())

	.get(
		'/continue-learning/:userId',
		({ params, courseService }) => courseService.getContinueLearningCourses(params.userId),
		{
			params: 'course.params.userId'
		}
	)

	.get('/with-details', ({ query, courseService }) => courseService.getAllWithDetails(query), {
		query: 'course.query.with-details'
	})

	.get('/search', ({ query, courseService }) => courseService.search(query.search ?? ''), {
		query: 'course.query.search'
	})

	.get('/slug/:slug', ({ params, courseService }) => courseService.getBySlug(params.slug), {
		params: 'course.params.slug'
	})

	.get(
		'/author/:userId',
		({ params, courseService }) => courseService.getCoursesByAuthor(params.userId),
		{
			params: 'course.params.userId'
		}
	)
