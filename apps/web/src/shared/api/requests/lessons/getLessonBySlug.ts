import type { Database, LessonBlock, LessonFullContext } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetLessonBySlugParams {
  courseSlug: string
  lessonSlug: string
}

export interface GetLessonBySlugResponse {
  success: boolean
  data: LessonFullContext
}

export interface GetLessonBySlugError {
  success: boolean
  error: string
  code?: string
}

export async function getLessonBySlug(params: GetLessonBySlugParams, supabase: SupabaseClient<Database>): Promise<LessonFullContext> {
  const { courseSlug, lessonSlug } = params

  // Get lesson with full context
  const { data, error } = await supabase
    .from('lessons')
    .select(
      `
        *,
        modules (
          *,
          course_id,
          courses (
            *
          )
        )
      `,
    )
    .eq('slug', lessonSlug)
    .eq('modules.courses.slug', courseSlug)
    .single()

  if (error?.code === 'PGRST116') {
    throw new Error('Lesson not found')
  }

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  // Get all modules and lessons for navigation
  const { data: allModules, error: modulesError } = await supabase
    .from('modules')
    .select(
      `
        id,
        name,
        order_index,
        lessons (
          id,
          title,
          slug,
          type,
          order_index
        )
      `,
    )
    .eq('course_id', data.modules.course_id!)
    .order('order_index', { ascending: true })
    .order('order_index', { referencedTable: 'lessons', ascending: true })

  if (modulesError) {
    console.error('Database error:', modulesError)
    throw new Error('Database error')
  }

  // Build navigation
  const courseModule = data.modules
  const course = courseModule.courses
  const currentModuleFromAll = allModules?.find(m => m.id === courseModule.id)
  const allLessonsInModule = currentModuleFromAll?.lessons || []
  const currentLessonIndex = allLessonsInModule.findIndex((l: any) => l.id === data.id)

  const result = {
    lesson: {
      ...data,
      attachments: [],
      blocks: data.blocks as unknown as LessonBlock[],
      progress: null,
    },
    module: {
      id: courseModule.id,
      name: courseModule.name,
      description: courseModule.description,
      order_index: courseModule.order_index,
      course_id: courseModule.course_id,
      created_at: courseModule.created_at,
    },
    course: {
      ...course!,
    },
    moduleLessons: allLessonsInModule,
    allModules: allModules || [],
    navigation: {
      previous: currentLessonIndex > 0 ? allLessonsInModule[currentLessonIndex - 1] : null,
      next: currentLessonIndex < allLessonsInModule.length - 1 ? allLessonsInModule[currentLessonIndex + 1] : null,
      currentIndex: currentLessonIndex + 1,
      totalLessons: allLessonsInModule.length,
    },
  }

  return result
}
