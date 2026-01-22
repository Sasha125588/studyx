'use client'

import type { Node, NodeProps } from '@xyflow/react'
import { memo } from 'react'

export interface ModuleNodeData {
  title: string
  moduleNumber: number
  lessonsCount: number
  completedCount: number
  [key: string]: unknown
}

export type ModuleNodeType = Node<ModuleNodeData, 'module'>

const ModuleNode = memo(({ data }: NodeProps<ModuleNodeType>) => {
  const { title, moduleNumber, lessonsCount, completedCount } = data
  const progress = lessonsCount > 0 ? Math.round((completedCount / lessonsCount) * 100) : 0

  return (
    <div className="h-full w-full rounded-2xl border-2 border-dashed border-violet-500/40 bg-violet-100/30 p-4 backdrop-blur-sm dark:bg-violet-950/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
            Модуль
            {' '}
            {moduleNumber}
          </span>
          <span className="text-violet-400/60 dark:text-violet-500/60">•</span>
          <span className="text-muted-foreground text-xs">
            {completedCount}
            /
            {lessonsCount}
            {' '}
            уроків
          </span>
        </div>
        {progress > 0 && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {progress}
            %
          </span>
        )}
      </div>
      <h3 className="text-foreground text-base font-semibold">{title}</h3>
    </div>
  )
})

ModuleNode.displayName = 'ModuleNode'

export { ModuleNode }
