import type { Database } from './database.types'

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseAuthor = Database['public']['Tables']['course_authors']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type LessonAttachment = Database['public']['Tables']['lesson_attachments']['Row']
export type User = Database['public']['Tables']['user']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']

export type ModuleWithLessons = Module & {
	lessons: Lesson[]
}

export type CourseAuthorWithUser = Pick<CourseAuthor, 'id' | 'author_name'> & {
	user: Pick<User, 'id' | 'name' | 'image'> | null
}

export type CourseWithModules = Course & {
	modules?: ModuleWithLessons[]
	course_authors?: CourseAuthorWithUser[]
}
