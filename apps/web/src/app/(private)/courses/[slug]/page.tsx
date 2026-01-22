import type { GetCourseBySlugResponse } from '@/app/api/courses/slug/[slug]/route'
import type { GetRoadmapPositionsResponse } from '@/app/api/roadmap-positions/route'

import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { XIcon } from 'lucide-react'
import { api } from '@/app/api/instance'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { CoursePageMain } from './(components)/CoursePage/CoursePage'

async function CoursePage(props: PageProps<'/courses/[slug]'>) {
  const { slug } = await props.params
  const decodedSlug = decodeURIComponent(slug)

  const userId = (await getUser())!.id

  const getCourseResponse = await api.get<GetCourseBySlugResponse>(`/api/courses/slug/${decodedSlug}`)

  if (getCourseResponse.status === 404) {
    return (
      <NotFoundCard
        title="404 - Курс не знайдено"
        description="Ми шукали всюди, але такого курсу не існує."
      />
    )
  }

  if (getCourseResponse.status !== 200) {
    return (
      <ErrorCard
        icon={<XIcon size={16} />}
        title="Не вдалося завантажити курс"
        description={getCourseResponse.statusText ?? 'Спробуйте оновити сторінку.'}
      />
    )
  }

  const course = getCourseResponse.data.data

  const savedPositions = await api.get<GetRoadmapPositionsResponse>(`/api/roadmap-positions?userId=${userId}&courseId=${course.id}`)

  return (
    <CoursePageMain
      course={course}
      savedPositions={savedPositions.data.data}
      userId={userId}
    />
  )
}

export default CoursePage
