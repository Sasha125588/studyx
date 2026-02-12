'use client'

import type { CourseEnrollment, CourseWithDetails } from '@studyx/types'
import type { CoursesStatus, SortOption, TabValue } from '../constants/filters'
import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { useCallback, useMemo } from 'react'
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
    DEFAULT_FILTERS.status,
  ),
  sort: parseAsStringLiteral(Object.values(SORT_OPTIONS)).withDefault(DEFAULT_FILTERS.sort),
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
    shallow: true,
  })

  // Стабильный объект filters
  const filters = useMemo(() => ({
    tab: params.tab as TabValue,
    search: params.q,
    status: params.status as CoursesStatus,
    sort: params.sort as SortOption,
    authorId: params.authorId,
    skill: params.skill,
  }), [params])

  // Оптимизированные вычисления authors
  const authors = useMemo(() => {
    const authorMap = new Map<string, string>()

    courses.forEach((course) => {
      course.authors?.forEach((author) => {
        const name = author.name ?? author.email
        if (name && !authorMap.has(author.id)) {
          authorMap.set(author.id, name)
        }
      })
    })

    return Array.from(authorMap.entries()).map(([id, name]) => ({ id, name }))
  }, [courses])

  // Оптимизированные вычисления skills
  const skills = useMemo(() => {
    const skillSet = new Set<string>()

    courses.forEach((course) => {
      course.skills?.forEach((skill) => {
        if (skill.name) {
          skillSet.add(skill.name)
        }
      })
    })

    return Array.from(skillSet).sort()
  }, [courses])

  // Callbacks со стабильными ссылками
  const setTab = useCallback((tab: TabValue) => {
    setParams(prev => ({
      ...prev,
      tab,
      status:
        tab === TAB_VALUES.MY
          ? prev.status
          : COURSES_STATUS.ALL,
    }))
  }, [setParams])

  const setSearch = useCallback((q: string) => {
    setParams({ q: q || null })
  }, [setParams])

  const setCoursesStatus = useCallback((status: CoursesStatus) => {
    setParams({ status })
  }, [setParams])

  const setSortBy = useCallback((sort: SortOption) => {
    setParams({ sort })
  }, [setParams])

  const setAuthorId = useCallback((authorId: string | null) => {
    setParams({ authorId })
  }, [setParams])

  const setSkill = useCallback((skill: string | null) => {
    setParams({ skill })
  }, [setParams])

  const resetFilters = useCallback(() => {
    setParams({
      tab: null,
      q: null,
      status: null,
      sort: null,
      authorId: null,
      skill: null,
    })
  }, [setParams])

  const hasActiveFilters = useMemo(() => {
    const statusActive
      = filters.tab === TAB_VALUES.MY
        && filters.status !== COURSES_STATUS.ALL

    return (
      filters.search !== ''
      || filters.authorId !== null
      || filters.skill !== null
      || statusActive
    )
  }, [filters])

  // Helper для поиска enrollment (если нужен в фильтрах)
  const getEnrollment = useCallback((courseId: number) =>
    enrollments.find(e => e.course_id === courseId), [enrollments])

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
