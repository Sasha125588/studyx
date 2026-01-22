import type { CourseWithDetails, LessonBlock } from '@studyx/types'
import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import z from 'zod'
import { createClient } from '@/lib/supabase/server'

const coursesWithDetailsQuery = z.object({
  authorId: z.string().optional(),
  userId: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['all', 'not_started', 'in_progress', 'completed']).optional().default('all'),
  search: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  sort: z.string().optional(),
  tab: z.enum(['all', 'my', 'new', 'recommended']).optional().default('all'),
  skill: z.string().optional(),
})

export interface CourseSearchQuery {
  search?: string
}

export interface CoursesResponse {
  success: boolean
  data: CourseWithDetails[]
}

export interface CoursesError {
  success: boolean
  error: string
  code?: string
}

export type CourseWithDetailsQuery = z.infer<typeof coursesWithDetailsQuery>

export async function GET(request: NextRequest): Promise<NextResponse<CoursesError | CoursesResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams

    // Handle courses with details query
    const queryParams = Object.fromEntries(searchParams.entries())
    const params = coursesWithDetailsQuery.safeParse(queryParams)

    if (!params.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
      }, { status: 400 })
    }

    const { tab } = params.data

    if (tab === 'all' || !tab) {
      const result = await getAllCoursesFromSystem(params.data)
      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    const result = await getUserEnrolledCourses(params.data)
    return NextResponse.json({
      success: true,
      data: result,
    })
  }
  catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}

