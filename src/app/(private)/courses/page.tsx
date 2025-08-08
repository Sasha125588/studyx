import { BentoCard, BentoGrid } from '@/components/magic-ui/components/bento-grid'

import { GRID_DATA } from './constants/data'

const CoursesPage = () => {
	return (
		<div>
			<h1 className='text-2xl font-bold'>Courses</h1>
			<BentoGrid className='mt-4'>
				{GRID_DATA.map((feature, idx) => (
					<BentoCard
						key={idx}
						{...feature}
					/>
				))}
			</BentoGrid>
		</div>
	)
}

export default CoursesPage
