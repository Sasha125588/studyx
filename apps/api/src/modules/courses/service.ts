import { supabase } from '../../lib/supabase'

export abstract class CourseService {
	static async getAll() {
		const { data, error } = await supabase.from('courses').select('*')

		if (error) throw new Error(error.message)

		return data
	}
	/**
	 * Get all courses with full details (authors, modules, lessons)
	 */
	static async getAllWithDetails() {
		const { data, error } = await supabase
			.from('courses')
			.select(
				`
				*,
				course_authors (
					user (*)
				),
				modules (
					*,
					lessons (*)
				),
				course_skills (
					skills (*)
				)
			`
			)
			.order('order_index', { referencedTable: 'modules', ascending: true })
			.order('order_index', { referencedTable: 'modules.lessons', ascending: true })
			.order('order_index', { referencedTable: 'course_skills', ascending: true })

		if (error) throw new Error(error.message)

		const formattedData = data.map(course => ({
			...course,
			authors: course.course_authors.map(cs => cs.user),
			skills: course.course_skills.map(cs => cs.skills)
		}))

		return formattedData
	}

	static async getContinueLearningCourses(userId: string) {
		const { data, error } = await supabase
			.from('course_enrollments')
			.select(
				`
      progress,
      status,
      courses (
        id,
        title,
        slug,
        description,
        modules (
          id,
          name,
          lessons (
            id,
            title,
            order_index,
            lesson_progress (
              completed
            )
          )
        )
      )
    `
			)
			.eq('user_id', userId)
			.in('status', ['enrolled', 'in_progress'])
			.order('order_index', { referencedTable: 'courses.modules', ascending: true })
			.order('enrolled_at', { ascending: false })

		if (error) throw new Error(error.message)
		if (!data) return []

		return data.map(enrollment => {
			const course = enrollment.courses!
			let nextLesson = null

			for (const module of course.modules) {
				const sortedLessons = module.lessons.sort(
					(a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
				)

				for (let i = 0; i < sortedLessons.length; i++) {
					const lesson = sortedLessons[i]
					const isCompleted = lesson.lesson_progress?.[0]?.completed

					if (!isCompleted) {
						nextLesson = {
							id: lesson.id,
							title: lesson.title,
							moduleName: module.name,
							number: i + 1,
							totalLessons: module.lessons.length
						}
						break
					}
				}

				if (nextLesson) break
			}

			return {
				id: course.id,
				title: course.title,
				slug: course.slug,
				description: course?.description,
				progress: enrollment.progress ?? 0,
				status: enrollment.status,
				nextLesson
			}
		})
	}

	/**
	 * Get a single course by slug with full details
	 */
	static async getBySlug(slug: string) {
		// TODO: додати lesson_attachments (*)
		const { data, error } = await supabase
			.from('courses')
			.select(
				`
				*,
				modules (
					*,
					lessons (*)
				),
				course_authors (
					user (*)
				),
				course_skills (
					skills (*)
				)
			`
			)
			.eq('slug', slug)
			.order('order_index', { referencedTable: 'modules', ascending: true })
			.order('order_index', { referencedTable: 'modules.lessons', ascending: true })
			.order('order_index', { referencedTable: 'course_skills', ascending: true })
			.single()

		if (error) throw new Error(error.message)

		return {
			...data,
			authors: data.course_authors.map(ca => ca.user),
			skills: data.course_skills.map(cs => cs.skills)
		}
	}

	/**
	 * Search courses by title or description
	 */
	static async search(query: string, eduProgram?: string) {
		let request = supabase
			.from('courses')
			.select('*')
			.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
			.order('id', { ascending: true })

		if (eduProgram) {
			request = request.eq('edu_program', eduProgram)
		}

		const { data, error } = await request

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get skills for a course
	 */
	static async getCourseSkills(courseId: number) {
		const { data, error } = await supabase
			.from('course_skills')
			.select(
				`
				*,
				skills (*)
			`
			)
			.eq('course_id', courseId)
			.order('order_index', { ascending: true })

		if (error) throw new Error(error.message)
		return data
	}

	/**
	 * Get course modules
	 */
	static async getCourseModules(courseId: number) {
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
}
