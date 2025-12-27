import type { ModuleNav } from '@studyx/database'
import { CheckCircle2Icon, FileTextIcon, FlaskConicalIcon } from 'lucide-react'
import Link from 'next/link'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/animate-ui/radix/accordion'

import { cn } from '@/shared/helpers'

interface LessonSidebarProps {
	modules: ModuleNav[]
	currentLessonId: number
	courseSlug: string
	courseName: string | null
}

export const LessonSidebar = ({ modules, currentLessonId, courseSlug }: LessonSidebarProps) => {
	const currentModuleId = modules.find(m => m.lessons.some(l => l.id === currentLessonId))?.id

	return (
		<div className='space-y-4'>
			<Accordion
				type='multiple'
				defaultValue={currentModuleId ? [currentModuleId.toString()] : []}
				className='space-y-2'
			>
				{modules.map((module, moduleIdx) => (
					<AccordionItem
						key={module.id}
						value={module.id.toString()}
						className='bg-card rounded-lg border px-0'
					>
						<AccordionTrigger className='px-3 py-2.5 text-sm hover:no-underline'>
							<span className='text-left font-medium'>
								{moduleIdx + 1}. {module.name}
							</span>
						</AccordionTrigger>

						<AccordionContent className='px-0 pb-0'>
							<div className='space-y-0.5 px-2 pb-2'>
								{module.lessons.map(lesson => {
									const isCurrent = lesson.id === currentLessonId
									const isLecture = lesson.type === 'lecture'
									// TODO: отримати реальний статус завершення
									const isCompleted = false

									return (
										<Link
											key={lesson.id}
											href={`/courses/${courseSlug}/${lesson.slug}`}
											className={cn(
												'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all',
												isCurrent
													? 'bg-primary/10 text-primary font-medium'
													: 'text-muted-foreground hover:bg-muted hover:text-foreground'
											)}
										>
											<span
												className={cn(
													'flex h-5 w-5 shrink-0 items-center justify-center rounded',
													isCompleted
														? 'text-emerald-500'
														: isCurrent
															? 'text-primary'
															: 'text-muted-foreground/50'
												)}
											>
												{isCompleted ? (
													<CheckCircle2Icon className='h-4 w-4' />
												) : isLecture ? (
													<FileTextIcon className='h-3.5 w-3.5' />
												) : (
													<FlaskConicalIcon className='h-3.5 w-3.5' />
												)}
											</span>

											<span className='truncate'>{lesson.title}</span>
										</Link>
									)
								})}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	)
}
