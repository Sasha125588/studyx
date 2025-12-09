import { PlayIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import type { CourseWithModules } from '@/generated/entities.types'

interface RecentCoursesItemProps {
	course: CourseWithModules
}

const getNextLesson = (course: CourseWithModules) => {
	if (!course.modules || course.modules.length === 0) return null

	for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
		const CourseModule = course.modules[moduleIndex]
		if (CourseModule.lessons && CourseModule.lessons.length > 0) {
			const firstLesson = CourseModule.lessons[0]
			return {
				type: firstLesson.type || 'lesson',
				title: firstLesson.title,
				moduleName: CourseModule.name,
				moduleNumber: moduleIndex + 1,
				lessonNumber: 1,
				totalLessons: CourseModule.lessons.length
			}
		}
	}

	return null
}

export const RecentCoursesItem = ({ course }: RecentCoursesItemProps) => {
	const nextLesson = getNextLesson(course)

	return (
		<Card className='group flex h-full flex-col justify-between rounded-[20px] border shadow-xs transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md'>
			<CardHeader>
				<CardDescription className='text-sm font-medium text-slate-500'>
					{course.title?.slice(0, 64)}
					{course.title?.length && course.title?.length > 64 && '...'}
				</CardDescription>
				<CardTitle className='text-lg leading-tight font-semibold text-slate-900'>
					{nextLesson?.title?.slice(0, 48) ?? 'Продовжити модуль'}
					{nextLesson?.title && nextLesson.title.length > 48 && '...'}
				</CardTitle>
			</CardHeader>
			<CardFooter>
				<CardAction className='flex items-center justify-between gap-2.5'>
					<Button
						asChild
						size='sm'
						className='size-9 rounded-full'
					>
						<Link href={`/courses/${course.slug}`}>
							<PlayIcon
								size={14}
								fill='currentColor'
								className='size-3.5 text-white'
							/>
						</Link>
					</Button>
					<p className='text-[13px] font-medium text-slate-500'>
						{nextLesson
							? `${nextLesson.moduleName ?? 'Модуль'} • Заняття ${nextLesson.lessonNumber} з ${nextLesson.totalLessons}`
							: 'Модуль — • Заняття —'}
					</p>
				</CardAction>
			</CardFooter>
		</Card>
	)
}
