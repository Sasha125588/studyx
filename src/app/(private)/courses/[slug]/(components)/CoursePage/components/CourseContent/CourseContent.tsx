import { BookOpenIcon, CircleQuestionMarkIcon } from 'lucide-react'
import { FileIcon } from 'lucide-react'
import Link from 'next/link'

import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel
} from '@/components/animate-ui/headless/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { ModuleWithRelations } from '../../CoursePage'

export interface CourseContentProps {
	modules: ModuleWithRelations[]
}

export const CourseContent = ({ modules }: CourseContentProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='space-y-3'>
					<p className='text-lg font-semibold'>Контент курсу</p>
					<div className='flex items-center gap-3'>
						<div className='flex items-center gap-2'>
							<BookOpenIcon
								className='text-gray-500'
								size={18}
							/>
							<p className='text-sm font-semibold text-gray-500'>{modules.length} модулів</p>
						</div>
						{/* <div className='h-4 w-px bg-gray-200' />
                <div className='flex items-center gap-2'>
                    <CircleQuestionMarkIcon
                        className='text-gray-500'
                        size={18}
                    />
                    <p className='text-sm text-gray-500'>{totalPractical} завдань</p>
                </div> */}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion className='space-y-4'>
					{modules?.map((module, index) => (
						<AccordionItem
							key={module.id}
							className='overflow-hidden rounded-xl border bg-white'
						>
							<AccordionButton className='w-full p-4'>
								<div className='flex w-full items-center justify-between'>
									<div className='flex items-center gap-2 text-lg font-semibold'>
										<p>Модуль {index + 1}</p>
										<span>-</span>
										<h3 className='text-gray-900'>{module.name}</h3>
									</div>
									{module.description && (
										<p className='text-sm text-gray-500'>{module.description}</p>
									)}
								</div>
							</AccordionButton>

							<AccordionPanel className='divide-y divide-gray-100'>
								{module.lectures.map((lecture, lectureIndex) => (
									<div
										key={lecture.id}
										className='flex items-center justify-between p-4 transition-colors hover:bg-gray-50'
									>
										<div className='flex items-center gap-3'>
											<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
												<FileIcon size={16} />
											</div>
											<div>
												<Link
													href={lecture.file || '#'}
													target='_blank'
													className='font-medium text-gray-900 hover:text-blue-600'
												>
													Лекція {lectureIndex + 1}. {lecture.title}
												</Link>
											</div>
										</div>
										<Link
											href={lecture.file || '#'}
											target='_blank'
											className='rounded-lg bg-blue-50 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-100'
										>
											Переглянути
										</Link>
									</div>
								))}

								{module.practical.map(practice => (
									<div
										key={practice.id}
										className='flex items-center justify-between p-4 transition-colors hover:bg-gray-50'
									>
										<div className='flex items-center gap-3'>
											<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600'>
												<CircleQuestionMarkIcon size={16} />
											</div>
											<div>
												<Link
													href={practice.file || '#'}
													target='_blank'
													className='font-medium text-gray-900 hover:text-purple-600'
												>
													{practice.title}
												</Link>
											</div>
										</div>
										<Link
											href={practice.file || '#'}
											target='_blank'
											className='rounded-lg bg-purple-50 px-3 py-1 text-sm text-purple-600 transition-colors hover:bg-purple-100'
										>
											Переглянути
										</Link>
									</div>
								))}
							</AccordionPanel>
						</AccordionItem>
					))}
				</Accordion>
			</CardContent>
		</Card>
	)
}
