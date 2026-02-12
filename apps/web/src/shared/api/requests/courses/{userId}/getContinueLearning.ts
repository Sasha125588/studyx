import type { ContinueLearningCourse, Database } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetContinueLearningParams {
  userId: string
}

export interface GetContinueLearningResponse {
  success: boolean
  data: ContinueLearningCourse[]
}

export interface GetContinueLearningError {
  success: boolean
  error: string
  code?: string
}

export async function getContinueLearning(params: GetContinueLearningParams, supabase: SupabaseClient<Database>): Promise<ContinueLearningCourse[]> {
  const { userId } = params

  const { data, error } = await supabase
    .from('course_enrollments')
    .select(
      `
        progress,
        status,
        courses (
          id,
          title,
          slug,
          description,
          modules (
            id,
            name,
            lessons (
              id,
              title,
              order_index,
              lesson_progress (
                completed
              )
            )
          )
        )
        `,
    )
    .eq('user_id', userId)
    .in('status', ['enrolled', 'in_progress'])
    .order('order_index', { referencedTable: 'courses.modules', ascending: true })
    .order('enrolled_at', { ascending: false })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  if (!data) {
    return []
  }

  const result = data.map((enrollment) => {
    const course = enrollment.courses!
    let nextLesson = null

    for (const module_ of course.modules) {
      const sortedLessons = module_.lessons.sort(
        (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
      )

      for (let i = 0; i < sortedLessons.length; i++) {
        const lesson = sortedLessons[i]
        const isCompleted = lesson.lesson_progress?.[0]?.completed

        if (!isCompleted) {
          nextLesson = {
            id: lesson.id,
            title: lesson.title,
            moduleName: module_.name,
            number: i + 1,
            totalLessons: module_.lessons.length,
          }
          break
        }
      }

      if (nextLesson)
        break
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course?.description,
      progress: enrollment.progress ?? 0,
      status: enrollment.status,
      nextLesson,
    }
  })

  return result
}
