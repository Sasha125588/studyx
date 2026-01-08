import { Elysia, t } from 'elysia'

export const RoadmapPositionsModel = new Elysia({ name: 'Model.RoadmapPositions' }).model({
	'params.courseId': t.Object({
		courseId: t.String()
	}),
	'query.get.roadmap-positions': t.Object({
		userId: t.String(),
		courseId: t.Number()
	}),
	'body.save': t.Object({
		userId: t.String(),
		courseId: t.Number(),
		nodeType: t.Union([t.Literal('module'), t.Literal('lesson')]),
		nodeId: t.Number(),
		positionX: t.Number(),
		positionY: t.Number()
	})
})
