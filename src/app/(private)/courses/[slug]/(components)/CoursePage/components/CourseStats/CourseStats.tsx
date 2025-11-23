import type { ModuleWithRelations } from '../../CoursePage'

export interface CourseStatsProps {
	modules: ModuleWithRelations[]
}

export const CourseStats = ({ modules }: CourseStatsProps) => {
	const totalLectures = modules.reduce((acc, m) => acc + m.lectures.length, 0) ?? 0
	const totalPractical = modules.reduce((acc, m) => acc + m.practical.length, 0) ?? 0

	return (
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
					<div className='text-lg font-semibold text-gray-900'>{totalLectures} уроків</div>
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
					<div className='text-lg font-semibold text-gray-900'>{totalPractical} завдань</div>
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
	)
}
