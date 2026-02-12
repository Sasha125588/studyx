import type { CourseWithDetails } from '@studyx/types'
import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import { queryKeys } from '@/app/(constants)/query'
import { getQueryClient } from '@/app/(contexts)/query/get-query-client'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { getCourseBySlug } from '@/shared/api/requests/courses/{slug}/getCourseBySlug'
import { getRoadmapPositions } from '@/shared/api/requests/roadmap-positions/getRoadmapPositions'
import { CoursePageContent } from './(components)/CoursePage/CoursePageContent'

async function CoursePage(props: PageProps<'/courses/[slug]'>) {
  const { slug } = await props.params
  const decodedSlug = decodeURIComponent(slug)

  const user = await getUser()
  if (!user) {
    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити курс"
        description="Користувача не знайдено. Спробуйте оновити сторінку."
      />
    )
  }

  const userId = user.id
  const supabase = await createSupabaseServerClient()
  const queryClient = getQueryClient()

  let course: CourseWithDetails
  try {
    course = await queryClient.fetchQuery({
      queryKey: queryKeys.courses.detail(decodedSlug),
      queryFn: () => getCourseBySlug({ slug: decodedSlug }, supabase),
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Course not found') {
      return (
        <NotFoundCard
          title="404 - Курс не знайдено"
          description="Ми шукали всюди, але такого курсу не існує."
        />
      )
    }

    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити курс"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (!course) {
    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити курс"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  await queryClient.prefetchQuery({
    queryKey: queryKeys.roadmapPositions.byUserAndCourse(userId, String(course.id)),
    queryFn: () => getRoadmapPositions({ userId, courseId: String(course.id) }, supabase),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursePageContent
        slug={decodedSlug}
        userId={userId}
      />
    </HydrationBoundary>
  )
}

export default CoursePage
