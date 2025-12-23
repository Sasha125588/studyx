import { Elysia, t } from 'elysia'

const NodePosition = t.Object({
	nodeType: t.Union([t.Literal('module'), t.Literal('lesson')]),
	nodeId: t.Number(),
	positionX: t.Number(),
	positionY: t.Number()
})

export const RoadmapPositionsModel = new Elysia({ name: 'Model.RoadmapPositions' }).model({
	'roadmapPositions.nodePosition': NodePosition,
	'roadmapPositions.params.courseId': t.Object({
		courseId: t.String()
	}),
	'roadmapPositions.body.save': t.Object({
		courseId: t.Number(),
		nodeType: t.Union([t.Literal('module'), t.Literal('lesson')]),
		nodeId: t.Number(),
		positionX: t.Number(),
		positionY: t.Number()
	}),
	'roadmapPositions.body.saveBatch': t.Object({
		courseId: t.Number(),
		positions: t.Array(NodePosition)
	}),
	'roadmapPositions.headers': t.Object({
		'x-user-id': t.String()
	})
})

export type NodePositionType = typeof NodePosition.static
