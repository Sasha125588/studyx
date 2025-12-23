import { Elysia } from 'elysia'

import { ModuleModel } from './model'
import { ModuleService } from './service'

export const modulesRoutes = new Elysia({ prefix: '/modules' })
	.use(ModuleModel)

	// Get module by id
	.get('/:id', ({ params }) => ModuleService.getById(params.id), {
		params: 'module.params.id'
	})

	// Get modules by course
	.get('/course/:courseId', ({ params }) => ModuleService.getByCourseId(params.courseId), {
		params: 'module.params.courseId'
	})
