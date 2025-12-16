// import { formatDate } from 'date-fns'
import {
	AlarmClockCheckIcon,
	ChevronRightIcon,
	ClockIcon,
	MoreVerticalIcon,
	UserIcon,
	VideoIcon
} from 'lucide-react'
import Link from 'next/link'

import { I18nText } from '@/components/common/I18nText/I18nText'
import { H2 } from '@/components/common/Typography/H2'
import { H3 } from '@/components/common/Typography/H3'
import { MouseEffectCard } from '@/components/kokonut-ui/mouse-effect-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { LearningTimeChart } from './(components)/dashboard/LearningTimeChart/LearningTimeChart'
import { RecentCoursesList } from './(components)/dashboard/RecentCoursesList/RecentCoursesList'
import { StatsCards } from './(components)/dashboard/Stats/StatsCards'
import { getCoursesWithDetails } from '@/shared/api/requests/courses/getCoursesWithDetails'

const upcomingEvents = [
	{
		title: 'Live-сесія з куратором',
		time: 'Сьогодні, 19:00',
		action: 'Join'
	},
	{
		title: 'Груповий розбір ДЗ',
		time: 'Чт, 18:30',
		action: 'Details'
	}
]

const weeklyGoal = {
	targetHours: 6,
	doneHours: 3.5,
	streak: 5
}

const scheduleDays = [
	{ label: 'пн', day: '3', active: false, lessons: 3 },
	{ label: 'вт', day: '4', active: true, lessons: 4 },
	{ label: 'ср', day: '5', active: false, lessons: 2 },
	{ label: 'чт', day: '6', active: false, lessons: 0 },
	{ label: 'пт', day: '7', active: false, lessons: 1 },
	{ label: 'сб', day: '8', active: false, lessons: 0 },
	{ label: 'вс', day: '9', active: false, lessons: 0 }
]

const scheduleEvents = [
	{
		time: '8:00–9:20',
		type: 'practice',
		title: 'ООП',
		teacher: 'ст.в. Кирик Т.А.'
	},
	{
		time: '9:35–10:55',
		type: 'lecture',
		title: "Об'єктно-орієнтоване програмування",
		teacher: 'проф. Турбал Ю.В.'
	},
	{
		time: '11:10–12:30',
		type: 'lecture',
		title: 'Основи теорії сталого розвитку',
		teacher: 'проф. Сяська І.О. | Zoom: 821 078 9205 | Код: 2023',
		isOnline: true
	},
	{
		time: '12:45–14:05',
		type: 'lecture',
		title: 'Основи теорії сталого розвитку 2',
		teacher: 'проф. Сяська І.О. | Zoom: 821 078 9205 | Код: 2023',
		isOnline: true
	}
]

const nextEvent = upcomingEvents[0]

const currentPartOfDay = new Date().getHours()

const greeting =
	currentPartOfDay < 12 ? 'Добрий ранок' : currentPartOfDay < 18 ? 'Добрий день' : 'Добрий вечір'

const goalProgress = Math.min(
	100,
	Math.round((weeklyGoal.doneHours / weeklyGoal.targetHours) * 100)
)

