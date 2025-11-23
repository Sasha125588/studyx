import { MessageCircleQuestionIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { CourseContent } from './components/CourseContent/CourseContent'
import { CourseStats } from './components/CourseStats/CourseStats'
import type { Course, Lecture, Module, Practical } from '@/generated/entities.types'

export type ModuleWithRelations = Module & {
	lectures: Lecture[]
	practical: Practical[]
}

interface CoursePageMainProps {
	course: Course & {
		module: ModuleWithRelations[]
	}
}

export const CoursePageMain = ({ course }: CoursePageMainProps) => (
	<div className='space-y-8'>
		<Card>
			<CardHeader className='flex items-center justify-between'>
				<CardTitle>
					<h3 className='text-3xl font-semibold'>{course.name}</h3>
				</CardTitle>
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant='outline'>
								<MessageCircleQuestionIcon />
							</Button>
						</TooltipTrigger>
						<TooltipContent
							side='left'
							className='px-2 py-1 text-[13px]'
						>
							<Link
								href={course.edu_program ?? ''}
								target='_blank'
							>
								<p className='hover:underline'>Освітня програма</p>
							</Link>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div>{course.description}</div>
				<div>
					<p className='font-semibold text-blue-600'>
						{course.author?.map(author => author).join(', ')}
					</p>
				</div>
			</CardContent>
		</Card>
		<CourseStats modules={course.module} />
		<CourseContent modules={course.module} />
	</div>
)
