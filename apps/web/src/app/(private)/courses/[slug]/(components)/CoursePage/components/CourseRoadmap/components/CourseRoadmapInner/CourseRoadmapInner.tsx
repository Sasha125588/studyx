'use client'

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
import { useCallback, useMemo } from 'react'

import type { CourseRoadmapProps } from '../../CourseRoadmap'
import { LessonNode, ModuleNode } from '../../nodes'
import { transformCourseToFlow } from '../../utils/transformCourseToFlow'

import { saveRoadmapPosition } from '@/shared/api/requests/roadmap-positions'

import '@xyflow/react/dist/style.css'

const nodeTypes: NodeTypes = {
	lesson: LessonNode,
	module: ModuleNode
}

export interface CourseRoadmapInnerProps extends CourseRoadmapProps {
	userId: string
}

export const CourseRoadmapInner = ({
	userId,
	courseId,
	modules,
	lessonsProgress = [],
	savedPositions
}: CourseRoadmapInnerProps) => {
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

			const nodeId = parseInt(nodeIdMatch[2]!)

			const position: NodePosition = {
				nodeType,
				nodeId,
				positionX: node.position.x,
				positionY: node.position.y
			}

			try {
				await saveRoadmapPosition(userId, courseId, position)
			} catch (error) {
				console.error('Failed to save position:', error)
			}
		},
		[userId, courseId]
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
