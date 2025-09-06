import { FileIcon } from 'lucide-react'
import Link from 'next/link'

import { MessageCircleQuestionIcon } from '@/components/animate-ui/icons/message-circle-question'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { getCourse } from '@/shared/api/requests/getCourse'

interface CoursePageProps {
	searchParams: Promise<{ courseId: string }>
}

const CoursePage = async ({ searchParams }: CoursePageProps) => {
	const { courseId } = await searchParams

	const courseResponse = await getCourse(courseId)

	return (
		<div>
			<div className='mb-8'>
				<div className='flex items-center justify-between'>
					<h1 className='mb-6 text-4xl font-bold'>{courseResponse.data?.name}</h1>
					<TooltipProvider delayDuration={0}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant='outline'>
									<MessageCircleQuestionIcon animateOnHover />
								</Button>
							</TooltipTrigger>
							<TooltipContent
								side='left'
								className='px-2 py-1 text-[13px]'
							>
								<Link
									href={courseResponse.data?.edu_program ?? ''}
									target='_blank'
								>
									<p className='hover:underline'>Освітня програма</p>
								</Link>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<div className='mb-8 grid grid-cols-4 gap-4'>
					<div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='rounded-lg bg-blue-100 p-2 text-blue-600'>
							<svg
								className='h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
						</div>
						<div>
							<div className='text-sm text-gray-500'>Лекції</div>
							<div className='text-lg font-semibold text-gray-900'>
								{courseResponse.data?.module.reduce((acc, m) => acc + m.lectures.length, 0)} уроків
							</div>
						</div>
					</div>

					<div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='rounded-lg bg-purple-100 p-2 text-purple-600'>
							<svg
								className='h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
								/>
							</svg>
						</div>
						<div>
							<div className='text-sm text-gray-500'>Практичні</div>
							<div className='text-lg font-semibold text-gray-900'>
								{courseResponse.data?.module.reduce((acc, m) => acc + m.practical.length, 0)}{' '}
								завдань
							</div>
						</div>
					</div>

					<div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='rounded-lg bg-green-100 p-2 text-green-600'>
							<svg
								className='h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</div>
						<div>
							<div className='text-sm text-gray-500'>Прогрес</div>
							<div className='text-lg font-semibold text-gray-900'>0%</div>
						</div>
					</div>

					<div className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
						<div className='rounded-lg bg-yellow-100 p-2 text-yellow-600'>
							<svg
								className='h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
						</div>
						<div>
							<div className='text-sm text-gray-500'>Тривалість</div>
							<div className='text-lg font-semibold text-gray-900'>8 годин</div>
						</div>
					</div>
				</div>
			</div>

			<div className='space-y-4'>
				{courseResponse.data?.module.map((module, index) => (
					<div
						key={module.id}
						className='overflow-hidden rounded-xl bg-white shadow-lg'
					>
						<div className='border-b border-gray-200 bg-gray-50 p-4'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-200 font-mono text-lg text-emerald-700'>
										{index + 1}
									</div>
									<h3 className='text-lg font-semibold text-gray-900'>{module.name}</h3>
								</div>
								{module.description && (
									<p className='text-sm text-gray-500'>{module.description}</p>
								)}
							</div>
						</div>

						<div className='divide-y divide-gray-100'>
							{module.lectures.map((lecture, lectureIndex) => (
								<div
									key={lecture.id}
									className='flex items-center justify-between p-4 transition-colors hover:bg-gray-50'
								>
									<div className='flex items-center gap-3'>
										<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
											<FileIcon className='h-4 w-4' />
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
											<svg
												className='h-4 w-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
												/>
											</svg>
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
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default CoursePage
