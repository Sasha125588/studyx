import type { LessonFullContext } from '@studyx/types'
import { LessonTypes } from '@studyx/types'
import { Badge } from '@studyx/ui/base'
import {
  ArrowLeftIcon,
  // BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  FlaskConicalIcon,
} from 'lucide-react'
import Link from 'next/link'

interface LessonHeaderProps {
  lesson: LessonFullContext['lesson']
  module: LessonFullContext['module']
  course: LessonFullContext['course']
  navigation: LessonFullContext['navigation']
}

export function LessonHeader({ lesson, module, course, navigation }: LessonHeaderProps) {
  const isLecture = lesson.type === LessonTypes.LECTURE
  // const isPractical = lesson.type === LessonTypes.PRACTICAL

  // Приблизний час читання (150 слів на хвилину)
  // const wordCount = lesson.content?.split(/\s+/).length ?? 0
  // const readingTime = Math.max(1, Math.ceil(wordCount / 150))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/courses/${course.slug}`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {course.title}
        </Link>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{module.name}</span>
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl border p-6 ${
          isLecture
            ? 'border-blue-200 bg-linear-to-br from-blue-50 to-violet-50 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-violet-950/30'
            : 'border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-teal-950/30'
        }`}
      >
        <div
          className={`absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20 blur-2xl ${
            isLecture ? 'bg-blue-400' : 'bg-emerald-400'
          }`}
        />

        <div className="relative">
          <div className="mb-3 flex items-center gap-3">
            <Badge
              className={`flex items-center gap-1.5 ${
                isLecture
                  ? 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
              }`}
            >
              {isLecture
                ? (
                    <>
                      <FileTextIcon className="h-3.5 w-3.5" />
                      Лекція
                    </>
                  )
                : (
                    <>
                      <FlaskConicalIcon className="h-3.5 w-3.5" />
                      Практична робота
                    </>
                  )}
            </Badge>

            <span className="text-muted-foreground text-sm">
              {navigation.currentIndex}
              {' '}
              /
              {navigation.totalLessons}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{lesson.title}</h1>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
            {isLecture && (
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                <span>
                  ~
                  {lesson.estimated_time_minutes}
                  {' '}
                  хв читання
                </span>
              </div>
            )}

            {/* {isPractical && lesson.content && (
              <div className='flex items-center gap-1.5'>
                <BookOpenIcon className='h-4 w-4' />
                <span>{lesson.content.match(/^\d+\./gm)?.length ?? 0} завдань</span>
              </div>
            )} */}

            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span>
                  📎
                  {lesson.attachments.length}
                  {' '}
                  вкладень
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
