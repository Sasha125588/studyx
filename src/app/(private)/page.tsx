// import { formatDate } from 'date-fns'
import { I18nText } from '@/components/common/I18nText/I18nText'
import { H2 } from '@/components/common/Typography/H2'
import { H3 } from '@/components/common/Typography/H3'

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
				<H3>
					<I18nText path='continueLearning' />
				</H3>
				<RecentCoursesList recentCourses={courses ?? []} />
			</div>
			<div className='h-[600px]'></div>
		</div>
	)
}

export default DashboardPage
