import { Elysia } from 'elysia'

import { RoadmapPositionsModel } from './model'
import { RoadmapPositionsService } from './service'

export const roadmapPositions = new Elysia({ prefix: '/roadmap-positions' })
	.use(RoadmapPositionsModel)
	.decorate('roadmapPositionsService', null as unknown as RoadmapPositionsService)

	.get(
		'/',
		({ query, roadmapPositionsService }) =>
			roadmapPositionsService.getPositions(query.userId, query.courseId),
		{
			query: 'query.get.roadmap-positions'
		}
	)

	.post(
		'/',
		({ body, roadmapPositionsService }) =>
			roadmapPositionsService.savePosition(
				body.userId,
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
		({ params, roadmapPositionsService }) =>
			roadmapPositionsService.resetPositions(Number(params.courseId)),
		{
			params: 'params.courseId'
		}
	)
