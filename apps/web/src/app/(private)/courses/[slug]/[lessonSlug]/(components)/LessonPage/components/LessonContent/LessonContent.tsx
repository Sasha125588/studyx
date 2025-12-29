import type { BlockSubmission, LessonBlock } from '@studyx/types'
import 'highlight.js/styles/github-dark.css'

import { BlockRenderer } from '../blocks'

interface LessonContentProps {
	lessonId: number
	blocks?: LessonBlock[]
	submissions?: BlockSubmission[]
}

export const LessonContent = ({ lessonId, blocks, submissions = [] }: LessonContentProps) => {
	return (
		<BlockRenderer
			blocks={blocks ?? []}
			lessonId={lessonId}
			submissions={submissions}
		/>
	)
}
