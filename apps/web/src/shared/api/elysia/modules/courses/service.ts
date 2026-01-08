import type { Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { status } from 'elysia'

import type { getAllWithDetailsRequest } from './model'

export class CourseService {
	constructor(private supabase: SupabaseClient<Database>) {}

	async getAll() {
		const { data, error } = await this.supabase.from('courses').select('*')

		if (error?.code === '404') throw status('Not Found')

		if (error) throw new Error(error.message)

		return data
	}

	async getAllWithDetails(params: getAllWithDetailsRequest) {
		const { tab } = params

		if (tab === 'all_courses' || !tab) {
			return this.getAllCoursesFromSystem(params)
		}

		return this.getUserEnrolledCourses(params)
	}

	async getContinueLearningCourses(userId: string) {
		const { data, error } = await this.supabase
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

			for (const module_ of course.modules) {
				const sortedLessons = module_.lessons.sort(
					(a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
				)

				for (let i = 0; i < sortedLessons.length; i++) {
					const lesson = sortedLessons[i]
					const isCompleted = lesson.lesson_progress?.[0]?.completed

					if (!isCompleted) {
						nextLesson = {
							id: lesson.id,
							title: lesson.title,
							moduleName: module_.name,
							number: i + 1,
							totalLessons: module_.lessons.length
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

	async getBySlug(slug: string) {
		// TODO: додати lesson_attachments (*)
		const { data, error } = await this.supabase
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

		if (error?.details === 'The result contains 0 rows') return status('Not Found', error)

		if (error) throw new Error(error.message)

		return {
			...data,
			authors: data.course_authors.map(ca => ca.user),
			skills: data.course_skills.map(cs => cs.skills)
		}
	}

	async getCoursesByAuthor(userId: string) {
		const { data, error } = await this.supabase
			.from('course_authors')
			.select(
				`
				*,
				courses(*)
				`
			)
			.eq('user_id', userId)

		if (error) throw new Error(error.message)

		return data
	}

	async search(query: string) {
		const request = this.supabase
			.from('courses')
			.select('*')
			.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
			.order('created_at', { ascending: false })

		const { data, error } = await request

		if (error) throw new Error(error.message)
		return data
	}

	private async getAllCoursesFromSystem({
		authorId,
		userId,
		search,
		limit = 10,
		offset = 0,
		sort,
		skill,
		status
	}: getAllWithDetailsRequest) {
		let query = this.supabase.from('courses').select(
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
				),
				course_enrollments!left (
					progress,
					status,
					enrolled_at,
					user_id
				)
			`
		)

		// Поиск по названию
		if (search) {
			query = query.ilike('title', `%${search}%`)
		}

		// НЕ фильтруем по статусу на уровне БД - сделаем постфильтрацию

		// Сортировка
		switch (sort) {
			case 'date_desc':
				query = query.order('created_at', { ascending: false })
				break
			case 'date_asc':
				query = query.order('created_at', { ascending: true })
				break
			case 'title_asc':
				query = query.order('title', { ascending: true })
				break
			case 'title_desc':
				query = query.order('title', { ascending: false })
				break
			case 'popularity':
				query = query.order('created_at', { ascending: false })
				break
			default:
				query = query.order('created_at', { ascending: false })
		}

		// Внутренняя сортировка
		query = query
			.order('order_index', { referencedTable: 'modules', ascending: true })
			.order('order_index', { referencedTable: 'modules.lessons', ascending: true })
			.order('order_index', { referencedTable: 'course_skills', ascending: true })

		// Если есть фильтр по статусу, берем больше данных для постфильтрации
		const fetchLimit = status ? limit * 3 : limit
		query = query.range(offset, offset + fetchLimit - 1)

		const { data: coursesData, error: coursesError } = await query

		if (coursesError) throw new Error(coursesError.message)
		if (!coursesData) return []

		// Постфильтрация
		let filteredData = coursesData

		if (authorId) {
			filteredData = filteredData.filter(course =>
				course.course_authors?.some(ca => ca.user?.id === authorId)
			)
		}

		if (skill) {
			filteredData = filteredData.filter(course =>
				course.course_skills?.some(cs => cs.skills?.name === skill)
			)
		}

		// Фильтр по статусу прогресса текущего пользователя
		if (status && userId) {
			filteredData = filteredData.filter(course => {
				const userEnrollment = course.course_enrollments?.find(e => e.user_id === userId)

				switch (status) {
					case 'not_started':
						// Либо нет enrollment, либо progress null или 0
						return (
							!userEnrollment || userEnrollment.progress === null || userEnrollment.progress === 0
						)

					case 'in_progress':
						// Есть enrollment и progress > 0 и < 100
						return (
							userEnrollment &&
							userEnrollment.progress !== null &&
							userEnrollment.progress > 0 &&
							userEnrollment.progress < 100
						)

					case 'completed':
						// Есть enrollment и status = 'completed'
						return userEnrollment && userEnrollment.status === 'completed'

					default:
						return true
				}
			})

			// Обрезаем до нужного количества после фильтрации
			filteredData = filteredData.slice(0, limit)
		}

		// Трансформация данных
		return filteredData.map(course => {
			const userEnrollment = course.course_enrollments?.find(e => e.user_id === userId)

			return {
				...course,
				authors: course.course_authors?.map(ca => ca.user) ?? [],
				skills: course.course_skills?.map(cs => cs.skills) ?? [],
				enrollment: userEnrollment
					? {
							progress: userEnrollment.progress,
							status: userEnrollment.status,
							enrolled_at: userEnrollment.enrolled_at
						}
					: null
			}
		})
	}

	private async getUserEnrolledCourses({
		userId,
		authorId,
		status,
		search,
		limit = 10,
		offset = 0,
		sort,
		tab,
		skill
	}: getAllWithDetailsRequest) {
		let query = this.supabase
			.from('course_enrollments')
			.select(
				`
				progress,
				status,
				enrolled_at,
				courses (
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
				)
			`
			)
			.eq('user_id', userId ?? '')

		// Фильтр по статусу прогресса
		if (status) {
			switch (status) {
				case 'not_started':
					query = query.or('progress.is.null,progress.eq.0')
					break
				case 'in_progress':
					query = query.not('progress', 'is', null).gt('progress', 0).lt('progress', 100)
					break
				case 'completed':
					query = query.eq('status', 'completed')
					break
			}
		}

		// Поиск по названию
		if (search) {
			query = query.ilike('courses.title', `%${search}%`)
		}

		// Определяем сортировку
		const sortField = sort || this.getDefaultSortForTab(tab)

		switch (sortField) {
			case 'date_desc':
				query = query.order('enrolled_at', { ascending: false })
				break
			case 'date_asc':
				query = query.order('enrolled_at', { ascending: true })
				break
			case 'title_asc':
				query = query.order('title', {
					ascending: true,
					referencedTable: 'courses'
				})
				break
			case 'title_desc':
				query = query.order('title', {
					ascending: false,
					referencedTable: 'courses'
				})
				break
			case 'progress_desc':
				query = query.order('progress', { ascending: false })
				break
			case 'progress_asc':
				query = query.order('progress', { ascending: true })
				break
			case 'new_courses':
				// Для таба "новые" - сортируем по дате создания курса
				query = query.order('created_at', {
					ascending: false,
					referencedTable: 'courses'
				})
				break
			case 'recommended':
				// Для таба "рекомендованные" (пока как новые)
				query = query.order('created_at', {
					ascending: false,
					referencedTable: 'courses'
				})
				break
			default:
				query = query.order('enrolled_at', { ascending: false })
		}

		// Внутренняя сортировка
		query = query
			.order('order_index', { referencedTable: 'courses.modules', ascending: true })
			.order('order_index', { referencedTable: 'courses.modules.lessons', ascending: true })
			.order('order_index', { referencedTable: 'courses.course_skills', ascending: true })

		// Пагинация
		query = query.range(offset, offset + limit - 1)

		const { data: enrollmentData, error: enrollmentError } = await query

		if (enrollmentError) throw new Error(enrollmentError.message)
		if (!enrollmentData) return []

		// Постфильтрация
		let filteredData = enrollmentData

		if (authorId) {
			filteredData = filteredData.filter(enrollment =>
				enrollment.courses?.course_authors?.some(ca => ca.user?.id === authorId)
			)
		}

		if (skill) {
			filteredData = filteredData.filter(enrollment =>
				enrollment.courses?.course_skills?.some(cs => cs.skills?.name === skill)
			)
		}

		// Трансформация данных
		return filteredData.map(enrollment => {
			const course = enrollment.courses

			return {
				...course,
				authors: course?.course_authors?.map(ca => ca.user) ?? [],
				skills: course?.course_skills?.map(cs => cs.skills) ?? [],
				enrollment: {
					progress: enrollment.progress,
					status: enrollment.status,
					enrolled_at: enrollment.enrolled_at
				}
			}
		})
	}

	// Вспомогательная функция для дефолтной сортировки таба
	private getDefaultSortForTab(tab?: string): string {
		switch (tab) {
			case 'new':
				return 'new_courses' // Сортировка по дате создания курса
			case 'recommended':
				return 'recommended'
			case 'my_courses':
			default:
				return 'date_desc' // По дате записи
		}
	}
}
