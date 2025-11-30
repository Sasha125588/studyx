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
		<Card className='group relative gap-4 overflow-hidden rounded-lg py-5 transition-all hover:shadow-md'>
			<CardHeader className='px-5'>
				<CardDescription className='text-sm font-medium text-gray-500'>
					{course.title?.slice(0, 40)}
					{course.title?.length && course.title?.length > 40 && '...'}
				</CardDescription>
				<CardTitle className='text-lg leading-tight font-semibold text-gray-900'>
					{nextLesson?.title?.slice(0, 40)}
					{nextLesson?.title?.length && nextLesson?.title?.length > 40 && '...'}
				</CardTitle>
			</CardHeader>
			<CardFooter className='px-5'>
				<CardAction className='flex items-center gap-2.5'>
					<Link href={`/courses/${course.slug}`}>
						<Button
							className='size-9 cursor-pointer rounded-full'
							variant='default'
							size='icon'
						>
							<PlayIcon
								className='size-3 fill-white'
								strokeWidth={0}
							/>
						</Button>
					</Link>
					<div className='flex items-center gap-1'>
						<p className='text-sm font-semibold text-gray-900'>Продовжити</p>
						<span className='text-sm font-medium text-gray-500'>
							– {nextLesson?.moduleName}. Заняття {nextLesson?.lessonNumber} з{' '}
							{nextLesson?.totalLessons}
						</span>
					</div>
				</CardAction>
			</CardFooter>
		</Card>
	)
}
