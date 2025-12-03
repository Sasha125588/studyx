// import { formatDate } from 'date-fns'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

import { I18nText } from '@/components/common/I18nText/I18nText'
import { H2 } from '@/components/common/Typography/H2'
import { H4 } from '@/components/common/Typography/H4'

import { LearningTimeChart } from './(components)/LearningTimeChart/LearningTimeChart'
import { RecentCoursesList } from './(components)/RecentCoursesList/RecentCoursesList'
import { getCoursesWithDetails } from '@/shared/api/requests/courses/getCoursesWithDetails'

const DashboardPage = async () => {
	const { data: courses } = await getCoursesWithDetails()

	const currentPartOfDay = new Date().getHours()

	const greeting =
		currentPartOfDay < 12
			? 'Good morning'
			: currentPartOfDay < 18
				? 'Good afternoon'
				: 'Good evening'

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2'>
				<H2 className=''>
					{greeting}, Student <span className='pl-1'>👋</span>
				</H2>
				{/* <p className='text-muted-foreground text-[15px] font-medium'>
					{formatDate(new Date(), 'PPPP')}
				</p> */}
			</div>
			<LearningTimeChart />
			<div className='mt-6 space-y-4'>
				<div className='flex items-center justify-between'>
					<H4>
						<I18nText path='continueLearning' />
					</H4>
					<Link
						href='/courses'
						className='flex items-center gap-1 text-violet-500 hover:underline'
					>
						<p className='text-sm font-semibold'>
							<I18nText path='allCourses' />
						</p>
						<ChevronRightIcon size={16} />
					</Link>
				</div>
				<RecentCoursesList recentCourses={courses ?? []} />
			</div>
			<div className='h-[600px]'></div>
		</div>
	)
}

export default DashboardPage
