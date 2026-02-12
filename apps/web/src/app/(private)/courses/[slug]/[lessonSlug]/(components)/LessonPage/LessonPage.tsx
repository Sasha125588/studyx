'use client'

import type { BlockSubmission, LessonFullContext } from '@studyx/types'
import { ErrorCard, NotFoundCard } from '@studyx/ui/common'
import { useGetBlockSubmissionsQuery } from '@/shared/api/hooks/block-submissions/{lessonId}/{userId}/useGetBlockSubmissionsQuery'

import { useGetLessonBySlugQuery } from '@/shared/api/hooks/lessons/useGetLessonBySlugQuery'
import { LessonContent } from './components/LessonContent/LessonContent'
import { LessonHeader } from './components/LessonHeader/LessonHeader'
import { LessonRightPanel } from './components/LessonRightPanel/LessonRightPanel'

interface LessonPageMainProps {
  data: LessonFullContext
  submissions?: BlockSubmission[]
}

interface LessonPageContentProps {
  courseSlug: string
  lessonSlug: string
  userId: string
}

export function LessonPageContent({ courseSlug, lessonSlug, userId }: LessonPageContentProps) {
  const {
    data: lessonData,
    isPending: isLessonPending,
    error: lessonError,
  } = useGetLessonBySlugQuery(
    { courseSlug, lessonSlug },
    { retry: false },
  )

  const {
    data: submissions = [],
    error: submissionsError,
  } = useGetBlockSubmissionsQuery(
    {
      lessonId: lessonData?.lesson.id ?? 0,
      userId,
    },
    {
      enabled: Boolean(lessonData?.lesson.id),
      retry: false,
    },
  )

  if (lessonError?.message === 'Lesson not found') {
    return (
      <NotFoundCard
        title="404 - Заняття не знайдено"
        description="Схоже, заняття, яке ви шукаєте, не існує."
      />
    )
  }

  if (lessonError) {
    return (
      <ErrorCard
        title="Не вдалося завантажити заняття"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (submissionsError) {
    return (
      <ErrorCard
        title="Не вдалося завантажити відповіді"
        description="Спробуйте оновити сторінку."
      />
    )
  }

  if (isLessonPending || !lessonData) {
    return null
  }

  return (
    <LessonPageMain
      data={lessonData}
      submissions={submissions}
    />
  )
}

export function LessonPageMain({ data, submissions = [] }: LessonPageMainProps) {
  const { lesson, module, course, navigation } = data

  return (
    <>
      <main className="min-w-0 flex-1 px-4">
        <LessonHeader
          lesson={lesson}
          module={module}
          course={course}
          navigation={navigation}
        />

        <div className="mt-6">
          <LessonContent
            lessonId={lesson.id}
            blocks={lesson.blocks}
            submissions={submissions}
          />
        </div>

        <div className="mt-12">
          <div className="bg-card rounded-xl border p-6">
            <h3 className="text-lg font-semibold">💬 Коментарі</h3>
            <p className="text-muted-foreground mt-2 text-sm">Коментарі поки що недоступні</p>
          </div>
        </div>
      </main>

      <aside className="sticky top-4 h-fit w-72 shrink-0 pt-14 pl-6">
        <LessonRightPanel
          attachments={lesson.attachments}
          nextLesson={navigation.next}
          courseSlug={course.slug}
        />
      </aside>
    </>
  )
}
