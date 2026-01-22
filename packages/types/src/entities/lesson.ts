/* eslint-disable style/max-len */
import type { Course, Lesson, LessonAttachment, LessonProgress, LessonType, Module } from './base'
import type { ModuleNav } from './module'

export type LessonWithDetails = Lesson & {
  attachments: LessonAttachment[]
  progress: LessonProgress | null
}

export interface LessonNavItem {
  id: number
  title: string | null
  slug: string | null
  type: LessonType | null
  order_index: number
}

export interface LessonFullContext {
  lesson: LessonWithDetails
  module: Module
  course: Course
  moduleLessons: LessonNavItem[]
  allModules: ModuleNav[]
  navigation: {
    previous: LessonNavItem | null
    next: LessonNavItem | null
    currentIndex: number
    totalLessons: number
  }
}
