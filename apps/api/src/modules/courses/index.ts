import { Elysia } from 'elysia'

import { CourseModel } from './model'
import { CourseService } from './service'

export const coursesRoutes = new Elysia({ prefix: '/courses' })
	.use(CourseModel)

	// Get all courses (basic)
	.get('/', () => CourseService.getAll())

	.get(
		'/continue-learning/:userId',
		({ params }) => CourseService.getContinueLearningCourses(params.userId),
		{
			params: 'course.params.userId'
		}
	)

	// Get all courses with details
	.get('/with-details', () => CourseService.getAllWithDetails())

	// Search courses
	.get('/search', ({ query }) => CourseService.search(query.search ?? '', query.edu_program), {
		query: 'course.query.search'
	})

	// Get course by id
	.get('/id/:id', ({ params }) => CourseService.getById(params.id), {
		params: 'course.params.id'
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