const DashboardPage = async () => {
	const { data: continueCourses } = await getCoursesWithDetails()
	const safeContinueCourses = Array.isArray(continueCourses) ? continueCourses : []

	return (
		<div className='space-y-8'>
			<div className='grid gap-4 lg:grid-cols-2'>
				<MouseEffectCard maxDots={80}>
					<div className='space-y-3 py-1'>
						<H2>
							{greeting}, студенте <span className='pl-1'>👋</span>
						</H2>
						<p className='text-muted-foreground max-w-xl text-sm'>
							Продовжуйте навчання:{' '}
							{safeContinueCourses.length
								? `ще ${safeContinueCourses.length} курс(и/ів) чекають на вас.`
								: 'додайте свій перший курс та почніть прогресувати.'}
						</p>
						<div className='flex flex-wrap gap-3'>
							<Link href='/courses'>
								<Button className='cursor-pointer duration-300 ease-in-out'>
									Перейти до курсів
								</Button>
							</Link>
							<Button
								variant='outline'
								className='text-foreground cursor-pointer duration-300 ease-in-out'
							>
								Відкрити розклад
								<ChevronRightIcon size={16} />
							</Button>
						</div>
					</div>
				</MouseEffectCard>

				<div className='grid gap-4 sm:grid-cols-2'>
					<Card className='flex flex-col justify-center'>
						<CardContent className='p-4 py-0'>
							<p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
								Ціль тижня
							</p>
							<p className='text-2xl font-semibold'>
								{weeklyGoal.doneHours} / {weeklyGoal.targetHours} годин
							</p>
							<div className='bg-muted mt-3 h-2 w-full rounded-full'>
								<div
									className='h-2 rounded-full bg-violet-500 transition-all'
									style={{ width: `${goalProgress}%` }}
								/>
							</div>
							<p className='text-muted-foreground mt-2 text-xs font-medium'>
								Серія: {weeklyGoal.streak} днів підряд
							</p>
						</CardContent>
					</Card>
					<Card className='flex flex-col justify-center'>
						<CardContent className='p-4 py-0'>
							<p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
								Найближча подія
							</p>
							<p className='text-lg font-semibold'>{nextEvent.title}</p>
							<p className='text-muted-foreground text-sm'>{nextEvent.time}</p>
							<div className='mt-3 flex gap-2'>
								<Button
									size='sm'
									className='cursor-pointer px-4 duration-300 ease-in-out'
								>
									Приєднатись
								</Button>
								<Button
									size='sm'
									variant='outline'
									className='border-border cursor-pointer px-4 duration-300 ease-in-out'
								>
									Деталі
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<StatsCards />

			<div className='flex gap-4'>
				<div className='flex-1'>
					<LearningTimeChart />
					<div className='mt-6 space-y-4'>
						<div className='flex items-center justify-between'>
							<H3>
								<I18nText path='continueLearning' />
							</H3>
							<Link href='/courses'>
								<Button
									variant='outline'
									className='cursor-pointer duration-300 ease-in-out'
								>
									<ChevronRightIcon size={16} />
									<I18nText path='allCourses' />
								</Button>
							</Link>
						</div>
						<RecentCoursesList recentCourses={safeContinueCourses} />
					</div>
				</div>
				<Card className='flex w-[30%] flex-col justify-between'>
					<CardContent className='space-y-5'>
						<div className='flex items-center justify-between'>
							<H3>Розклад</H3>
							<Button
								variant='outline'
								className='cursor-pointer duration-300 ease-in-out'
							>
								<ChevronRightIcon size={16} />
								Детальніше
							</Button>
						</div>
						<div className='flex items-center justify-between pb-2'>
							{scheduleDays.map(day => (
								<button
									key={day.label}
									className={`flex h-[66px] w-[48px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-[1.5px] transition duration-300 ease-in-out ${
										day.active
											? 'border-violet-300 bg-violet-100 text-violet-700'
											: 'hover:border-violet-200 hover:bg-violet-50'
									}`}
								>
									<span className='text-[11px] font-medium uppercase'>{day.label}</span>
									<span
										className={`text-[28px] leading-none font-semibold ${
											day.active && 'text-violet-700'
										}`}
									>
										{day.day}
									</span>
									<div className='flex items-center gap-1'>
										{day.lessons > 0 &&
											Array.from({ length: day.lessons }).map((_, index) => (
												<span
													key={index}
													className='h-1 w-1 rounded-full bg-neutral-500'
												/>
											))}
									</div>
								</button>
							))}
						</div>
						<div className='flex flex-col divide-y'>
							{scheduleEvents.map(event => (
								<div
									key={event.title + event.time}
									className='flex flex-col gap-2 py-4'
								>
									<div className='flex items-start justify-between gap-3'>
										<div className='flex items-center gap-3'>
											<p className='text-xl leading-tight font-semibold'>{event.time}</p>
											<span
												className={`rounded-full px-3 py-1 text-[12px] font-medium ${
													event.type === 'qa'
														? 'bg-blue-50 text-blue-700'
														: event.type === 'lecture'
															? 'bg-emerald-50 text-emerald-700'
															: 'bg-rose-50 text-rose-700'
												}`}
											>
												{event.type === 'lecture'
													? 'Лекція'
													: event.type === 'practice' && 'Лабораторна'}
											</span>
											{event.isOnline && (
												<span className='flex items-center gap-1.5 rounded-full bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700'>
													<VideoIcon
														size={12}
														className='text-violet-600'
													/>
													Онлайн
												</span>
											)}
										</div>
										<MoreVerticalIcon size={18} />
									</div>
									<div className='text-foreground/90 flex items-center gap-2 text-[17px] font-medium'>
										<span>{event.title}</span>
									</div>
									<div className='text-muted-foreground flex items-center gap-2 text-[14px]'>
										<UserIcon size={16} />
										<span>{event.teacher}</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter className='flex flex-col gap-3 border-t'>
						{scheduleEvents.length > 0 && (
							<div className='flex w-full items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-3 dark:border-violet-900/20 dark:bg-violet-900/20'>
								<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100/90 text-violet-700'>
									<ClockIcon size={18} />
								</div>
								<div className='flex-1 space-y-1'>
									<p className='text-[13px] font-medium'>Наступне заняття</p>
									<p className='text-sm font-semibold'>
										{scheduleEvents[0].time} • {scheduleEvents[0].title}
									</p>
									<div className='text-muted-foreground flex items-center gap-2 text-[13px]'>
										<UserIcon size={14} />
										<span className='truncate'>{scheduleEvents[0].teacher}</span>
									</div>
								</div>
								<ChevronRightIcon className='h-4 w-4' />
							</div>
						)}
					</CardFooter>
				</Card>
			</div>

			<div className='grid h-40 gap-4 lg:grid-cols-3'>
				<Card className='lg:col-span-2'>
					<CardHeader className='pb-3'>
						<div className='flex items-center gap-2'>
							<AlarmClockCheckIcon className='size-5 text-violet-500' />
							<CardTitle className='text-lg font-semibold'>Мої завдання</CardTitle>
						</div>
					</CardHeader>
				</Card>
			</div>
		</div>
	)
}

export default DashboardPage
