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

	// Search courses
	.get('/search', ({ query }) => CourseService.search(query.search ?? ''), {
		query: 'course.query.search'
	})

	// Get course skills
	.get('/id/:id/skills', ({ params }) => CourseService.getCourseSkills(params.id), {
		params: 'course.params.id'
	})

	// Get course modules
	.get('/id/:id/modules', ({ params }) => CourseService.getCourseModules(params.id), {
		params: 'course.params.id'
	})

	// Get course by slug
	.get('/slug/:slug', ({ params }) => CourseService.getBySlug(params.slug), {
		params: 'course.params.slug'
	})

	.get('/author/:userId', ({ params }) => CourseService.getCoursesByUserId(params.userId), {
		params: 'course.params.userId'
	})
