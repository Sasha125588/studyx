import { Elysia, t } from 'elysia'

import { supabase } from '../../lib/supabase'

export const coursesRoutes = new Elysia({ prefix: '/courses' })
	.get('/', async () => {
		const { data, error } = await supabase
			.from('courses')
			.select('*')
			.order('id', { ascending: true })

		if (error) throw new Error(error.message)
		return data
	})

	.get('/with-details', async () => {
		const { data, error } = await supabase
			.from('courses')
			.select(
				`
        *,
        course_authors (
          *,
          user:user (*)
        ),
        modules (
          *,
          lessons (*)
        )
      `
			)
			.order('id', { ascending: true })
			.order('order_index', { referencedTable: 'modules.lessons', ascending: true })

		if (error) throw new Error(error.message)
		return data
	})

	.get(
		'/:slug',
		async ({ params: { slug } }) => {
			const { data, error } = await supabase
				.from('courses')
				.select(
					`
        *,
        course_authors (
          *,
          user:user (*)
        ),
        modules (
          *,
          lessons (
            *,
            lesson_attachments (*)
          )
        )
      `
				)
				.eq('slug', slug)
				.order('order_index', { referencedTable: 'modules.lessons', ascending: true })
				.order('order_index', {
					referencedTable: 'modules.lessons.lesson_attachments',
					ascending: true
				})
				.single()

			if (error) throw new Error(error.message)
			return data
		},
		{
			params: t.Object({
				slug: t.String()
			})
		}
	)
