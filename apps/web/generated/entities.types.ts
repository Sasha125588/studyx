import type { Database } from './database.types'

export type User = Database['public']['Tables']['user']['Row']
export type UserInsert = Database['public']['Tables']['user']['Insert']
export type UserUpdate = Database['public']['Tables']['user']['Update']

export type Account = Database['public']['Tables']['account']['Row']
export type AccountInsert = Database['public']['Tables']['account']['Insert']
export type AccountUpdate = Database['public']['Tables']['account']['Update']

export type Session = Database['public']['Tables']['session']['Row']
export type SessionInsert = Database['public']['Tables']['session']['Insert']
export type SessionUpdate = Database['public']['Tables']['session']['Update']

export type Verification = Database['public']['Tables']['verification']['Row']
export type VerificationInsert = Database['public']['Tables']['verification']['Insert']
export type VerificationUpdate = Database['public']['Tables']['verification']['Update']

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']

export type CourseAuthor = Database['public']['Tables']['course_authors']['Row']
export type CourseAuthorInsert = Database['public']['Tables']['course_authors']['Insert']
export type CourseAuthorUpdate = Database['public']['Tables']['course_authors']['Update']

export type CourseEnrollment = Database['public']['Tables']['course_enrollments']['Row']
export type CourseEnrollmentInsert = Database['public']['Tables']['course_enrollments']['Insert']
export type CourseEnrollmentUpdate = Database['public']['Tables']['course_enrollments']['Update']

export type Module = Database['public']['Tables']['modules']['Row']
export type ModuleInsert = Database['public']['Tables']['modules']['Insert']
export type ModuleUpdate = Database['public']['Tables']['modules']['Update']

export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonInsert = Database['public']['Tables']['lessons']['Insert']
export type LessonUpdate = Database['public']['Tables']['lessons']['Update']
export type LessonType = Database['public']['Enums']['lesson']

export type LessonAttachment = Database['public']['Tables']['lesson_attachments']['Row']
export type LessonAttachmentInsert = Database['public']['Tables']['lesson_attachments']['Insert']
export type LessonAttachmentUpdate = Database['public']['Tables']['lesson_attachments']['Update']

export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row']
export type LessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert']
export type LessonProgressUpdate = Database['public']['Tables']['lesson_progress']['Update']

export type Group = Database['public']['Tables']['groups']['Row']
export type GroupInsert = Database['public']['Tables']['groups']['Insert']
export type GroupUpdate = Database['public']['Tables']['groups']['Update']

export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert']
export type GroupMemberUpdate = Database['public']['Tables']['group_members']['Update']

export type CourseAuthorWithUser = CourseAuthor & {
	user: User | null
}

export type CourseWithAuthor = Course & {
	authors: CourseAuthor[]
}

export type CourseWithModules = Course & {
	course_authors: CourseAuthorWithUser[]
	modules: (Module & {
		lessons: Lesson[]
	})[]
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

export type FullCourse = Course & {
	course_authors: CourseAuthorWithUser[]
	modules: (Module & {
		lessons: (Lesson & {
			attachments: LessonAttachment[]
		})[]
	})[]
}

export type UserWithEnrollments = User & {
	enrollments: (CourseEnrollment & {
		course: Course
	})[]
}

export const LessonTypes = {
	LECTURE: 'lecture' as const,
	PRACTICAL: 'practical' as const
}

export const EnrollmentStatuses = {
	ACTIVE: 'active' as const,
	COMPLETED: 'completed' as const,
	DROPPED: 'dropped' as const
} as const

export type EnrollmentStatus = (typeof EnrollmentStatuses)[keyof typeof EnrollmentStatuses]
