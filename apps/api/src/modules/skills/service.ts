import { supabase } from '../../lib/supabase'

export abstract class SkillService {
	static async getAll() {
		const { data, error } = await supabase
			.from('skills')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw new Error(error.message)
		return data
	}

	static async getCoursesBySkill(skillId: number) {
		const { data, error } = await supabase
			.from('course_skills')
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
			.eq('skill_id', skillId)
			.order('order_index', { ascending: true })

		if (error) throw new Error(error.message)
		return data
	}
}
