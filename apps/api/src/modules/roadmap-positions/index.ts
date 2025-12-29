import { Elysia } from 'elysia'

import { RoadmapPositionsModel } from './model'
import { RoadmapPositionsService } from './service'

export const roadmapPositions = new Elysia({ prefix: '/roadmap-positions' })
	.use(RoadmapPositionsModel)

	.get(
		'/:courseId',
		({ params, headers }) =>
			RoadmapPositionsService.getPositions(headers['x-user-id']!, Number(params.courseId)),
		{
			params: 'params.courseId'
		}
	)

	.post(
		'/',
		({ body, headers }) =>
			RoadmapPositionsService.savePosition(
				headers['x-user-id']!,
				body.courseId,
				body.nodeType,
				body.nodeId,
				body.positionX,
				body.positionY
			),
		{
			body: 'body.save'
		}
	)

	.delete(
		'/:courseId',
		({ params, headers }) =>
			RoadmapPositionsService.resetPositions(headers['x-user-id']!, Number(params.courseId)),
		{
			params: 'params.courseId'
		}
	)
