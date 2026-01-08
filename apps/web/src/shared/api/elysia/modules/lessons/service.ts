import type { Database, Json } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export class LessonService {
	constructor(private supabase: SupabaseClient<Database>) {}
	/**
	 * Get a single lesson with attachments
	 */
	async getById(lessonId: number) {
		const { data, error } = await this.supabase
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
	 * Get a single lesson by slug with full context (module, course, siblings)
	 */
	async getBySlug(courseSlug: string, lessonSlug: string) {
		// First, get the course by slug to get course_id
		const { data: course, error: courseError } = await this.supabase
			.from('courses')
			.select('id, title, slug')
			.eq('slug', courseSlug)
			.maybeSingle()

		if (courseError) throw new Error(courseError.message)
		if (!course) return null

		// Get the lesson with its module and attachments
		const { data: lesson, error: lessonError } = await this.supabase
			.from('lessons')
			.select(
				`
				*,
				lesson_attachments (*),
				modules!inner (
					id,
					name,
					description,
					order_index,
					course_id
				)
			`
			)
			.eq('slug', lessonSlug)
			.eq('modules.course_id', course.id)
			.order('order_index', { referencedTable: 'lesson_attachments', ascending: true })
			.maybeSingle()

		if (lessonError) throw new Error(lessonError.message)
		if (!lesson) return null

		// Get all lessons from the same module for sidebar navigation
		const { data: moduleLessons, error: moduleLessonsError } = await this.supabase
			.from('lessons')
			.select('id, title, slug, type, order_index')
			.eq('module_id', lesson.module_id)
			.order('order_index', { ascending: true })

		if (moduleLessonsError) throw new Error(moduleLessonsError.message)

		// Get all modules with their lessons for full navigation
		const { data: allModules, error: allModulesError } = await this.supabase
			.from('modules')
			.select(
				`
				id,
				name,
				order_index,
				lessons (
					id,
					title,
					slug,
					type,
					order_index
				)
			`
			)
			.eq('course_id', course.id)
			.order('order_index', { ascending: true })
			.order('order_index', { referencedTable: 'lessons', ascending: true })

		if (allModulesError) throw new Error(allModulesError.message)

		// Find current lesson index across all lessons
		const allLessons = allModules.flatMap(m => m.lessons)
		const currentIndex = allLessons.findIndex(l => l.id === lesson.id)

		const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
		const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

		return {
			lesson: {
				...lesson,
				attachments: lesson.lesson_attachments
			},
			module: lesson.modules,
			course,
			moduleLessons,
			allModules,
			navigation: {
				previous: previousLesson,
				next: nextLesson,
				currentIndex: currentIndex + 1,
				totalLessons: allLessons.length
			}
		}
	}

	/**
	 * Get lessons by module
	 */
	async getByModuleId(moduleId: number) {
		const { data, error } = await this.supabase
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

	/**
	 * Get all lessons (for admin)
	 */
	async getAll() {
		const { data, error } = await this.supabase
			.from('lessons')
			.select(
				`
				*,
				modules (
					id,
					name,
					course_id,
					courses (
						id,
						title,
						slug
					)
				)
			`
			)
			.order('created_at', { ascending: false })

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Create a new lesson
	 */
	async create(data: {
		title: string
		slug: string
		type: 'lecture' | 'practical' | 'test'
		moduleId: number
		blocks: Json
		orderIndex?: number
	}) {
		// Get the max order_index for the module
		const { data: existingLessons } = await this.supabase
			.from('lessons')
			.select('order_index')
			.eq('module_id', data.moduleId)
			.order('order_index', { ascending: false })
			.limit(1)

		const maxOrderIndex = existingLessons?.[0]?.order_index ?? -1
		const orderIndex = data.orderIndex ?? maxOrderIndex + 1

		const { data: lesson, error } = await this.supabase
			.from('lessons')
			.insert({
				title: data.title,
				slug: data.slug,
				type: data.type,
				module_id: data.moduleId,
				blocks: data.blocks,
				order_index: orderIndex
			})
			.select()
			.single()

		if (error) throw new Error(error.message)
		return lesson
	}

	/**
	 * Update a lesson
	 */
	async update(
		lessonId: number,
		data: {
			title?: string
			slug?: string
			type?: 'lecture' | 'practical' | 'test'
			moduleId?: number
			blocks?: Json
			orderIndex?: number
		}
	) {
		const updateData: Record<string, unknown> = {}

		if (data.title !== undefined) updateData.title = data.title
		if (data.slug !== undefined) updateData.slug = data.slug
		if (data.type !== undefined) updateData.type = data.type
		if (data.moduleId !== undefined) updateData.module_id = data.moduleId
		if (data.blocks !== undefined) updateData.blocks = data.blocks
		if (data.orderIndex !== undefined) updateData.order_index = data.orderIndex

		const { data: lesson, error } = await this.supabase
			.from('lessons')
			.update(updateData)
			.eq('id', lessonId)
			.select()
			.single()

		if (error) throw new Error(error.message)
		return lesson
	}

	/**
	 * Delete a lesson
	 */
	async delete(lessonId: number) {
		const { error } = await this.supabase.from('lessons').delete().eq('id', lessonId)

		if (error) throw new Error(error.message)
		return { success: true }
	}
}
