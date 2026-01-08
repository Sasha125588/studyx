import type { Database, EnrollmentStatus } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export class EnrollmentService {
	constructor(private supabase: SupabaseClient<Database>) {}
	/**
	 * Get user enrollments
	 */
	async getUserEnrollments(userId: string) {
		const { data, error } = await this.supabase
			.from('course_enrollments')
			.select(
				`
				*,
				courses (
					*,
					course_authors (
						*,
						user:user (*)
					)
				)
			`
			)
			.eq('user_id', userId)
			.order('enrolled_at', { ascending: false })

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Enroll user in course
	 */
	async enroll(courseId: number, userId: string) {
		// Check if already enrolled
		const { data: existing } = await this.supabase
			.from('course_enrollments')
			.select('id')
			.eq('course_id', courseId)
			.eq('user_id', userId)
			.single()

		if (existing) {
			throw new Error('User is already enrolled in this course')
		}

		const { data, error } = await this.supabase
			.from('course_enrollments')
			.insert({
				course_id: courseId,
				user_id: userId,
				status: 'enrolled',
				progress: 0,
				enrolled_at: new Date().toISOString()
			})
			.select()
			.single()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Update enrollment progress
	 */
	async updateProgress(enrollmentId: number, progress: number) {
		const updateData: {
			progress: number
			status?: EnrollmentStatus
			completed_at?: string
		} = { progress }

		if (progress >= 100) {
			updateData.status = 'completed'
			updateData.completed_at = new Date().toISOString()
		}

		const { data, error } = await this.supabase
			.from('course_enrollments')
			.update(updateData)
			.eq('id', enrollmentId)
			.select()
			.single()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get enrollment by course and user
	 */
	async getEnrollment(courseId: number, userId: string) {
		const { data, error } = await this.supabase
			.from('course_enrollments')
			.select('*')
			.eq('course_id', courseId)
			.eq('user_id', userId)
			.single()

		if (error && error.code !== 'PGRST116') throw new Error(error.message)
		return data
	}
}
