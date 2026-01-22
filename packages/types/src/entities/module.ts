import type { Lesson, Module } from './base'
import type { LessonNavItem } from './lesson'

export type ModuleWithLessons = Module & {
  lessons: Lesson[]
}

export interface ModuleNav {
  id: number
  name: string | null
  order_index: number
  lessons: LessonNavItem[]
}
