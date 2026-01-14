/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Button } from '@studyx/ui/base'
import { BookOpenIcon, EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'

const LessonsPage = async () => {
	// const { data: lessons } = await api.lessons.get()
	const getLessonsResponse = await fetch('http://localhost:3024/api/lessons')

	const lessonsData = await getLessonsResponse.json()

	const groupedLessons = (lessonsData ?? []).reduce((acc: any, lesson: any) => {
		const courseModule = lesson.modules
		if (!courseModule) return acc

		const course = courseModule.courses
		if (!course) return acc

		const courseKey = course.id
		const moduleKey = courseModule.id

		if (!acc[courseKey]) {
			acc[courseKey] = {
				course,
				modules: {}
			}
		}

		if (!acc[courseKey].modules[moduleKey]) {
			acc[courseKey].modules[moduleKey] = {
				module: courseModule,
				lessons: []
			}
		}

		acc[courseKey].modules[moduleKey]?.lessons?.push(lesson)
		return acc
	}, {})

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>Уроки</h1>
					<p className='text-muted-foreground mt-1'>Управління уроками курсів</p>
				</div>
				<Link href='/lessons/new'>
					<Button>
						<PlusIcon className='mr-2 h-4 w-4' />
						Створити урок
					</Button>
				</Link>
			</div>

			{Object.keys(groupedLessons).length === 0 ? (
				<div className='bg-card rounded-xl border p-12 text-center'>
					<BookOpenIcon className='text-muted-foreground mx-auto h-12 w-12' />
					<h2 className='mt-4 text-xl font-semibold'>Уроків ще немає</h2>
					<p className='text-muted-foreground mt-2'>Створіть перший урок для вашого курсу</p>
					<Link
						href='/lessons/new'
						className='mt-4 inline-block'
					>
						<Button>
							<PlusIcon className='mr-2 h-4 w-4' />
							Створити урок
						</Button>
					</Link>
				</div>
			) : (
				<div className='space-y-8'>
					{(Object.values(groupedLessons) as any[]).map(({ course, modules }) => (
						<div
							key={course.id}
							className='space-y-4'
						>
							<h2 className='border-b pb-2 text-xl font-semibold'>{course.title}</h2>

							{(Object.values(modules) as any[]).map(({ module, lessons: moduleLessons }) => (
								<div
									key={module.id}
									className='bg-card rounded-xl border'
								>
									<div className='border-b px-4 py-3'>
										<h3 className='font-medium'>{module.name}</h3>
									</div>

									<div className='divide-y'>
										{moduleLessons?.map((lesson: any) => (
											<div
												key={lesson.id}
												className='flex items-center justify-between px-4 py-3'
											>
												<div className='flex items-center gap-3'>
													<div className='bg-muted flex h-8 w-8 items-center justify-center rounded-lg'>
														<BookOpenIcon className='h-4 w-4' />
													</div>
													<div>
														<p className='font-medium'>{lesson.title}</p>
														<p className='text-muted-foreground text-sm'>
															/{course.slug}/{lesson.slug}
														</p>
													</div>
												</div>

												<div className='flex items-center gap-3'>
													<LessonTypeBadge type={lesson.type} />

													<div className='flex gap-1'>
														<Link href={`/lessons/${lesson.id}/edit`}>
															<Button
																variant='ghost'
																size='icon'
															>
																<EditIcon className='h-4 w-4' />
															</Button>
														</Link>
														<Button
															variant='ghost'
															size='icon'
															className='text-destructive hover:text-destructive'
														>
															<Trash2Icon className='h-4 w-4' />
														</Button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

const LessonTypeBadge = ({ type }: { type: string | null }) => {
	switch (type) {
		case 'lecture':
			return <Badge variant='secondary'>Лекція</Badge>
		case 'practical':
			return <Badge variant='default'>Практична</Badge>
		case 'test':
			return <Badge variant='destructive'>Тест</Badge>
		default:
			return <Badge variant='outline'>Невідомо</Badge>
	}
}

export default LessonsPage

export const dynamic = 'force-dynamic'
