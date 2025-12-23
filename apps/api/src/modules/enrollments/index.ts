import { Elysia } from 'elysia'

import { EnrollmentModel } from './model'
import { EnrollmentService } from './service'

export const enrollmentsRoutes = new Elysia({ prefix: '/enrollments' })
	.use(EnrollmentModel)

	// Get user enrollments
	.get('/user/:userId', ({ params }) => EnrollmentService.getUserEnrollments(params.userId), {
		params: 'enrollment.params.userId'
	})

	// Enroll in course
	.post('/enroll', ({ body }) => EnrollmentService.enroll(body.course_id, body.user_id), {
		body: 'enrollment.body.enroll'
	})

	// Get enrollment status
	.get(
		'/status/:courseId/:userId',
		({ params }) => EnrollmentService.getEnrollment(Number(params.courseId), params.userId),
		{
			params: 'enrollment.params.status'
		}
	)

	// Update progress
	.patch(
		'/:id/progress',
		({ params, body }) => EnrollmentService.updateProgress(params.id, body.progress),
		{
			params: 'enrollment.params.id',
			body: 'enrollment.body.progress'
		}
	)
