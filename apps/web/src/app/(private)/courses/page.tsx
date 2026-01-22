import type { CoursesResponse } from '@/app/api/courses/route'
import type { UserEnrollmentsResponse } from '@/app/api/enrollments/user/[userId]/route'
import { Button, Skeleton } from '@studyx/ui/base'

import { ErrorCard } from '@studyx/ui/common'
import Link from 'next/link'

import { Suspense } from 'react'
import { api } from '@/app/api'
import { H2 } from '@/components/common/Typography/H2'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { CourseFilters } from './(components)/CourseFilters/CourseFilters'
import { CourseList } from './(components)/CourseList/CourseList'

interface CoursesPageProps {
  searchParams: Promise<{
    q?: string
    author?: string
    skill?: string
    tab?: string
    status?: string
    sort?: string
  }>
}

async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams

  const userId = (await getUser())!.id

  const queryParams = new URLSearchParams({
    ...params,
    userId,
  })

  const [getCoursesResponse, getUserEnrollmentsResponse] = await Promise.all([
    api.get<CoursesResponse>(`/api/courses?${queryParams.toString()}`),
    api.get<UserEnrollmentsResponse>(`/api/enrollments/user/${userId}`),
  ])

  if (!getCoursesResponse.data.success) {
    return (
      <ErrorCard
        title="Не вдалося завантажити курси"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (!getUserEnrollmentsResponse.data.success) {
    return (
      <ErrorCard
        title="Не вдалося завантажити дані про ваші курси"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  const hasActiveFilters = Object.values(params).some(value => value !== undefined)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <H2>Курси</H2>
          <p className="text-muted-foreground text-sm">
            Оберіть курс, щоб перейти до модулів та матеріалів.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="px-5"
        >
          <Link href="/">Повернутися на дашборд</Link>
        </Button>
      </div>

      <CourseFilters
        courses={getCoursesResponse.data.data}
        enrollments={getUserEnrollmentsResponse.data.data}
      />

      <Suspense fallback={<CoursesListSkeleton />}>
        <CourseList
          courses={getCoursesResponse.data.data}
          enrollments={getUserEnrollmentsResponse.data.data}
          hasActiveFilters={hasActiveFilters}
        />
      </Suspense>
    </div>
  )
}

export default CoursesPage

function CoursesListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton для табів та пошуку */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Skeleton className="h-10 w-80 rounded-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-72 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
      {/* Skeleton для карток */}
      <div className="grid gap-4 pt-0.5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[320px] flex-col justify-between rounded-2xl border p-5"
          >
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
