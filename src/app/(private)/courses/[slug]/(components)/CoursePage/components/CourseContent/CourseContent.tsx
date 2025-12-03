import 'katex/dist/katex.min.css'
import { BookOpenIcon, CircleQuestionMarkIcon, FileIcon } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/animate-ui/radix/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { ModuleWithLessons } from '@/generated/entities.types'

export interface CourseContentProps {
	modules: ModuleWithLessons[]
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
				<Accordion
					type='multiple'
					className='space-y-4'
				>
					{modules?.map((module, index) => (
						<AccordionItem
							key={module.id}
							value={module.id.toString()}
							className='overflow-hidden rounded-[20px] border transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:border-blue-500'
						>
							<AccordionTrigger className='w-full p-4'>
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
							</AccordionTrigger>

							<AccordionContent className='divide-y divide-gray-100'>
								{module.lessons?.map((lesson, lessonIndex) => (
									<div
										key={lesson.id}
										className='group flex items-center justify-between p-4 transition-colors hover:bg-gray-50'
									>
										<div className='flex items-center gap-3'>
											<div
												className={`flex h-8 w-8 items-center justify-center rounded-lg ${
													lesson.type === 'practical'
														? 'bg-purple-100 text-purple-600'
														: 'bg-blue-100 text-blue-600'
												}`}
											>
												{lesson.type === 'practical' ? (
													<CircleQuestionMarkIcon size={16} />
												) : (
													<FileIcon size={16} />
												)}
											</div>
											<div>
												<p
													className={`font-medium text-gray-900 group-hover:${
														lesson.type === 'practical' ? 'text-purple-600' : 'text-blue-600'
													}`}
												>
													{lesson.type === 'practical' ? 'Практична' : 'Лекція'} {lessonIndex + 1}.{' '}
													{lesson.title}
												</p>
											</div>
										</div>
										<div className='prose prose-slate prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:font-bold prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-gray-500 max-w-none'>
											<ReactMarkdown
												remarkPlugins={[remarkGfm, remarkMath]}
												rehypePlugins={[rehypeKatex]}
											>
												{lesson.content}
											</ReactMarkdown>
										</div>
										{lesson.content && (
											<Link
												href={`#lesson-${lesson.id}`}
												className={`rounded-lg px-3 py-1 text-sm transition-colors ${
													lesson.type === 'practical'
														? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
														: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
												}`}
											>
												Переглянути
											</Link>
										)}
									</div>
								))}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</CardContent>
		</Card>
	)
}
