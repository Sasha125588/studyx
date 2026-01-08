import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export class LessonProgressService {
	constructor(private supabase: SupabaseClient<Database>) {}
	/**
	 * Get user progress for a course
	 */
	async getCourseProgress(userId: string, courseId: number) {
		const { data, error } = await this.supabase
			.from('lesson_progress')
			.select(
				`
				*,
				lessons!inner (
					*,
					modules!inner (
						course_id
					)
				)
			`
			)
			.eq('user_id', userId)
			.eq('lessons.modules.course_id', courseId)

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get progress for a specific lesson
	 */
	async getLessonProgress(lessonId: number, userId: string) {
		const { data, error } = await this.supabase
			.from('lesson_progress')
			.select('*')
			.eq('lesson_id', lessonId)
			.eq('user_id', userId)
			.single()

		if (error && error.code !== 'PGRST116') throw new Error(error.message)
		return data
	}

	/**
	 * Mark lesson as started or completed
	 */
	async updateLessonProgress(lessonId: number, userId: string, completed: boolean) {
		// Check if progress record exists
		const { data: existing } = await this.supabase
			.from('lesson_progress')
			.select('id')
			.eq('lesson_id', lessonId)
			.eq('user_id', userId)
			.single()

		if (existing) {
			const { data, error } = await this.supabase
				.from('lesson_progress')
				.update({
					completed,
					completed_at: completed ? new Date().toISOString() : null
				})
				.eq('id', existing.id)
				.select()
				.single()

			if (error) throw new Error(error.message)
			return data
		}

		const { data, error } = await this.supabase
			.from('lesson_progress')
			.insert({
				lesson_id: lessonId,
				user_id: userId,
				completed,
				started_at: new Date().toISOString(),
				completed_at: completed ? new Date().toISOString() : null
			})
			.select()
			.single()

		if (error) throw new Error(error.message)
		return data
	}
}
