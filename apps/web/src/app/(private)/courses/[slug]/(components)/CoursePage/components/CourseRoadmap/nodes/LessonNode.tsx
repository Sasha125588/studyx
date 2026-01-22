'use client'

import type { LessonType } from '@studyx/types'
import type { Node, NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import { CheckCircle2Icon, FileTextIcon, FlaskConicalIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { memo } from 'react'

export interface LessonNodeData {
  title: string
  slug: string
  type: LessonType
  isCompleted: boolean
  lessonNumber: number
  [key: string]: unknown
}

export type LessonNodeType = Node<LessonNodeData, 'lesson'>

const LessonNode = memo(({ data }: NodeProps<LessonNodeType>) => {
  const { title, slug, type, isCompleted, lessonNumber } = data
  const params = useParams() as { slug: string }

  const isPractical = type === 'practical'

  return (
    <Link href={`/courses/${params.slug}/${slug}`}>
      <div
        className={`relative w-[200px] rounded-xl border px-4 py-3 shadow-lg transition-all duration-200 ${
          isCompleted
            ? 'border-emerald-500/50 bg-emerald-50 dark:bg-zinc-900/90'
            : 'border-border bg-card hover:border-primary/50 dark:border-zinc-700/60 dark:bg-zinc-900/90 dark:hover:border-zinc-500'
        } `}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="bg-muted-foreground! h-2! w-2! border-none!"
        />

        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : isPractical
                  ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                  : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
            } `}
          >
            {isCompleted
              ? (
                  <CheckCircle2Icon size={18} />
                )
              : isPractical
                ? (
                    <FlaskConicalIcon size={18} />
                  )
                : (
                    <FileTextIcon size={18} />
                  )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-xs font-medium ${
                isCompleted
                  ? 'text-emerald-600 dark:text-emerald-400/80'
                  : isPractical
                    ? 'text-violet-600 dark:text-violet-400/80'
                    : 'text-blue-600 dark:text-blue-400/80'
              }`}
            >
              {isPractical ? 'Практична' : 'Лекція'}
              {' '}
              {lessonNumber}
            </p>
            <p className="text-foreground truncate text-sm font-medium">{title}</p>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="bg-muted-foreground! h-2! w-2! border-none!"
        />
      </div>
    </Link>
  )
})

LessonNode.displayName = 'LessonNode'

export { LessonNode }
