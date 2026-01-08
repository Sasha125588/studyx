import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export class ModuleService {
	constructor(private supabase: SupabaseClient<Database>) {}
	/**
	 * Get modules for a course
	 */
	async getByCourseId(courseId: number) {
		const { data, error } = await this.supabase
			.from('modules')
			.select(
				`
				*,
				lessons (
					*,
					lesson_attachments (*)
				)
			`
			)
			.eq('course_id', courseId)
			.order('id', { ascending: true })
			.order('order_index', { referencedTable: 'lessons', ascending: true })

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get a single module with lessons
	 */
	async getById(moduleId: number) {
		const { data, error } = await this.supabase
			.from('modules')
			.select(
				`
				*,
				lessons (
					*,
					lesson_attachments (*)
				)
			`
			)
			.eq('id', moduleId)
			.order('order_index', { referencedTable: 'lessons', ascending: true })
			.single()

		if (error) throw new Error(error.message)
		return data
	}
}
