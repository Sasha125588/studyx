'use client'

import type { LessonProgress, ModuleWithLessons, RoadmapPosition } from '@studyx/types'
import type { NodePosition } from '@studyx/types'
import {
	Background,
	Controls,
	type Node,
	type NodeTypes,
	ReactFlow,
	useEdgesState,
	useNodesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useMemo } from 'react'

import { LessonNode, ModuleNode } from './nodes'
import { transformCourseToFlow } from './utils/transformCourseToFlow'
import { saveRoadmapPosition } from '@/shared/api/requests/roadmap-positions'

const nodeTypes: NodeTypes = {
	lesson: LessonNode,
	module: ModuleNode
}

export interface CourseRoadmapProps {
	courseId: number
	modules: ModuleWithLessons[]
	lessonsProgress?: LessonProgress[]
	savedPositions: RoadmapPosition[]
}

export const CourseRoadmap = ({
	courseId,
	modules,
	lessonsProgress = [],
	savedPositions
}: CourseRoadmapProps) => {
	const key = `${courseId}-${modules.map(m => m.id).join('-')}`

	return (
		<div className='bg-muted/30 h-[600px] w-full overflow-hidden rounded-2xl border dark:border-zinc-800 dark:bg-zinc-950'>
			<CourseRoadmapInner
				key={key}
				courseId={courseId}
				modules={modules}
				lessonsProgress={lessonsProgress}
				savedPositions={savedPositions}
			/>
		</div>
	)
}

const CourseRoadmapInner = ({
	courseId,
	modules,
	lessonsProgress = [],
	savedPositions
}: CourseRoadmapProps) => {
	const {
		nodes: initialNodes,
		edges: initialEdges,
		bounds
	} = useMemo(
		() => transformCourseToFlow(modules, { lessonsProgress, savedPositions }),
		[modules, lessonsProgress, savedPositions]
	)

	const [nodes, , onNodesChange] = useNodesState(initialNodes)
	const [edges, , onEdgesChange] = useEdgesState(initialEdges)

	const handleNodeDragStop = useCallback(
		async (_event: React.MouseEvent, node: Node) => {
			const nodeType = node.type as 'module' | 'lesson'
			const nodeIdMatch = node.id.match(/^(module|lesson)-(\d+)$/)

			if (!nodeIdMatch) return

			const nodeId = parseInt(nodeIdMatch[2])

			const position: NodePosition = {
				nodeType,
				nodeId,
				positionX: node.position.x,
				positionY: node.position.y
			}

			try {
				await saveRoadmapPosition(courseId, position)
			} catch (error) {
				console.error('Failed to save position:', error)
			}
		},
		[courseId]
	)

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onNodeDragStop={handleNodeDragStop}
			nodeTypes={nodeTypes}
			fitView
			fitViewOptions={{
				padding: 0.2,
				maxZoom: 1
			}}
			minZoom={0.5}
			maxZoom={1.2}
			translateExtent={bounds}
			nodeExtent={bounds}
			proOptions={{ hideAttribution: true }}
			nodesDraggable
			nodesConnectable={false}
			elementsSelectable
			panOnScroll
			zoomOnScroll
			selectNodesOnDrag={false}
		>
			<Background
				color='currentColor'
				gap={24}
				size={1}
				className='text-border opacity-60'
			/>
			<Controls
				showInteractive={false}
				className='bg-card! [&>button]:border-border! [&>button]:text-muted-foreground! [&>button:hover]:bg-muted! rounded-xl! border! [&>button]:bg-transparent!'
			/>
		</ReactFlow>
	)
}
