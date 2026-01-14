import type { ContinueLearningCourse } from '@studyx/types'
import {
	Button,
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@studyx/ui/base'
import { PlayIcon } from 'lucide-react'
import Link from 'next/link'

interface RecentCoursesItemProps {
	course: ContinueLearningCourse
}

export const RecentCoursesItem = ({ course }: RecentCoursesItemProps) => (
	<Card className='group flex h-full flex-col justify-between border shadow-xs hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md'>
		<CardHeader>
			<CardDescription className='text-sm font-medium'>
				{course.title?.slice(0, 64)}
				{course.title?.length && course.title?.length > 64 && '...'}
			</CardDescription>
			<CardTitle className='text-lg leading-tight font-semibold'>
				{course.nextLesson?.title?.slice(0, 48) ?? 'Продовжити модуль'}
				{course.nextLesson?.title && course.nextLesson.title.length > 48 && '...'}
			</CardTitle>
		</CardHeader>
		<CardFooter>
			<CardAction className='flex items-center justify-between gap-2.5'>
				<Button
					asChild
					size='sm'
					className='size-9'
				>
					<Link href={`/courses/${course.slug}`}>
						<PlayIcon
							size={14}
							fill='currentColor'
							className='size-3.5'
						/>
					</Link>
				</Button>
				<p className='text-muted-foreground text-[13px] font-medium'>
					{course.nextLesson
						? `${course.nextLesson.moduleName ?? 'Модуль'} • Заняття ${course.nextLesson.number} з ${course.nextLesson.totalLessons}`
						: 'Модуль — • Заняття —'}
				</p>
			</CardAction>
		</CardFooter>
	</Card>
)
