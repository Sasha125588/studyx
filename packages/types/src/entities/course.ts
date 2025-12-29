import type { Course, EnrollmentStatus, Module, Skill, User } from './base'
import type { ModuleWithLessons } from './module'

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
	modules: ModuleWithLessons[]
	authors: User[]
	skills: Skill[]
}
