import type { Database } from './db'
import { Constants } from './db'

export type User = Database['public']['Tables']['user']['Row']

export type Account = Database['public']['Tables']['account']['Row']

export type Session = Database['public']['Tables']['session']['Row']

export type Verification = Database['public']['Tables']['verification']['Row']

export type Course = Database['public']['Tables']['courses']['Row']

export type CourseAuthor = Database['public']['Tables']['course_authors']['Row']

export type CourseEnrollment = Database['public']['Tables']['course_enrollments']['Row']
export type EnrollmentStatus = Database['public']['Enums']['enrollment_status']

export const EnrollmentStatuses = {
	ENROLLED: 'enrolled',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed'
} as const satisfies Record<string, EnrollmentStatus>

export const ENROLLMENT_STATUS_VALUES = Constants.public.Enums.enrollment_status

export type CourseSkill = Database['public']['Tables']['course_skills']['Row']

export type Skill = Database['public']['Tables']['skills']['Row']

export type Module = Database['public']['Tables']['modules']['Row']

export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonType = Database['public']['Enums']['lesson']

export type LessonAttachment = Database['public']['Tables']['lesson_attachments']['Row']

export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row']

export type RoadmapPosition = Database['public']['Tables']['roadmap_positions']['Row']
export type RoadmapNodeType = 'module' | 'lesson'

export type Group = Database['public']['Tables']['groups']['Row']

export type GroupMember = Database['public']['Tables']['group_members']['Row']

export type ContinueLearningCourse = {
	id: number
	title: string | null
	slug: string | null
	description: string | null
	progress: number
	status: EnrollmentStatus | null
	nextLesson: {
		id: number
		title: string | null
		moduleName: string | null
		number: number
		totalLessons: number
	} | null
}

export type CourseWithDetails = Course & {
	modules: (Module & {
		lessons: Lesson[]
	})[]
	authors: User[]
	skills: Skill[]
}

export type ModuleWithLessons = Module & {
	lessons: Lesson[]
}

export type LessonWithAttachments = Lesson & {
	attachments: LessonAttachment[]
}

export type LessonWithProgress = Lesson & {
	progress: LessonProgress | null
}

export type CourseEnrollmentWithCourse = CourseEnrollment & {
	course: Course
}

export type GroupWithMembers = Group & {
	members: (GroupMember & { user: User })[]
}

export type UserWithEnrollments = User & {
	enrollments: (CourseEnrollment & {
		course: Course
	})[]
}
