import db from '@/lib/supabase/client'

export const getCoursesWithDetails = async () =>
	await db
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
          *
        )
      )
    `
		)
		.order('id', { ascending: true })
		.order('order_index', { referencedTable: 'modules.lessons', ascending: true })
