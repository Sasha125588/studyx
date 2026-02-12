import type { CourseWithDetails, Database, EnrollmentStatus, Lesson, LessonBlock, Module, Skill, User } from '@studyx/types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { CourseWithDetailsQuery } from './types'
import { z } from 'zod'

interface RawCourseAuthor {
  user: User | null
}

interface RawCourseSkill {
  skills: Skill | null
}

interface RawEnrollmentEmbed {
  progress: number
  status: EnrollmentStatus
  enrolled_at: string
  user_id: string
}

interface RawLesson extends Omit<Lesson, 'blocks'> {
  blocks: unknown
}

interface RawModule extends Module {
  lessons: RawLesson[]
}

interface RawCourse {
  id: number
  title: string
  slug: string
  description: string | null
  edu_program: string | null
  created_at: string
  updated_at: string | null
  course_authors: RawCourseAuthor[]
  modules: RawModule[]
  course_skills: RawCourseSkill[]
  course_enrollments: RawEnrollmentEmbed[]
}

interface RawEnrollmentRow {
  progress: number
  status: EnrollmentStatus
  enrolled_at: string
  courses: RawCourse
}

const LessonBlockSchema = z.object({
  id: z.string(),
  type: z.enum([
    'text',
    'heading',
    'image',
    'video',
    'callout',
    'divider',
    'code',
    'code-exercise',
    'file-upload',
    'quiz',
  ]),
}).loose()

function parseLessonBlocks(blocks: unknown): LessonBlock[] {
  if (!Array.isArray(blocks))
    return []
  return blocks
    .filter(block => LessonBlockSchema.safeParse(block).success)
    .map(block => block as LessonBlock)
}

interface DynamicJoins {
  authorJoin: string
  skillsJoin: string
  skillsInner: string
}

function buildDynamicJoins(params: { authorId?: string, skill?: string }): DynamicJoins {
  return {
    authorJoin: params.authorId ? 'course_authors!inner' : 'course_authors',
    skillsJoin: params.skill ? 'course_skills!inner' : 'course_skills',
    skillsInner: params.skill ? 'skills!inner (*)' : 'skills (*)',
  }
}

interface SortConfig {
  column: string
  ascending: boolean
}

const SORT_MAP: Record<string, SortConfig> = {
  date_desc: { column: 'created_at', ascending: false },
  date_asc: { column: 'created_at', ascending: true },
  title_asc: { column: 'title', ascending: true },
  title_desc: { column: 'title', ascending: false },
  popularity: { column: 'enrolled_count', ascending: false },
}

function mapCourseData(course: RawCourse): CourseWithDetails {
  return {
    ...course,
    authors: course.course_authors?.map(ca => ca.user).filter(Boolean) as User[],
    skills: course.course_skills?.map(cs => cs.skills).filter(Boolean) as Skill[],
    modules: course.modules?.map(m => ({
      ...m,
      lessons: m.lessons?.map(l => ({
        ...l,
        blocks: parseLessonBlocks(l.blocks),
      })) ?? [],
    })) ?? [],
  }
}

export interface GetCoursesParams extends CourseWithDetailsQuery {}

async function getAllCoursesFromSystem(
  params: CourseWithDetailsQuery,
  supabase: SupabaseClient<Database>,
): Promise<CourseWithDetails[]> {
  const { authorId, search, limit = 10, offset = 0, sort, skill } = params
  const { authorJoin, skillsJoin, skillsInner } = buildDynamicJoins({ authorId, skill })

  let query = supabase.from('courses').select(
    `
      *,
      ${authorJoin} ( user (*) ),
      modules ( *, lessons (*) ),
      ${skillsJoin} ( ${skillsInner} ),
      course_enrollments!left ( progress, status, enrolled_at, user_id )
    `,
    { count: 'exact' },
  )

  if (search)
    query = query.ilike('title', `%${search}%`)
  if (authorId)
    query = query.eq('course_authors.user_id', authorId)
  if (skill)
    query = query.eq('course_skills.skills.name', skill)

  const sortConfig = SORT_MAP[sort || 'date_desc'] || SORT_MAP.date_desc
  query = query
    .order(sortConfig.column, { ascending: sortConfig.ascending })
    .order('order_index', { referencedTable: 'modules', ascending: true })
    .order('order_index', { referencedTable: 'modules.lessons', ascending: true })
    .order('order_index', { referencedTable: 'course_skills', ascending: true })
    .range(offset, offset + limit - 1)

  const { data, error } = await query as { data: RawCourse[] | null, error: Error | null }
  if (error)
    throw new Error(error.message)
  if (!data)
    return []

  return data.map(course => mapCourseData(course))
}

async function getUserEnrolledCourses(
  params: CourseWithDetailsQuery,
  supabase: SupabaseClient<Database>,
): Promise<CourseWithDetails[]> {
  const { userId, authorId, status, search, limit = 10, offset = 0, sort, skill } = params
  const { authorJoin, skillsJoin, skillsInner } = buildDynamicJoins({ authorId, skill })

  let query = supabase
    .from('course_enrollments')
    .select(
      `
        progress, status, enrolled_at,
        courses!inner (
          *,
          ${authorJoin} ( user (*) ),
          modules ( *, lessons (*) ),
          ${skillsJoin} ( ${skillsInner} )
        )
      `,
    )
    .eq('user_id', userId ?? '')

  // Status filter
  if (status === 'not_started')
    query = query.or('progress.is.null,progress.eq.0')
  else if (status === 'in_progress')
    query = query.gt('progress', 0).lt('progress', 100)
  else if (status === 'completed')
    query = query.eq('status', 'completed')

  // Relation filters
  if (search)
    query = query.ilike('courses.title', `%${search}%`)
  if (authorId)
    query = query.eq('courses.course_authors.user_id', authorId)
  if (skill)
    query = query.eq('courses.course_skills.skills.name', skill)

  // Sorting
  switch (sort) {
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
    default:
      query = query.order('enrolled_at', { ascending: false })
  }

  query = query
    .order('order_index', { referencedTable: 'courses.modules', ascending: true })
    .order('order_index', { referencedTable: 'courses.modules.lessons', ascending: true })
    .range(offset, offset + limit - 1)

  const { data, error } = await query as { data: RawEnrollmentRow[] | null, error: Error | null }
  if (error)
    throw new Error(error.message)
  if (!data)
    return []

  return data.map(enrollment => mapCourseData(enrollment.courses))
}

export async function getCourses(
  params: GetCoursesParams,
  supabase: SupabaseClient<Database>,
): Promise<CourseWithDetails[]> {
  const tab = params.tab ?? 'all'

  const normalizedParams: GetCoursesParams = tab === 'my'
    ? params
    : { ...params, status: 'all' }

  switch (tab) {
    case 'my': {
      if (!normalizedParams.userId) {
        throw new Error('userId required for my courses')
      }
      return await getUserEnrolledCourses(normalizedParams, supabase)
    }

    case 'all':
    case 'new':
    case 'recommended':
    default:
      return await getAllCoursesFromSystem(normalizedParams, supabase)
  }
}
