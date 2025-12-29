import { Elysia } from 'elysia'

import { CourseModel } from './model'
import { CourseService } from './service'

export const coursesRoutes = new Elysia({ prefix: '/courses' })
	.use(CourseModel)

	.get('/', () => CourseService.getAll())

	.get(
		'/continue-learning/:userId',
		({ params }) => CourseService.getContinueLearningCourses(params.userId),
		{
			params: 'course.params.userId'
		}
	)

	.get('/with-details', () => CourseService.getAllWithDetails())

	.get('/search', ({ query }) => CourseService.search(query.search ?? ''), {
		query: 'course.query.search'
	})

	.get('/slug/:slug', ({ params }) => CourseService.getBySlug(params.slug), {
		params: 'course.params.slug'
	})

	.get('/author/:userId', ({ params }) => CourseService.getCoursesByAuthor(params.userId), {
		params: 'course.params.userId'
	})
