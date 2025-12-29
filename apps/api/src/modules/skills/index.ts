import { Elysia } from 'elysia'

import { SkillModel } from './model'
import { SkillService } from './service'

export const skillsRoutes = new Elysia({ prefix: '/skills' })
	.use(SkillModel)

	.get('/', () => SkillService.getAll())

	.get('/:id/courses', ({ params }) => SkillService.getCoursesBySkill(params.id), {
		params: 'skill.params.id'
	})
