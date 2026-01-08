import { Elysia } from 'elysia'

import { EnrollmentModel } from './model'
import { EnrollmentService } from './service'

export const enrollmentsRoutes = new Elysia({ prefix: '/enrollments' })
	.use(EnrollmentModel)
	.decorate('enrollmentService', null as unknown as EnrollmentService)

	// Get user enrollments
	.get(
		'/user/:userId',
		({ params, enrollmentService }) => enrollmentService.getUserEnrollments(params.userId),
		{
			params: 'enrollment.params.userId'
		}
	)

	// Enroll in course
	.post(
		'/enroll',
		({ body, enrollmentService }) => enrollmentService.enroll(body.course_id, body.user_id),
		{
			body: 'enrollment.body.enroll'
		}
	)

	// Get enrollment status
	.get(
		'/status/:courseId/:userId',
		({ params, enrollmentService }) =>
			enrollmentService.getEnrollment(Number(params.courseId), params.userId),
		{
			params: 'enrollment.params.status'
		}
	)

	// Update progress
	.patch(
		'/:id/progress',
		({ params, body, enrollmentService }) =>
			enrollmentService.updateProgress(params.id, body.progress),
		{
			params: 'enrollment.params.id',
			body: 'enrollment.body.progress'
		}
	)
