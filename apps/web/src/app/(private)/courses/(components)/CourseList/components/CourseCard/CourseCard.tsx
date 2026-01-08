import type { CourseEnrollment, CourseWithDetails } from '@studyx/types'
import {
	ArrowRightIcon,
	BookOpenIcon,
	CalendarDaysIcon,
	CheckCircle2Icon,
	ClockIcon,
	PlayCircleIcon
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'

import { getCourseAuthors } from '@/shared/helpers'

interface CourseCardProps {
	course: CourseWithDetails
	enrollment?: CourseEnrollment | null
}

const countLessons = (course: CourseWithDetails) =>
	course.modules?.reduce((total, module) => total + (module.lessons?.length ?? 0), 0) ?? 0

const formatDate = (value?: string | null) => {
	if (!value) return ''

	const date = new Date(value)

	return isNaN(date.getTime())
		? ''
		: date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getSkills = (course: CourseWithDetails) => course.skills.map(skill => skill.name).slice(0, 4)

const getProgressStatus = (enrollment?: CourseEnrollment | null) => {
	if (!enrollment) return null

	const progress = enrollment.progress ?? 0

	if (enrollment.status === 'completed' || progress === 100) {
		return {
			label: 'Завершено',
			icon: CheckCircle2Icon,
			color:
				'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800'
		}
	}

	if (progress > 0) {
		return {
			label: `${progress}%`,
			icon: PlayCircleIcon,
			color:
				'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950 border border-violet-200 dark:border-violet-800'
		}
	}

	return {
		label: 'Не розпочато',
		icon: ClockIcon,
		color:
			'text-neutral-500 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800'
	}
}

export const CourseCard = ({ course, enrollment }: CourseCardProps) => {
	const moduleCount = course.modules?.length ?? 0
	const lessonsCount = countLessons(course)
	const courseHref = course.slug ? `/courses/${course.slug}` : ''
	const updatedAt = formatDate(course.created_at)
	const skills = getSkills(course)
	const authors = getCourseAuthors(course.authors)
	const progressStatus = getProgressStatus(enrollment)

	return (
		<Card className='group flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5'>
			<div className='space-y-3'>
				<div className='flex items-center justify-between'>
					{progressStatus && (
						<div
							className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${progressStatus.color}`}
						>
							<progressStatus.icon className='size-3.5' />
							{progressStatus.label}
						</div>
					)}
				</div>
				<div className='space-y-2'>
					<CardTitle className='text-xl font-semibold'>{course.title ?? 'Без назви'}</CardTitle>
					<CardDescription className='text-muted-foreground text-base leading-relaxed'>
						{course.description?.slice(0, 100) ?? "Опис курсу з'явиться пізніше."}
						{course.description && course.description.length > 100 && '...'}
					</CardDescription>
				</div>
				<div className='space-y-1'>
					<p className='text-xs font-semibold uppercase'>Навички</p>
					<div className='flex flex-wrap gap-2'>
						{skills.length ? (
							skills.map(skill => (
								<span
									key={skill}
									className='text-muted-foreground rounded-xs border px-2 py-1 text-xs font-semibold'
								>
									{skill?.slice(0, 30)}
									{skill && skill.length > 30 && '...'}
								</span>
							))
						) : (
							<span className='text-muted-foreground text-xs'>
								Додайте модулі, щоб бачити навички
							</span>
						)}
					</div>
				</div>
			</div>

			<CardFooter className='flex items-center justify-between gap-3 px-0'>
				<div className='text-muted-foreground space-y-1 text-xs'>
					<div className='flex items-center gap-2'>
						<BookOpenIcon className='size-4' />
						<span>
							{moduleCount} модулів • {lessonsCount} уроків
						</span>
					</div>
					{authors && <div className='text-muted-foreground font-medium'>Автори: {authors}</div>}
					{updatedAt && (
						<div className='flex items-center gap-1.5'>
							<CalendarDaysIcon className='size-4' />
							<span>Оновлено {updatedAt}</span>
						</div>
					)}
				</div>
				{courseHref ? (
					<Button
						asChild
						size='sm'
						className='px-4'
					>
						<Link href={courseHref}>
							{enrollment?.status === 'enrolled' ? 'Продовжити' : 'Перейти'}
							<ArrowRightIcon className='size-4' />
						</Link>
					</Button>
				) : (
					<Button
						size='sm'
						variant='outline'
						disabled
						className='px-4'
					>
						Недоступно
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}
