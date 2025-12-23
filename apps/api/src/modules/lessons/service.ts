import { supabase } from '../../lib/supabase'

export abstract class LessonService {
	/**
	 * Get a single lesson with attachments
	 */
	static async getById(lessonId: number) {
		const { data, error } = await supabase
			.from('lessons')
			.select(
				`
				*,
				lesson_attachments (*)
			`
			)
			.eq('id', lessonId)
			.order('order_index', { referencedTable: 'lesson_attachments', ascending: true })
			.single()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get lessons by module
	 */
	static async getByModuleId(moduleId: number) {
		const { data, error } = await supabase
			.from('lessons')
			.select(
				`
				*,
				lesson_attachments (*)
			`
			)
			.eq('module_id', moduleId)
			.order('order_index', { ascending: true })
			.order('order_index', { referencedTable: 'lesson_attachments', ascending: true })

		if (error) throw new Error(error.message)
		return data
	}
}
