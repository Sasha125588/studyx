import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react'
import Link from 'next/link'

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/animate-ui/components/radix/tabs'
import { H2 } from '@/components/common/Typography/H2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'

import type { CourseWithModules } from '@/generated/entities.types'
import { getCoursesWithDetails } from '@/shared/api/requests/courses/getCoursesWithDetails'
import { getCourseAuthors } from '@/shared/helpers'

const countLessons = (course: CourseWithModules) =>
	course.modules?.reduce((total, module) => total + (module.lessons?.length ?? 0), 0) ?? 0

const formatDate = (value?: string | null) => {
	if (!value) return ''

	const date = new Date(value)

	return isNaN(date.getTime())
		? ''
		: date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' })
}

const EmptyState = ({ title, text }: { title: string; text: string }) => (
	<Card className='border-dashed border-slate-200 bg-white'>
		<CardContent className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
			<BookOpen className='size-9 text-slate-300' />
			<div className='space-y-1'>
				<p className='text-base font-semibold text-slate-900'>{title}</p>
				<p className='text-muted-foreground text-sm'>{text}</p>
			</div>
		</CardContent>
	</Card>
)

const getSkills = (course: CourseWithModules) =>
	(course.modules ?? [])
		.map(module => module.name)
		.filter(Boolean)
		.slice(0, 3) || []

const CourseCard = ({ course }: { course: CourseWithModules }) => {
	const moduleCount = course.modules?.length ?? 0
	const lessonsCount = countLessons(course)
	const courseHref = course.slug ? `/courses/${course.slug}` : ''
	const updatedAt = formatDate(course.created_at)
	const skills = getSkills(course)
	const authors = getCourseAuthors(course.course_authors)

	return (
		<Card className='group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_6px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-slate-300'>
			<div className='space-y-3'>
				<div className='text-[11px] font-semibold tracking-[0.08em] text-violet-600 uppercase'>
					Асинхронний
				</div>
				<div className='space-y-2'>
					<CardTitle className='text-xl font-semibold text-slate-900'>
						{course.title ?? 'Без назви'}
					</CardTitle>
					<CardDescription className='text-base leading-relaxed text-slate-600'>
						{course.description?.slice(0, 100) ?? 'Опис курсу з’явиться пізніше.'}
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
							Перейти
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

const CoursesPage = async () => {
	const { data: courses, error } = await getCoursesWithDetails()

	if (error) {
		return (
			<Card className='border-destructive/30 bg-destructive/5'>
				<CardContent className='text-destructive py-6'>
					Не вдалося завантажити курси. Спробуйте оновити сторінку.
				</CardContent>
			</Card>
		)
	}

	const courseList = (courses ?? []) as CourseWithModules[]
	const myCourses = courseList.filter((_, index) => index % 2 === 0)
	const newCourses = [...courseList].sort((a, b) => {
		if (!a.created_at || !b.created_at) return 0
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	})
	const recommendedCourses = courseList.filter((_, index) => index % 2 === 1)

	return (
		<div className='space-y-8'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div className='space-y-1'>
					<H2 className='text-slate-900'>Курси</H2>
					<p className='text-muted-foreground text-sm'>
						Оберіть курс, щоб перейти до модулів та матеріалів.
					</p>
				</div>
				<Button
					asChild
					variant='outline'
					className='rounded-full border-slate-200 px-5 text-slate-800'
				>
					<Link href='/'>Повернутися на дашборд</Link>
				</Button>
			</div>

			{!courseList.length ? (
				<EmptyState
					title='Курси ще не додані'
					text='Створіть перший курс або поверніться пізніше.'
				/>
			) : (
				<Tabs
					defaultValue='all'
					className='space-y-4'
				>
					<TabsList>
						<TabsTrigger value='all'>Всі курси</TabsTrigger>
						<TabsTrigger value='my'>Мої курси</TabsTrigger>
						<TabsTrigger value='new'>Нові</TabsTrigger>
						<TabsTrigger value='recommended'>Рекомендовані</TabsTrigger>
					</TabsList>

					<TabsContent value='all'>
						<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
							{courseList.map(course => (
								<CourseCard
									key={course.id}
									course={course}
								/>
							))}
						</div>
					</TabsContent>

					<TabsContent value='my'>
						{myCourses.length ? (
							<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
								{myCourses.map(course => (
									<CourseCard
										key={course.id}
										course={course}
									/>
								))}
							</div>
						) : (
							<EmptyState
								title='Немає курсів'
								text='Ви ще не додали жодного курсу до своїх.'
							/>
						)}
					</TabsContent>

					<TabsContent value='new'>
						<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
							{newCourses.map(course => (
								<CourseCard
									key={course.id}
									course={course}
								/>
							))}
						</div>
					</TabsContent>

					<TabsContent value='recommended'>
						{recommendedCourses.length ? (
							<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
								{recommendedCourses.map(course => (
									<CourseCard
										key={course.id}
										course={course}
									/>
								))}
							</div>
						) : (
							<EmptyState
								title='Рекомендацій поки немає'
								text='Додайте більше даних, щоб сформувати рекомендації.'
							/>
						)}
					</TabsContent>
				</Tabs>
			)}
		</div>
	)
}

export default CoursesPage
