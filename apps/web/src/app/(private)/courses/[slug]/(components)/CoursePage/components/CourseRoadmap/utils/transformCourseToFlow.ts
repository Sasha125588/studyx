import type { LessonProgress, ModuleWithLessons, RoadmapPosition } from '@studyx/types'
import type { Edge, Node } from '@xyflow/react'

import type { LessonNodeData, ModuleNodeData } from '../nodes'

const LESSON_NODE_WIDTH = 200
const LESSON_NODE_HEIGHT = 70
const LESSONS_PER_ROW = 2
const HORIZONTAL_GAP = 50
const VERTICAL_GAP = 50
const MODULE_PADDING = 40
const MODULE_HEADER_HEIGHT = 90
const MODULE_VERTICAL_GAP = 80

type LessonNode = Node<LessonNodeData, 'lesson'>
type ModuleNode = Node<ModuleNodeData, 'module'>

export interface TransformOptions {
	lessonsProgress?: LessonProgress[]
	savedPositions?: RoadmapPosition[]
}

export type FlowBounds = [[number, number], [number, number]]

export const transformCourseToFlow = (
	modules: ModuleWithLessons[],
	options: TransformOptions = {}
) => {
	const { lessonsProgress = [], savedPositions = [] } = options

	const nodes: Node[] = []
	const edges: Edge[] = []

	let currentY = 0
	let maxWidth = 0

	modules.forEach((module, moduleIndex) => {
		const lessons = module.lessons || []
		const rows = Math.ceil(lessons.length / LESSONS_PER_ROW)

		const moduleWidth =
			LESSONS_PER_ROW * LESSON_NODE_WIDTH +
			(LESSONS_PER_ROW - 1) * HORIZONTAL_GAP +
			MODULE_PADDING * 2
		const moduleHeight =
			MODULE_HEADER_HEIGHT +
			rows * LESSON_NODE_HEIGHT +
			(rows - 1) * VERTICAL_GAP +
			MODULE_PADDING * 2

		const completedCount = lessons.filter(lesson =>
			lessonsProgress.some(p => p.lesson_id === lesson.id && p.completed)
		).length

		const defaultModulePosition = { x: 0, y: currentY }
		const modulePosition =
			findSavedPosition(savedPositions, 'module', module.id) ?? defaultModulePosition

		const moduleNode: ModuleNode = {
			id: `module-${module.id}`,
			type: 'module',
			position: modulePosition,
			data: {
				title: module.name || `Модуль ${moduleIndex + 1}`,
				moduleNumber: moduleIndex + 1,
				lessonsCount: lessons.length,
				completedCount
			},
			style: {
				width: moduleWidth,
				height: moduleHeight
			}
		}

		nodes.push(moduleNode)
		maxWidth = Math.max(maxWidth, moduleWidth)

		// Створюємо вузли уроків всередині модуля
		lessons.forEach((lesson, lessonIndex) => {
			const row = Math.floor(lessonIndex / LESSONS_PER_ROW)
			const col = lessonIndex % LESSONS_PER_ROW

			const defaultLessonPosition = {
				x: MODULE_PADDING + col * (LESSON_NODE_WIDTH + HORIZONTAL_GAP),
				y: MODULE_HEADER_HEIGHT + row * (LESSON_NODE_HEIGHT + VERTICAL_GAP)
			}

			const lessonPosition =
				findSavedPosition(savedPositions, 'lesson', lesson.id) ?? defaultLessonPosition

			const isCompleted = lessonsProgress.some(p => p.lesson_id === lesson.id && p.completed)

			const lessonNode: LessonNode = {
				id: `lesson-${lesson.id}`,
				type: 'lesson',
				position: lessonPosition,
				parentId: `module-${module.id}`,
				extent: 'parent',
				data: {
					title: lesson.title || `Урок ${lessonIndex + 1}`,
					slug: lesson.slug!,
					type: lesson.type === 'practical' ? 'practical' : 'lecture',
					isCompleted,
					lessonNumber: lessonIndex + 1
				}
			}

			nodes.push(lessonNode)

			// Створюємо зв'язок з попереднім уроком
			if (lessonIndex > 0) {
				const prevLesson = lessons[lessonIndex - 1]
				edges.push({
					id: `edge-lesson-${prevLesson.id}-${lesson.id}`,
					source: `lesson-${prevLesson.id}`,
					target: `lesson-${lesson.id}`,
					type: 'smoothstep',
					animated: !isCompleted,
					style: {
						stroke: isCompleted ? '#10b981' : '#52525b',
						strokeWidth: 2
					}
				})
			}
		})

		// Звʼязок між модулями (останній урок минулого модуля → перший унок наступного)
		if (moduleIndex > 0) {
			const prevModule = modules[moduleIndex - 1]
			const prevLessons = prevModule.lessons || []
			const currentLessons = module.lessons || []

			if (prevLessons.length > 0 && currentLessons.length > 0) {
				const lastLesson = prevLessons[prevLessons.length - 1]
				const firstLesson = currentLessons[0]

				edges.push({
					id: `edge-module-${prevModule.id}-${module.id}`,
					source: `lesson-${lastLesson.id}`,
					target: `lesson-${firstLesson.id}`,
					type: 'smoothstep',
					animated: true,
					style: {
						stroke: '#71717a',
						strokeWidth: 2,
						strokeDasharray: '6 4'
					}
				})
			}
		}

		currentY += moduleHeight + MODULE_VERTICAL_GAP
	})

	const horizontalSpace = 800
	const verticalPadding = 300
	const bounds: FlowBounds = [
		[-horizontalSpace, -verticalPadding],
		[maxWidth + horizontalSpace, currentY + verticalPadding]
	]

	return { nodes, edges, bounds }
}

const findSavedPosition = (
	savedPositions: RoadmapPosition[],
	nodeType: 'module' | 'lesson',
	nodeId: number
) => {
	const saved = savedPositions.find(p => p.node_type === nodeType && p.node_id === nodeId)
	if (!saved) {
		return null
	}

	return { x: saved.position_x, y: saved.position_y }
}
