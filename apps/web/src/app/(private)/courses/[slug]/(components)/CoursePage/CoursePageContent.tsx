'use client'

import { EnrollmentStatuses } from '@studyx/types'
import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { XIcon } from 'lucide-react'
import { useGetCourseBySlugQuery } from '@/shared/api/hooks/courses/{slug}/useGetCourseBySlugQuery'
import { useGetEnrollmentStatusQuery } from '@/shared/api/hooks/enrollments/{courseId}/{userId}/useGetEnrollmentStatusQuery'
import { useGetRoadmapPositionsQuery } from '@/shared/api/hooks/roadmap-positions/useGetRoadmapPositionsQuery'
import { CoursePageMain } from './CoursePage'

interface CoursePageContentProps {
  slug: string
  userId: string
}

export function CoursePageContent({ slug, userId }: CoursePageContentProps) {
  const {
    data: course,
    isPending: isCoursePending,
    error: courseError,
  } = useGetCourseBySlugQuery({ slug }, { retry: false })

  const courseId = course ? String(course.id) : ''

  const {
    data: savedPositions = [],
    error: roadmapError,
  } = useGetRoadmapPositionsQuery(
    { userId, courseId },
    {
      enabled: Boolean(courseId),
      retry: false,
    },
  )

  const {
    data: enrollment,
    error: enrollmentError,
  } = useGetEnrollmentStatusQuery(
    { courseId, userId },
    {
      enabled: Boolean(courseId),
      retry: false,
    },
  )

  if (courseError?.message === 'Course not found') {
    return (
      <NotFoundCard
        title="404 - Курс не знайдено"
        description="Ми шукали всюди, але такого курсу не існує."
      />
    )
  }

  if (courseError) {
    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити курс"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (roadmapError) {
    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити roadmap"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  const isEnrollmentNotFound = enrollmentError?.message === 'Enrollment not found'
  if (enrollmentError && !isEnrollmentNotFound) {
    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити дані запису на курс"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (isCoursePending || !course) {
    return null
  }

  const isEnrolled = isEnrollmentNotFound
    ? false
    : enrollment?.status === EnrollmentStatuses.ENROLLED

  return (
    <CoursePageMain
      course={course}
      savedPositions={savedPositions}
      isEnrolled={Boolean(isEnrolled)}
      userId={userId}
    />
  )
}
