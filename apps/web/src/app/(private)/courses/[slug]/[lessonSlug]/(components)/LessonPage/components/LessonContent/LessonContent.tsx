import type { BlockSubmission, LessonBlock } from '@studyx/types'
import 'highlight.js/styles/github-dark.css'

import { BlockRenderer } from '../blocks'

interface LessonContentProps {
	lessonId: number
	blocks?: LessonBlock[]
	submissions?: BlockSubmission[]
}

export const LessonContent = ({ lessonId, blocks, submissions = [] }: LessonContentProps) => {
	if (blocks && blocks.length > 0) {
		return (
			<BlockRenderer
				blocks={blocks}
				lessonId={lessonId}
				submissions={submissions}
			/>
		)
	}

	return (
		<div className='flex h-64 items-center justify-center rounded-xl border border-dashed'>
			<p className='text-muted-foreground'>Контент ще не додано</p>
		</div>
	)
}
