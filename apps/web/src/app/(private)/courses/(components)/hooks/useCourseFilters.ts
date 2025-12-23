'use client'

import type { CourseEnrollment, CourseWithDetails } from '@studyx/database'
import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { useCallback, useMemo } from 'react'

import {
	DEFAULT_FILTERS,
	MY_COURSES_STATUS,
	type MyCoursesStatus,
	SORT_OPTIONS,
	type SortOption,
	TAB_VALUES,
	type TabValue
} from '../constants/filters'

/* eslint-disable react-hooks/exhaustive-deps */

const courseFiltersParsers = {
	tab: parseAsStringLiteral(Object.values(TAB_VALUES)).withDefault(DEFAULT_FILTERS.tab),
	q: parseAsString.withDefault(''),
	status: parseAsStringLiteral(Object.values(MY_COURSES_STATUS)).withDefault(
		DEFAULT_FILTERS.myCoursesStatus
	),
	sort: parseAsStringLiteral(Object.values(SORT_OPTIONS)).withDefault(DEFAULT_FILTERS.sortBy),
	author: parseAsString,
	skill: parseAsString
}

interface UseCourseFiltersProps {
	courses: CourseWithDetails[]
	enrollments?: CourseEnrollment[]
	userId?: string
}

export const useCourseFilters = ({ courses, enrollments = [], userId }: UseCourseFiltersProps) => {
	const [params, setParams] = useQueryStates(courseFiltersParsers, {
		history: 'replace',
		shallow: false
	})

	const filters = {
		tab: params.tab as TabValue,
		search: params.q,
		myCoursesStatus: params.status as MyCoursesStatus,
		sortBy: params.sort as SortOption,
		author: params.author,
		skill: params.skill
	}

	const authors = useMemo(() => {
		const authorMap = new Map<string, string>()

		courses.forEach(course => {
			course.authors?.forEach(author => {
				const name = author.name ?? author.email
				const id = author.id

				if (name && !authorMap.has(id)) {
					authorMap.set(id, name)
				}
			})
		})

		return Array.from(authorMap.entries()).map(([id, name]) => ({ id, name }))
	}, [courses])

	const skills = useMemo(() => {
		const skillSet = new Set<string>()

		courses.forEach(course => {
			course.skills.forEach(skill => {
				if (skill.name) {
					skillSet.add(skill.name)
				}
			})
		})

		return Array.from(skillSet).sort()
	}, [courses])

	const getEnrollment = (courseId: number) => enrollments.find(e => e.course_id === courseId)

	const filterByMyCoursesStatus = useCallback(
		(coursesList: CourseWithDetails[]) => {
			if (filters.myCoursesStatus === MY_COURSES_STATUS.ALL) return coursesList

			return coursesList.filter(course => {
				const enrollment = getEnrollment(course.id)

				switch (filters.myCoursesStatus) {
					case MY_COURSES_STATUS.NOT_STARTED:
						return !enrollment || enrollment.progress === 0
					case MY_COURSES_STATUS.IN_PROGRESS:
						return (
							enrollment &&
							enrollment.progress !== null &&
							enrollment.progress > 0 &&
							enrollment.progress < 100 &&
							enrollment.status !== 'completed'
						)
					case MY_COURSES_STATUS.COMPLETED:
						return enrollment?.status === 'completed' || enrollment?.progress === 100
					default:
						return true
				}
			})
		},
		[filters.myCoursesStatus, getEnrollment]
	)

	const filteredCourses = useMemo(() => {
		let result = [...courses]

		switch (filters.tab) {
			case TAB_VALUES.MY:
				// Курси, на які записаний користувач
				result = result.filter(course => enrollments.some(e => e.course_id === course.id))
				result = filterByMyCoursesStatus(result)
				break
			case TAB_VALUES.NEW:
				// Сортуємо за датою (нові перші)
				result = result
					.filter(course => course.created_at)
					.sort((a, b) => {
						const dateA = new Date(a.created_at ?? 0).getTime()
						const dateB = new Date(b.created_at ?? 0).getTime()
						return dateB - dateA
					})
				break
			case TAB_VALUES.RECOMMENDED:
				// Тут має бути логіка рекомендацій
				// Поки що показуємо курси з найвищим рейтингом або популярністю
				// TODO: Додати логіку рекомендацій на бекенді
				result = result.filter(course => course.modules && course.modules.length > 0)
				break
		}

		// Пошук за назвою
		if (filters.search.trim()) {
			const searchLower = filters.search.toLowerCase().trim()
			result = result.filter(course => course.title?.toLowerCase().includes(searchLower))
		}

		if (filters.author) {
			result = result.filter(course => course.authors?.some(author => author.id === filters.author))
		}

		if (filters.skill) {
			result = result.filter(course => course.skills.some(skill => skill.name === filters.skill))
		}

		result.sort((a, b) => {
			switch (filters.sortBy) {
				case SORT_OPTIONS.DATE_DESC:
					return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
				case SORT_OPTIONS.DATE_ASC:
					return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
				case SORT_OPTIONS.TITLE_ASC:
					return (a.title ?? '').localeCompare(b.title ?? '', 'uk')
				case SORT_OPTIONS.TITLE_DESC:
					return (b.title ?? '').localeCompare(a.title ?? '', 'uk')
				case SORT_OPTIONS.POPULARITY:
					return (b.modules?.length ?? 0) - (a.modules?.length ?? 0)
				case SORT_OPTIONS.PROGRESS:
					if (userId) {
						const progressA = getEnrollment(a.id)?.progress ?? 0
						const progressB = getEnrollment(b.id)?.progress ?? 0
						return progressB - progressA
					}
					return 0
				default:
					return 0
			}
		})

		return result
	}, [courses, enrollments, filters, filterByMyCoursesStatus, getEnrollment, userId])

	const setTab = (tab: TabValue) => setParams({ tab, status: DEFAULT_FILTERS.myCoursesStatus })

	const setSearch = (q: string) => setParams({ q: q || null })

	const setMyCoursesStatus = (status: MyCoursesStatus) => setParams({ status })

	const setSortBy = (sort: SortOption) => setParams({ sort })

	const setAuthor = (author: string | null) => setParams({ author })

	const setSkill = (skill: string | null) => setParams({ skill })

	const resetFilters = () =>
		setParams({ tab: null, q: null, status: null, sort: null, author: null, skill: null })

	const hasActiveFilters =
		filters.search !== '' ||
		filters.author !== null ||
		filters.skill !== null ||
		filters.myCoursesStatus !== MY_COURSES_STATUS.ALL

	return {
		filters,
		filteredCourses,
		authors,
		skills,
		setTab,
		setSearch,
		setMyCoursesStatus,
		setSortBy,
		setAuthor,
		setSkill,
		resetFilters,
		hasActiveFilters,
		getEnrollment
	}
}

export type UseCourseFiltersReturn = ReturnType<typeof useCourseFilters>
