import type { CoursesStatus, TabValue } from './(components)/constants/filters'
import { Button } from '@studyx/ui/base'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { queryKeys } from '@/app/(constants)/query'
import { getQueryClient } from '@/app/(contexts)/query/get-query-client'
import { H2 } from '@/components/common/Typography/H2'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { getCourses } from '@/shared/api/requests/courses/getCourses'
import { getUserEnrollments } from '@/shared/api/requests/enrollments/{userId}/getUserEnrollments'
import { CoursesContent } from './(components)/CoursesContent'

interface CoursesPageProps {
  searchParams: Promise<{
    q?: string
    authorId?: string
    skill?: string
    tab?: string
    status?: string
    sort?: string
  }>
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams

  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  const supabase = await createSupabaseServerClient()
  const queryClient = getQueryClient()

  const coursesParams = {
    userId: user.id,
    tab: (params.tab ?? 'all') as TabValue,
    search: params.q,
    authorId: params.authorId,
    skill: params.skill,
    status: (params.status ?? 'all') as CoursesStatus,
    sort: params.sort ?? 'date_desc',
    limit: 10,
    offset: 0,
  }

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.courses.list(coursesParams),
      queryFn: () => getCourses(coursesParams, supabase),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.enrollments.user(user.id),
      queryFn: () => getUserEnrollments({ userId: user.id }, supabase),
    }),
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <H2>Курси</H2>
          <p className="text-muted-foreground text-sm">
            Оберіть курс, щоб перейти до модулів та матеріалів.
          </p>
        </div>
        <Button asChild variant="outline" className="px-5">
          <Link href="/">Повернутися на дашборд</Link>
        </Button>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CoursesContent userId={user.id} />
      </HydrationBoundary>
    </div>
  )
}
