import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { queryKeys } from '@/app/(constants)/query'
import { getQueryClient } from '@/app/(contexts)/query/get-query-client'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { getBlockSubmissions } from '@/shared/api/requests/block-submissions/{lessonId}/{userId}/getBlockSubmissions'
import { getLessonBySlug } from '@/shared/api/requests/lessons/getLessonBySlug'
import { LessonPageContent } from './(components)/LessonPage/LessonPage'

async function LessonPage(props: PageProps<'/courses/[slug]/[lessonSlug]'>) {
  const { slug, lessonSlug } = await props.params

  const decodedCourseSlug = decodeURIComponent(slug)
  const decodedLessonSlug = decodeURIComponent(lessonSlug)
  const supabase = await createSupabaseServerClient()
  const queryClient = getQueryClient()

  let lessonData
  try {
    lessonData = await queryClient.fetchQuery({
      queryKey: queryKeys.lessons.bySlug(decodedCourseSlug, decodedLessonSlug),
      queryFn: () => getLessonBySlug({ courseSlug: decodedCourseSlug, lessonSlug: decodedLessonSlug }, supabase),
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Lesson not found') {
      return (
        <NotFoundCard
          title="404 - Заняття не знайдено"
          description="Схоже, заняття, яке ви шукаєте, не існує."
        />
      )
    }

    return (
      <ErrorCard
        title="Не вдалося завантажити заняття"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (!lessonData) {
    return (
      <ErrorCard
        title="Не вдалося завантажити заняття"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  const user = await getUser()
  if (!user) {
    return (
      <ErrorCard
        title="Не вдалося завантажити відповіді"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  await queryClient.prefetchQuery({
    queryKey: queryKeys.blockSubmissions.byLesson(lessonData.lesson.id, user.id),
    queryFn: () => getBlockSubmissions({ lessonId: lessonData.lesson.id, userId: user.id }, supabase),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LessonPageContent
        courseSlug={decodedCourseSlug}
        lessonSlug={decodedLessonSlug}
        userId={user.id}
      />
    </HydrationBoundary>
  )
}

export default LessonPage
