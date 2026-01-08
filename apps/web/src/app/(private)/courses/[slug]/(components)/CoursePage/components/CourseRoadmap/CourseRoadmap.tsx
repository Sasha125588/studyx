import type { LessonProgress, ModuleWithLessons, RoadmapPosition } from '@studyx/types'

import { CourseRoadmapInner } from './components/CourseRoadmapInner/CourseRoadmapInner'
import { getUserId } from '@/shared/api/requests/auth/getUserId'

export interface CourseRoadmapProps {
	courseId: number
	modules: ModuleWithLessons[]
	lessonsProgress?: LessonProgress[]
	savedPositions: RoadmapPosition[]
}

export const CourseRoadmap = async ({
	courseId,
	modules,
	lessonsProgress = [],
	savedPositions
}: CourseRoadmapProps) => {
	const userId = await getUserId()

	const key = `${courseId}-${modules.map(m => m.id).join('-')}`

	return (
		<div className='bg-muted/30 h-[600px] w-full overflow-hidden rounded-2xl border dark:border-zinc-800 dark:bg-zinc-950'>
			<CourseRoadmapInner
				key={key}
				userId={userId ?? ''}
				courseId={courseId}
				modules={modules}
				lessonsProgress={lessonsProgress}
				savedPositions={savedPositions}
			/>
		</div>
	)
}
