/* eslint-disable style/max-len */
import type { Database, Tables } from '../db'

import type { LessonBlock } from './blocks'

export type User = Tables<'user'>

export type Course = Database['public']['Tables']['courses']['Row']

export type CourseEnrollment = Database['public']['Tables']['course_enrollments']['Row']
export type EnrollmentStatus = Database['public']['Enums']['enrollment_status']
export const EnrollmentStatuses = {
  ENROLLED: 'enrolled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const satisfies Record<Uppercase<EnrollmentStatus>, EnrollmentStatus>

export type Skill = Database['public']['Tables']['skills']['Row']

export type Module = Database['public']['Tables']['modules']['Row']

export type LessonDB = Database['public']['Tables']['lessons']['Row']

export type Lesson = Omit<LessonDB, 'blocks'> & {
  blocks: LessonBlock[]
}

export type LessonType = Database['public']['Enums']['lesson']
export const LessonTypes = {
  LECTURE: 'lecture',
  PRACTICAL: 'practical',
  TEST: 'test',
} as const satisfies Record<Uppercase<LessonType>, LessonType>

export type LessonAttachment = Database['public']['Tables']['lesson_attachments']['Row']

export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row']

export type RoadmapPosition = Database['public']['Tables']['roadmap_positions']['Row']
export type RoadmapNodeType = 'module' | 'lesson'
export interface NodePosition {
  nodeType: RoadmapNodeType
  nodeId: number
  positionX: number
  positionY: number
}

export type UploadedFile = Database['public']['Tables']['uploaded_files']['Row']

export type BlockSubmissionDB = Database['public']['Tables']['block_submissions']['Row']

export type SubmissionType = Database['public']['Enums']['submission_type']
export const SubmissionTypes = {
  CODE: 'code',
  FILE: 'file',
  QUIZ: 'quiz',
} as const satisfies Record<Uppercase<SubmissionType>, SubmissionType>
