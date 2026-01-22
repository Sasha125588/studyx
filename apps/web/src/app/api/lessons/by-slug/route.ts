import type { LessonBlock, LessonFullContext } from '@studyx/types'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { BadRequestError, InternalServerError, NotFoundError } from '@/shared/api/errors'

const lessonSlugQuerySchema = z.object({
  courseSlug: z.string(),
  lessonSlug: z.string(),
})

export interface LessonBySlugResponse {
  success: boolean
  data: LessonFullContext
}

export interface LessonBySlugError {
  success: boolean
  error: string
  code?: string
}

/**
 * Get lesson by course slug and lesson slug with full context
 */
export async function GET(request: NextRequest): Promise<NextResponse<LessonBySlugError | LessonBySlugResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryParams = {
      courseSlug: searchParams.get('courseSlug'),
      lessonSlug: searchParams.get('lessonSlug'),
    }

    const validationResult = lessonSlugQuerySchema.safeParse(queryParams)

    if (!validationResult.success) {
      return new BadRequestError('Invalid query parameters').toResponse()
    }

    const { courseSlug, lessonSlug } = validationResult.data
    const supabase = await createClient()

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
      return new NotFoundError('Lesson not found').toResponse()
    }

    if (error) {
      console.error('Database error:', error)
      return new InternalServerError('Database error').toResponse()
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
      return new InternalServerError('Database error').toResponse()
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
        attachments: [], // TODO: Add attachments if needed
        blocks: data.blocks as unknown as LessonBlock[],
        progress: null, // TODO: Add progress if needed
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

    return NextResponse.json({
      success: true,
      data: result,
    })
  }
  catch (error) {
    console.error('Internal server error:', error)
    return new InternalServerError('Internal server error').toResponse()
  }
}
