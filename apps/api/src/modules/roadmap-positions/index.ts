import { Elysia } from 'elysia'

import { RoadmapPositionsModel } from './model'
import { RoadmapPositionsService } from './service'

// userId гарантовано існує завдяки глобальному onBeforeHandle в index.ts
export const roadmapPositions = new Elysia({ prefix: '/roadmap-positions' })
	.use(RoadmapPositionsModel)

	// Отримати всі позиції для курсу
	.get(
		'/:courseId',
		({ params, headers }) =>
			RoadmapPositionsService.getPositions(headers['x-user-id']!, Number(params.courseId)),
		{
			params: 'roadmapPositions.params.courseId'
		}
	)

	// Зберегти кілька позицій одразу
	.post(
		'/batch',
		({ body, headers }) =>
			RoadmapPositionsService.savePositions(headers['x-user-id']!, body.courseId, body.positions),
		{
			body: 'roadmapPositions.body.saveBatch'
		}
	)

	// Зберегти одну позицію
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
			body: 'roadmapPositions.body.save'
		}
	)

	// Скинути всі позиції до дефолтних
	.delete(
		'/:courseId',
		({ params, headers }) =>
			RoadmapPositionsService.resetPositions(headers['x-user-id']!, Number(params.courseId)),
		{
			params: 'roadmapPositions.params.courseId'
		}
	)
