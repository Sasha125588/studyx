import { supabase } from '../../lib/supabase'

export abstract class SkillService {
	/**
	 * Get all skills
	 */
	static async getAll() {
		const { data, error } = await supabase
			.from('skills')
			.select('*')
			.order('name', { ascending: true })

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get skill by slug
	 */
	static async getBySlug(slug: string) {
		const { data, error } = await supabase.from('skills').select('*').eq('slug', slug).single()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get skill by id
	 */
	static async getById(skillId: number) {
		const { data, error } = await supabase.from('skills').select('*').eq('id', skillId).single()

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get courses by skill
	 */
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
