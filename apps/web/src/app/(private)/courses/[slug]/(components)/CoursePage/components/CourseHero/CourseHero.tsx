import type { CourseWithDetails } from '@studyx/types'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { getCourseAuthors } from '@/shared/helpers'

export interface CourseHeroProps {
	course: CourseWithDetails
	isEnrolled?: boolean
	progress?: number
}

export const CourseHero = ({ course, isEnrolled = false, progress = 0 }: CourseHeroProps) => {
	const authors = course.authors ?? []
	const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) ?? 0
	const totalModules = course.modules?.length ?? 0

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	return (
		<section className='relative mb-8'>
			<div className='mb-4 flex items-center gap-3'>
				{isEnrolled ? (
					progress > 0 ? (
						<Badge variant='success'>Проходжу зараз</Badge>
					) : (
						<Badge variant='info'>Записаний</Badge>
					)
				) : (
					<Badge variant='secondary'>Доступний</Badge>
				)}
			</div>

			<h1 className='text-3xl font-bold tracking-tight md:text-4xl'>{course.title}</h1>

			{course.description && (
				<p className='text-muted-foreground mt-4 max-w-4xl leading-relaxed'>{course.description}</p>
			)}

			<div className='mt-6 flex flex-wrap items-center gap-3 text-sm'>
				<div className='flex gap-1'>
					<p className='font-medium'>{totalModules}</p>
					<span className='text-muted-foreground'>Модулів</span>
				</div>

				<div className='bg-border h-5 w-px' />

				<div className='flex gap-1'>
					<p className='font-medium'>{totalLessons}</p>
					<span className='text-muted-foreground'>Уроків</span>
				</div>

				<div className='bg-border h-5 w-px' />

				<div className='flex items-center gap-1'>
					<span className='text-muted-foreground'>Викладачі</span>
					<div className='flex -space-x-2'>
						{authors.slice(0, 4).map(author => (
							<Avatar
								key={author.id}
								className='border-background h-8 w-8 border-2'
							>
								<AvatarImage src={author.image ?? undefined} />
								<AvatarFallback className='bg-primary/10 text-primary text-xs'>
									{getInitials(author.name)}
								</AvatarFallback>
							</Avatar>
						))}
						{authors.length > 4 && (
							<div className='border-background bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium'>
								+{authors.length - 4}
							</div>
						)}
					</div>
					{authors.length <= 2 && (
						<span className='text-primary font-medium'>{getCourseAuthors(authors)}</span>
					)}
				</div>
			</div>

			{course.edu_program && (
				<Link
					href={course.edu_program}
					target='_blank'
					className='text-primary mt-4 inline-flex items-center text-sm hover:underline'
				>
					Детальніше про програму
					<ExternalLinkIcon className='ml-1 h-3 w-3' />
				</Link>
			)}
		</section>
	)
}