// Helper functions from the original service
async function getAllCoursesFromSystem(params: CourseWithDetailsQuery) {
  const supabase = await createClient()
  const {
    authorId,
    userId,
    search,
    limit = 10,
    offset = 0,
    sort,
    skill,
    status,
  } = params

  let query = supabase.from('courses').select(
    `
      *,
      course_authors (
        user (*)
      ),
      modules (
        *,
        lessons (*)
      ),
      course_skills (
        skills (*)
      ),
      course_enrollments!left (
        progress,
        status,
        enrolled_at,
        user_id
      )
    `,
  )

  // Search filtering
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  // Sorting
  switch (sort) {
    case 'date_desc':
      query = query.order('created_at', { ascending: false })
      break
    case 'date_asc':
      query = query.order('created_at', { ascending: true })
      break
    case 'title_asc':
      query = query.order('title', { ascending: true })
      break
    case 'title_desc':
      query = query.order('title', { ascending: false })
      break
    case 'popularity':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  query = query
    .order('order_index', { referencedTable: 'modules', ascending: true })
    .order('order_index', { referencedTable: 'modules.lessons', ascending: true })
    .order('order_index', { referencedTable: 'course_skills', ascending: true })

  const fetchLimit = status ? limit * 3 : limit
  query = query.range(offset, offset + fetchLimit - 1)

  const { data: coursesData, error: coursesError } = await query

  if (coursesError)
    throw new Error(coursesError.message)
  if (!coursesData)
    return []

  // Post-filtering
  let filteredData = coursesData

  if (authorId) {
    filteredData = filteredData.filter(course =>
      course.course_authors?.some(ca => ca.user?.id === authorId),
    )
  }

  if (skill) {
    filteredData = filteredData.filter(course =>
      course.course_skills?.some(cs => cs.skills?.name === skill),
    )
  }

  if (status && userId) {
    filteredData = filteredData.filter((course) => {
      const userEnrollment = course.course_enrollments?.find(e => e.user_id === userId)

      switch (status) {
        case 'not_started':
          return !userEnrollment || userEnrollment.progress === null || userEnrollment.progress === 0
        case 'in_progress':
          return userEnrollment
            && userEnrollment.progress !== null
            && userEnrollment.progress > 0
            && userEnrollment.progress < 100
        case 'completed':
          return userEnrollment && userEnrollment.status === 'completed'
        default:
          return true
      }
    })

    filteredData = filteredData.slice(0, limit)
  }

  return filteredData.map((course) => {
    const userEnrollment = course.course_enrollments?.find(e => e.user_id === userId)

    return {
      ...course,
      authors: course.course_authors?.map(ca => ca.user) ?? [],
      skills: course.course_skills?.map(cs => cs.skills) ?? [],
      modules: course.modules?.map(m => ({
        ...m,
        lessons: m.lessons?.map(l => ({
          ...l,
          blocks: l.blocks as unknown as LessonBlock[],
        })) ?? [],
      })) ?? [],
      enrollment: userEnrollment
        ? {
            progress: userEnrollment.progress,
            status: userEnrollment.status,
            enrolled_at: userEnrollment.enrolled_at,
          }
        : null,
    }
  })
}

async function getUserEnrolledCourses(params: CourseWithDetailsQuery) {
  const supabase = await createClient()
  const {
    userId,
    authorId,
    status,
    search,
    limit = 10,
    offset = 0,
    sort,
    tab,
    skill,
  } = params

  let query = supabase
    .from('course_enrollments')
    .select(
      `
        progress,
        status,
        enrolled_at,
        courses (
          *,
          course_authors (
            user (*)
          ),
          modules (
            *,
            lessons (*)
          ),
          course_skills (
            skills (*)
          )
        )
      `,
    )
    .eq('user_id', userId ?? '')

  // Status filtering
  if (status) {
    switch (status) {
      case 'not_started':
        query = query.or('progress.is.null,progress.eq.0')
        break
      case 'in_progress':
        query = query.not('progress', 'is', null).gt('progress', 0).lt('progress', 100)
        break
      case 'completed':
        query = query.eq('status', 'completed')
        break
    }
  }

  if (search) {
    query = query.ilike('courses.title', `%${search}%`)
  }

  // Sorting
  const sortField = sort || getDefaultSortForTab(tab)

  switch (sortField) {
    case 'date_desc':
      query = query.order('enrolled_at', { ascending: false })
      break
    case 'date_asc':
      query = query.order('enrolled_at', { ascending: true })
      break
    case 'title_asc':
      query = query.order('title', { ascending: true, referencedTable: 'courses' })
      break
    case 'title_desc':
      query = query.order('title', { ascending: false, referencedTable: 'courses' })
      break
    case 'progress_desc':
      query = query.order('progress', { ascending: false })
      break
    case 'progress_asc':
      query = query.order('progress', { ascending: true })
      break
    case 'new_courses':
      query = query.order('created_at', { ascending: false, referencedTable: 'courses' })
      break
    case 'recommended':
      query = query.order('created_at', { ascending: false, referencedTable: 'courses' })
      break
    default:
      query = query.order('enrolled_at', { ascending: false })
  }

  query = query
    .order('order_index', { referencedTable: 'courses.modules', ascending: true })
    .order('order_index', { referencedTable: 'courses.modules.lessons', ascending: true })
    .order('order_index', { referencedTable: 'courses.course_skills', ascending: true })
    .range(offset, offset + limit - 1)

  const { data: enrollmentData, error: enrollmentError } = await query

  if (enrollmentError)
    throw new Error(enrollmentError.message)
  if (!enrollmentData)
    return []

  let filteredData = enrollmentData

  if (authorId) {
    filteredData = filteredData.filter(enrollment =>
      enrollment.courses?.course_authors?.some(ca => ca.user?.id === authorId),
    )
  }

  if (skill) {
    filteredData = filteredData.filter(enrollment =>
      enrollment.courses?.course_skills?.some(cs => cs.skills?.name === skill),
    )
  }

  return filteredData.map((enrollment) => {
    const course = enrollment.courses

    return {
      ...course,
      authors: course?.course_authors?.map(ca => ca.user) ?? [],
      skills: course?.course_skills?.map(cs => cs.skills) ?? [],
      modules: course?.modules?.map(m => ({
        ...m,
        lessons: m.lessons?.map(l => ({
          ...l,
          blocks: l.blocks as unknown as LessonBlock[],
        })) ?? [],
      })) ?? [],
      enrollment: {
        progress: enrollment.progress,
        status: enrollment.status,
        enrolled_at: enrollment.enrolled_at,
      },
    }
  })
}

function getDefaultSortForTab(tab?: string) {
  switch (tab) {
    case 'new':
      return 'new_courses'
    case 'recommended':
      return 'recommended'
    case 'my_courses':
    default:
      return 'date_desc'
  }
}
