'use client'

import type { CourseEnrollment, CourseWithDetails } from '@studyx/types'
import type { CoursesStatus, SortOption, TabValue } from '../constants/filters'
import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'

import { useMemo } from 'react'
import {
  COURSES_STATUS,

  DEFAULT_FILTERS,
  SORT_OPTIONS,

  TAB_VALUES,

} from '../constants/filters'

const courseFiltersParsers = {
  tab: parseAsStringLiteral(Object.values(TAB_VALUES)).withDefault(DEFAULT_FILTERS.tab),
  q: parseAsString.withDefault(''),
  status: parseAsStringLiteral(Object.values(COURSES_STATUS)).withDefault(
    DEFAULT_FILTERS.coursesStatus,
  ),
  sort: parseAsStringLiteral(Object.values(SORT_OPTIONS)).withDefault(DEFAULT_FILTERS.sortBy),
  authorId: parseAsString,
  skill: parseAsString,
}

interface UseCourseFiltersProps {
  courses?: CourseWithDetails[]
  enrollments?: CourseEnrollment[]
}

export function useCourseFilters({ courses = [], enrollments = [] }: UseCourseFiltersProps) {
  const [params, setParams] = useQueryStates(courseFiltersParsers, {
    history: 'replace',
    shallow: false,
  })

  const filters = {
    tab: params.tab as TabValue,
    search: params.q,
    coursesStatus: params.status as CoursesStatus,
    sort: params.sort as SortOption,
    authorId: params.authorId,
    skill: params.skill,
  }

  const authors = useMemo(() => {
    const authorMap = new Map<string, string>()

    courses.forEach((course) => {
      course.authors?.forEach((author) => {
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

    courses.forEach((course) => {
      course.skills.forEach((skill) => {
        if (skill.name) {
          skillSet.add(skill.name)
        }
      })
    })

    return Array.from(skillSet).sort()
  }, [courses])

  const getEnrollment = (courseId: number) => enrollments.find(e => e.course_id === courseId)

  const setTab = (tab: TabValue) => setParams({ tab, status: DEFAULT_FILTERS.coursesStatus })

  const setSearch = (q: string) => setParams({ q: q || null })

  const setCoursesStatus = (status: CoursesStatus) => setParams({ status })

  const setSortBy = (sort: SortOption) => setParams({ sort })

  const setAuthorId = (authorId: string | null) => setParams({ authorId })

  const setSkill = (skill: string | null) => setParams({ skill })

  const resetFilters = () =>
    setParams({ tab: null, q: null, status: null, sort: null, authorId: null, skill: null })

  const hasActiveFilters
    = filters.search !== ''
      || filters.authorId !== null
      || filters.skill !== null
      || filters.coursesStatus !== COURSES_STATUS.ALL

  return {
    filters,
    authors,
    skills,
    setTab,
    setSearch,
    setCoursesStatus,
    setSortBy,
    setAuthorId,
    setSkill,
    resetFilters,
    hasActiveFilters,
    getEnrollment,
  }
}

export type UseCourseFiltersReturn = ReturnType<typeof useCourseFilters>
