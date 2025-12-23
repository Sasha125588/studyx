import { Elysia } from 'elysia'

import { SkillModel } from './model'
import { SkillService } from './service'

export const skillsRoutes = new Elysia({ prefix: '/skills' })
	.use(SkillModel)

	// Get all skills
	.get('/', () => SkillService.getAll())

	// Get skill by slug
	.get('/slug/:slug', ({ params }) => SkillService.getBySlug(params.slug), {
		params: 'skill.params.slug'
	})

	// Get skill by id
	.get('/:id', ({ params }) => SkillService.getById(params.id), {
		params: 'skill.params.id'
	})

	// Get courses by skill
	.get('/:id/courses', ({ params }) => SkillService.getCoursesBySkill(params.id), {
		params: 'skill.params.id'
	})
