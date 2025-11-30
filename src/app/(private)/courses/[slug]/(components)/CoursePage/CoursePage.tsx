import { MessageCircleQuestionIcon } from 'lucide-react'
import Link from 'next/link'

import {
	Tooltip,
	TooltipPanel,
	TooltipTrigger
} from '@/components/animate-ui/components/base/tooltip'
import { I18nText } from '@/components/common/I18nText/I18nText'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CourseContent } from './components/CourseContent/CourseContent'
import { CourseStats } from './components/CourseStats/CourseStats'
import type { CourseWithModules } from '@/generated/entities.types'
import { getCourseAuthors } from '@/shared/helpers'

interface CoursePageMainProps {
	course: CourseWithModules
}

export const CoursePageMain = ({ course }: CoursePageMainProps) => (
	<div className='space-y-8'>
		<Card>
			<CardHeader className='flex items-center justify-between'>
				<CardTitle>
					<h3 className='text-3xl font-semibold'>{course.title}</h3>
				</CardTitle>
				<Tooltip>
					<TooltipTrigger className='border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center rounded-md border'>
						<MessageCircleQuestionIcon className='h-4 w-4' />
					</TooltipTrigger>
					<TooltipPanel
						side='left'
						className='px-2 py-1 text-[13px]'
					>
						<Link
							href={course.edu_program ?? ''}
							target='_blank'
						>
							<p className='hover:underline'>Освітня програма</p>
						</Link>
					</TooltipPanel>
				</Tooltip>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div>{course.description}</div>
				<div>
					<p className='text-muted-foreground text-sm'>
						<I18nText path='authors' />
					</p>
					<p className='font-semibold text-blue-600'>{getCourseAuthors(course.course_authors)}</p>
				</div>
			</CardContent>
		</Card>
		<CourseStats modules={course.modules ?? []} />
		<CourseContent modules={course.modules ?? []} />
	</div>
)
