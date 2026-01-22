import type { BlockSubmission, LessonFullContext } from '@studyx/types'

import { LessonContent } from './components/LessonContent/LessonContent'
import { LessonHeader } from './components/LessonHeader/LessonHeader'
import { LessonRightPanel } from './components/LessonRightPanel/LessonRightPanel'
import { LessonSidebar } from './components/LessonSidebar/LessonSidebar'

interface LessonPageMainProps {
  data: LessonFullContext
  submissions?: BlockSubmission[]
}

export function LessonPageMain({ data, submissions = [] }: LessonPageMainProps) {
  const { lesson, module, course, allModules, navigation } = data

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)]">
      <aside className="sticky top-4 h-fit w-60 shrink-0 pt-14 pr-6">
        <LessonSidebar
          modules={allModules}
          currentLessonId={lesson.id}
          courseSlug={course.slug}
          courseName={course.title}
        />
      </aside>

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
    </div>
  )
}
