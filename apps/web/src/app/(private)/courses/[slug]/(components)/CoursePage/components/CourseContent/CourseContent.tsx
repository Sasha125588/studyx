import type { ModuleWithLessons } from '@studyx/database'
import { ArrowRightIcon, BookOpenIcon, FileTextIcon, FlaskConicalIcon } from 'lucide-react'
import Link from 'next/link'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/animate-ui/radix/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface CourseContentProps {
	modules: ModuleWithLessons[]
	courseSlug: string
}

export const CourseContent = ({ modules, courseSlug }: CourseContentProps) => {
	// TODO: отримати реальний прогрес з API
	const getLessonStatus = () => {
		const random = crypto.getRandomValues(new Uint8Array(1))[0] % 100
		return random > 50
	}

	const getModuleProgress = (module: ModuleWithLessons) => {
		// TODO: обчислити реальний прогрес
		const completedCount = 0
		const totalCount = module.lessons?.length ?? 0
		return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
	}

	return (
		<Accordion
			type='multiple'
			className='space-y-4'
		>
			{modules?.map((module, idx) => {
				const progress = getModuleProgress(module)

				return (
					<AccordionItem
						key={module.id}
						value={module.id.toString()}
						className='bg-card overflow-hidden rounded-xl border px-0'
					>
						<AccordionTrigger className='px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180'>
							<div className='flex w-full items-center justify-between pr-2'>
								<div className='text-left'>
									<h3 className='font-semibold'>
										Модуль {idx + 1}. {module.name}
									</h3>
									<p className='text-muted-foreground mt-1 flex items-center gap-2 text-sm'>
										<BookOpenIcon className='h-4 w-4' />
										{module.lessons?.length ?? 0} занять
									</p>
								</div>
								{progress > 0 && (
									<span className='mr-2 text-sm font-medium text-emerald-600'>{progress}%</span>
								)}
							</div>
						</AccordionTrigger>

						<AccordionContent className='px-0 pb-0'>
							{module.lessons?.map((lesson, lessonIdx) => {
								const isLessonCompleted = getLessonStatus()
								const isPractical = lesson.type === 'practical'

								return (
									<Link
										href={`${courseSlug}/${lesson.slug}`}
										key={lesson.id}
									>
										<div className='group hover:bg-muted/50 flex items-center justify-between border-t px-6 py-4 transition-colors'>
											{/* Ліва частина - іконка та назва */}
											<div className='flex items-center gap-4'>
												{/* Іконка типу */}
												<div
													className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
														isLessonCompleted
															? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
															: isPractical
																? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30'
																: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
													}`}
												>
													{isPractical ? (
														<FlaskConicalIcon className='h-5 w-5' />
													) : (
														<FileTextIcon className='h-5 w-5' />
													)}
												</div>

												{/* Текст */}
												<div>
													<div className='flex items-center gap-2'>
														<p className='font-medium'>
															Заняття {lessonIdx + 1}. {lesson.title}
														</p>
														{isLessonCompleted && (
															<Badge
																variant='success'
																className='text-[10px]'
															>
																Пройдено
															</Badge>
														)}
													</div>
													<p className='text-muted-foreground mt-0.5 text-xs'>
														{isPractical ? 'Практична робота' : 'Лекція'}
													</p>
												</div>
											</div>

											{/* Права частина - кнопка */}
											<Button
												variant='link'
												className='text-primary flex items-center gap-1 text-sm opacity-0 transition-opacity group-hover:opacity-100'
											>
												Перейти
												<ArrowRightIcon className='h-4 w-4' />
											</Button>
										</div>
									</Link>
								)
							})}
						</AccordionContent>
					</AccordionItem>
				)
			})}
		</Accordion>
	)
}
