'use client'

import { keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useGetCoursesQuery } from '@/shared/api/hooks/courses/useGetCoursesQuery'
import { useGetUserEnrollmentsQuery } from '@/shared/api/hooks/enrollments/{userId}/useGetUserEnrollmentsQuery'
import { CourseFilters } from './CourseFilters/CourseFilters'
import { CourseList } from './CourseList/CourseList'
import { useCourseFilters } from './hooks/useCourseFilters'

interface CoursesContentProps {
  userId: string
}

export function CoursesContent({ userId }: CoursesContentProps) {
  const {
    filters,
    hasActiveFilters,
  } = useCourseFilters({ courses: [], enrollments: [] })

  const coursesParams = useMemo(() => ({
    userId,
    tab: filters.tab,
    search: filters.search || undefined,
    authorId: filters.authorId || undefined,
    skill: filters.skill || undefined,
    status: filters.status,
    sort: filters.sort,
    limit: 10,
    offset: 0,
  }), [userId, filters])

  const {
    data: courses = [],
    isFetching,
  } = useGetCoursesQuery(coursesParams, {
    placeholderData: keepPreviousData,
  })

  const { data: enrollments = [] } = useGetUserEnrollmentsQuery({ userId })

  return (
    <>
      <CourseFilters courses={courses} enrollments={enrollments} />

      <div className={isFetching ? 'opacity-60 transition-opacity duration-200' : 'transition-opacity duration-200'}>
        <CourseList
          courses={courses}
          enrollments={enrollments}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </>
  )
}
