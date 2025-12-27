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
	 * Get a single lesson by slug with full context (module, course, siblings)
	 */
	static async getBySlug(courseSlug: string, lessonSlug: string) {
		// First, get the course by slug to get course_id
		const { data: course, error: courseError } = await supabase
			.from('courses')
			.select('id, title, slug')
			.eq('slug', courseSlug)
			.maybeSingle()

		if (courseError) throw new Error(courseError.message)
		if (!course) return null

		// Get the lesson with its module and attachments
		const { data: lesson, error: lessonError } = await supabase
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
		const { data: moduleLessons, error: moduleLessonsError } = await supabase
			.from('lessons')
			.select('id, title, slug, type, order_index')
			.eq('module_id', lesson.module_id)
			.order('order_index', { ascending: true })

		if (moduleLessonsError) throw new Error(moduleLessonsError.message)

		// Get all modules with their lessons for full navigation
		const { data: allModules, error: allModulesError } = await supabase
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
