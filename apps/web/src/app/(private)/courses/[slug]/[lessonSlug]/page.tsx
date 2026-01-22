import type { BlockSubmissionsResponse } from '@/app/api/block-submissions/lesson/[lessonId]/user/[userId]/route'

import type { LessonBySlugResponse } from '@/app/api/lessons/by-slug/route'
import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { api } from '@/app/api'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { LessonPageMain } from './(components)/LessonPage/LessonPage'

async function LessonPage(props: PageProps<'/courses/[slug]/[lessonSlug]'>) {
  const { slug, lessonSlug } = await props.params

  const decodedCourseSlug = decodeURIComponent(slug)
  const decodedLessonSlug = decodeURIComponent(lessonSlug)

  const lessonResponse = await api.get<LessonBySlugResponse>(`/api/lessons/by-slug/?courseSlug=${decodedCourseSlug}&lessonSlug=${decodedLessonSlug}`)

  if (!lessonResponse.data.success) {
    return (
      <ErrorCard
        title="Не вдалося завантажити заняття"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (lessonResponse.status === 404) {
    return (
      <NotFoundCard
        title="404 - Заняття не знайдено"
        description="Схоже, заняття, яке ви шукаєте, не існує."
      />
    )
  }

  const fullLessonData = lessonResponse.data.data

  const user = await getUser()
  const submissionsResponse = await api.get<BlockSubmissionsResponse>(`/api/block-submissions/lesson/${fullLessonData.lesson.id}/user/${user?.id}`)

  if (!submissionsResponse.data.success) {
    return (
      <ErrorCard
        title="Не вдалося завантажити відповіді"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  return (
    <LessonPageMain
      data={fullLessonData}
      submissions={submissionsResponse.data.data}
    />
  )
}

export default LessonPage
