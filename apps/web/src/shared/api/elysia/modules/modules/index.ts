import { Elysia } from 'elysia'

import { ModuleModel } from './model'
import { ModuleService } from './service'

export const modulesRoutes = new Elysia({ prefix: '/modules' })
	.use(ModuleModel)
	.decorate('moduleService', null as unknown as ModuleService)

	// Get module by id
	.get('/:id', ({ params, moduleService }) => moduleService.getById(params.id), {
		params: 'module.params.id'
	})

	// Get modules by course
	.get(
		'/course/:courseId',
		({ params, moduleService }) => moduleService.getByCourseId(params.courseId),
		{
			params: 'module.params.courseId'
		}
	)
