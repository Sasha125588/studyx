import { Elysia, t } from 'elysia'

export const RoadmapPositionsModel = new Elysia({ name: 'Model.RoadmapPositions' }).model({
	'params.courseId': t.Object({
		courseId: t.String()
	}),
	'body.save': t.Object({
		courseId: t.Number(),
		nodeType: t.Union([t.Literal('module'), t.Literal('lesson')]),
		nodeId: t.Number(),
		positionX: t.Number(),
		positionY: t.Number()
	}),
	headers: t.Object({
		'x-user-id': t.String()
	})
})
