import { supabase } from '../../lib/supabase'

export abstract class ModuleService {
	/**
	 * Get modules for a course
	 */
	static async getByCourseId(courseId: number) {
		const { data, error } = await supabase
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
	static async getById(moduleId: number) {
		const { data, error } = await supabase
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
