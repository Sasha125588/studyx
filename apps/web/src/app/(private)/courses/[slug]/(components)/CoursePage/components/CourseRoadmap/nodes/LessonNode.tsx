'use client'

import type { Node, NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import { CheckCircle2Icon, FileTextIcon, FlaskConicalIcon } from 'lucide-react'
import { memo } from 'react'

export type LessonNodeData = {
	title: string
	type: 'lecture' | 'practical'
	isCompleted: boolean
	lessonNumber: number
}

export type LessonNodeType = Node<LessonNodeData, 'lesson'>

const LessonNode = memo(({ data }: NodeProps<LessonNodeType>) => {
	const { title, type, isCompleted, lessonNumber } = data

	const isPractical = type === 'practical'

	return (
		<div
			className={`relative w-[200px] rounded-xl border bg-zinc-900/90 px-4 py-3 shadow-lg transition-all duration-200 ${
				isCompleted ? 'border-emerald-500/50' : 'border-zinc-700/60 hover:border-zinc-500'
			} `}
		>
			<Handle
				type='target'
				position={Position.Top}
				className='h-2! w-2! border-none! bg-zinc-500!'
			/>

			<div className='flex items-center gap-3'>
				<div
					className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
						isCompleted
							? 'bg-emerald-500/20 text-emerald-400'
							: isPractical
								? 'bg-amber-500/15 text-amber-400'
								: 'bg-blue-500/15 text-blue-400'
					} `}
				>
					{isCompleted ? (
						<CheckCircle2Icon size={18} />
					) : isPractical ? (
						<FlaskConicalIcon size={18} />
					) : (
						<FileTextIcon size={18} />
					)}
				</div>

				<div className='min-w-0 flex-1'>
					<p
						className={`text-xs font-medium ${
							isCompleted
								? 'text-emerald-400/80'
								: isPractical
									? 'text-amber-400/80'
									: 'text-blue-400/80'
						}`}
					>
						{isPractical ? 'Практична' : 'Лекція'} {lessonNumber}
					</p>
					<p className='truncate text-sm font-medium text-zinc-100'>{title}</p>
				</div>
			</div>

			<Handle
				type='source'
				position={Position.Bottom}
				className='h-2! w-2! border-none! bg-zinc-500!'
			/>
		</div>
	)
})

LessonNode.displayName = 'LessonNode'

export { LessonNode }
