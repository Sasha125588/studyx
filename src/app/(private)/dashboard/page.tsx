import { formatDate } from 'date-fns'

import { BentoCard, BentoGrid } from '@/components/magic-ui/components/bento-grid'

import { GRID_DATA } from '../courses/constants/data'

const DashboardPage = () => {
	const currentPartOfDay = new Date().getHours()

	const greeting =
		currentPartOfDay < 12
			? 'Good morning'
			: currentPartOfDay < 18
				? 'Good afternoon'
				: 'Good evening'

	return (
		<div>
			<div className='flex flex-col gap-2'>
				<p className='flex text-3xl font-bold'>
					{greeting}, Student <span className='pl-1'>👋</span>
				</p>
				<p className='text-muted-foreground text-[15px] font-medium'>
					{formatDate(new Date(), 'PPPP')}
				</p>
			</div>
		</div>
	)
}

export default DashboardPage
