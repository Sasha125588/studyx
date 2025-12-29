import type { CourseWithDetails } from '@studyx/types'
import { BookOpenIcon, FlaskConicalIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { CourseProgress } from './CourseProgress'
import { getInitials } from '@/shared/helpers/user'

export interface CourseSidebarProps {
	course: CourseWithDetails
	isEnrolled?: boolean
	completedLessons?: number
}

export const CourseSidebar = ({
	course,
	isEnrolled = false,
	completedLessons = 0
}: CourseSidebarProps) => {
	const modules = course.modules ?? []
	const authors = course.authors ?? []

	const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
	const totalLectures = modules.reduce(
		(acc, m) => acc + (m.lessons?.filter(l => l.type !== 'practical').length || 0),
		0
	)
	const totalPractical = modules.reduce(
		(acc, m) => acc + (m.lessons?.filter(l => l.type === 'practical').length || 0),
		0
	)

	const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

	return (
		<aside className='sticky top-24 space-y-4'>
			{/* Статистика курсу */}
			<Card className='p-6'>
				<h3 className='mb-4 font-semibold'>Статистика курсу</h3>

				{/* Круговий прогрес */}
				<div className='mb-6 flex justify-center'>
					<CourseProgress
						value={progress}
						completedLessons={completedLessons}
						totalLessons={totalLessons}
					/>
				</div>

				{/* Деталі */}
				<div className='space-y-3 text-sm'>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground flex items-center gap-2'>
							<BookOpenIcon className='h-4 w-4' />
							Лекції
						</span>
						<span className='font-medium'>{totalLectures}</span>
					</div>
					<div className='flex items-center justify-between'>
						<span className='text-muted-foreground flex items-center gap-2'>
							<FlaskConicalIcon className='h-4 w-4' />
							Практичні
						</span>
						<span className='font-medium'>{totalPractical}</span>
					</div>

					<Separator />

					<div className='flex justify-between'>
						<span className='text-muted-foreground'>Модулів</span>
						<span className='font-medium'>{modules.length}</span>
					</div>
				</div>

				{/* CTA */}
				<Button
					className='mt-6 w-full'
					size='lg'
				>
					{isEnrolled ? 'Продовжити навчання' : 'Записатись на курс'}
				</Button>
			</Card>

			{/* Автори */}
			{authors.length > 0 && (
				<Card className='p-4'>
					<h3 className='text-muted-foreground text-sm font-semibold'>Автори курсу</h3>
					<div className='space-y-3'>
						{authors.map(author => (
							<div
								key={author.id}
								className='flex items-center gap-3'
							>
								<Avatar className='h-10 w-10'>
									<AvatarImage src={author.image ?? undefined} />
									<AvatarFallback className='bg-primary/10 text-primary'>
										{getInitials(author.name)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className='font-medium'>{author.name}</p>
									{author.email && <p className='text-muted-foreground text-xs'>{author.email}</p>}
								</div>
							</div>
						))}
					</div>
				</Card>
			)}
		</aside>
	)
}
