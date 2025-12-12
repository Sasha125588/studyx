import type { CourseEnrollment, CourseWithModules } from '@studyx/database'
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'

import { getCourseAuthors } from '@/shared/helpers'

interface CourseCardProps {
	course: CourseWithModules
	enrollment?: CourseEnrollment | null
}

const countLessons = (course: CourseWithModules) =>
	course.modules?.reduce((total, module) => total + (module.lessons?.length ?? 0), 0) ?? 0

const formatDate = (value?: string | null) => {
	if (!value) return ''

	const date = new Date(value)

	return isNaN(date.getTime())
		? ''
		: date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getSkills = (course: CourseWithModules) =>
	(course.modules ?? [])
		.map(module => module.name)
		.filter(Boolean)
		.slice(0, 3) || []

const getProgressStatus = (enrollment?: CourseEnrollment | null) => {
	if (!enrollment) return null

	const progress = enrollment.progress ?? 0

	if (enrollment.status === 'completed' || progress === 100) {
		return { label: 'Завершено', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' }
	}

	if (progress > 0) {
		return { label: `${progress}%`, icon: PlayCircle, color: 'text-violet-600 bg-violet-50' }
	}

	return { label: 'Не розпочато', icon: Clock, color: 'text-slate-500 bg-slate-50' }
}

export const CourseCard = ({ course, enrollment }: CourseCardProps) => {
	const moduleCount = course.modules?.length ?? 0
	const lessonsCount = countLessons(course)
	const courseHref = course.slug ? `/courses/${course.slug}` : ''
	const updatedAt = formatDate(course.created_at)
	const skills = getSkills(course)
	const authors = getCourseAuthors(course.course_authors)
	const progressStatus = getProgressStatus(enrollment)

	return (
		<Card className='group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_6px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300'>
			<div className='space-y-3'>
				<div className='flex items-center justify-between'>
					<div className='text-[11px] font-semibold tracking-[0.08em] text-violet-600 uppercase'>
						Асинхронний
					</div>
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
					<CardTitle className='text-xl font-semibold text-slate-900'>
						{course.title ?? 'Без назви'}
					</CardTitle>
					<CardDescription className='text-base leading-relaxed text-slate-600'>
						{course.description?.slice(0, 100) ?? "Опис курсу з'явиться пізніше."}
						{course.description && course.description.length > 100 && '...'}
					</CardDescription>
				</div>
				<div className='space-y-1'>
					<p className='text-xs font-semibold tracking-[0.06em] text-slate-500 uppercase'>
						Навички
					</p>
					<div className='flex flex-wrap gap-2'>
						{skills.length ? (
							skills.map(skill => (
								<span
									key={skill}
									className='rounded-sm border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700'
								>
									{skill}
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

			<CardFooter className='mt-6 flex items-center justify-between gap-3 px-0 pt-4'>
				<div className='text-muted-foreground space-y-1 text-xs'>
					<div className='flex items-center gap-2'>
						<BookOpen className='size-4 text-slate-400' />
						<span>
							{moduleCount} модулів • {lessonsCount} уроків
						</span>
					</div>
					{authors && <div className='font-medium text-slate-500'>Автори: {authors}</div>}
					{updatedAt && (
						<div className='flex items-center gap-1.5'>
							<CalendarDays className='size-4' />
							<span>Оновлено {updatedAt}</span>
						</div>
					)}
				</div>
				{courseHref ? (
					<Button
						asChild
						size='sm'
						variant='outline'
						className='rounded-full border-slate-200 px-4'
					>
						<Link href={courseHref}>
							{enrollment && enrollment.progress && enrollment.progress > 0
								? 'Продовжити'
								: 'Перейти'}
							<ArrowRight className='size-4' />
						</Link>
					</Button>
				) : (
					<Button
						size='sm'
						variant='outline'
						disabled
						className='rounded-full border-slate-200 px-4'
					>
						Недоступно
					</Button>
				)}
			</CardFooter>
		</Card>
	)
}
