import type { CourseWithDetails, Database, LessonBlock } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GetCourseBySlugParams {
  slug: string
}

export interface GetCourseBySlugResponse {
  success: boolean
  data: CourseWithDetails
}

export interface GetCourseBySlugError {
  success: boolean
  error: string
  code?: string
}

export async function getCourseBySlug(params: GetCourseBySlugParams, supabase: SupabaseClient<Database>): Promise<CourseWithDetails> {
  const { slug } = params

  const { data, error } = await supabase
    .from('courses')
    .select(
      `
        *,
        modules (
          *,
          lessons (*)
        ),
        course_authors (
          user (*)
        ),
        course_skills (
          skills (*)
        )
      `,
    )
    .eq('slug', slug)
    .order('order_index', { referencedTable: 'modules', ascending: true })
    .order('order_index', { referencedTable: 'modules.lessons', ascending: true })
    .order('order_index', { referencedTable: 'course_skills', ascending: true })
    .single()

  if (error?.details === 'The result contains 0 rows') {
    throw new Error('Course not found')
  }

  if (error) {
    console.error('Database error:', error)
    throw new Error('Database error')
  }

  const result = {
    ...data,
    authors: data.course_authors.map(ca => ca.user),
    skills: data.course_skills.map(cs => cs.skills),
    modules: (data.modules).map(m => ({
      ...m,
      lessons: (m.lessons).map(l => ({
        ...l,
        blocks: l.blocks as unknown as LessonBlock[],
      })),
    })),
  }

  return result
}
