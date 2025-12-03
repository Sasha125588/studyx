import type { CourseWithModules } from '@/generated/entities.types'
import { createClient } from '@/lib/supabase/server'

export const getCourse = async (courseSlug: string) => {
	const db = await createClient()

	return await db
		.from('courses')
		.select(
			`
  *,
  course_authors (
    id,
    author_name,
    user:user (
      id,
      name,
      image
    )
  ),
  modules (
    *,
    lessons (
      *,
      lesson_attachments (
        *
      )
    )
  )
`
		)
		.eq('slug', courseSlug)
		.order('order_index', { referencedTable: 'modules.lessons', ascending: true })
		.order('order_index', {
			referencedTable: 'modules.lessons.lesson_attachments',
			ascending: true
		})
		.single<CourseWithModules>()
}
