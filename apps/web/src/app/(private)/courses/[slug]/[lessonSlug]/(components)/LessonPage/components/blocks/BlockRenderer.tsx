'use client'

import type { BlockSubmission, LessonBlock } from '@studyx/types'

import { CalloutBlock } from './CalloutBlock'
import { CodeBlock } from './CodeBlock'
import { CodeExerciseBlock } from './CodeExerciseBlock'
import { DividerBlock } from './DividerBlock'
import { FileUploadBlock } from './FileUploadBlock'
import { HeadingBlock } from './HeadingBlock'
import { ImageBlock } from './ImageBlock'
import { QuizBlock } from './QuizBlock'
import { TextBlock } from './TextBlock'
import { VideoBlock } from './VideoBlock'

interface BlockRendererProps {
	blocks: LessonBlock[]
	lessonId: number
	submissions?: BlockSubmission[]
	isPreview?: boolean
}

export const BlockRenderer = ({
	blocks,
	lessonId,
	submissions = [],
	isPreview = false
}: BlockRendererProps) => {
	const submissionsMap = new Map(submissions.map(s => [s.blockId, s]))

	if (blocks.length === 0) {
		return (
			<div className='flex h-64 items-center justify-center rounded-xl border border-dashed'>
				<p className='text-muted-foreground'>Контент ще не додано</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{blocks.map(block => (
				<BlockItem
					key={block.id}
					block={block}
					lessonId={lessonId}
					submission={submissionsMap.get(block.id)}
					isPreview={isPreview}
				/>
			))}
		</div>
	)
}

interface BlockItemProps {
	block: LessonBlock
	lessonId: number
	submission?: BlockSubmission
	isPreview: boolean
}

const BlockItem = ({ block, lessonId, submission, isPreview }: BlockItemProps) => {
	switch (block.type) {
		case 'text':
			return <TextBlock block={block} />
		case 'heading':
			return <HeadingBlock block={block} />
		case 'image':
			return <ImageBlock block={block} />
		case 'video':
			return <VideoBlock block={block} />
		case 'callout':
			return <CalloutBlock block={block} />
		case 'divider':
			return <DividerBlock />
		case 'code':
			return <CodeBlock block={block} />
		case 'code-exercise':
			return (
				<CodeExerciseBlock
					block={block}
					lessonId={lessonId}
					submission={submission}
					isPreview={isPreview}
				/>
			)
		case 'file-upload':
			return (
				<FileUploadBlock
					block={block}
					lessonId={lessonId}
					submission={submission}
					isPreview={isPreview}
				/>
			)
		case 'quiz':
			return (
				<QuizBlock
					block={block}
					lessonId={lessonId}
					submission={submission}
					isPreview={isPreview}
				/>
			)
		default:
			return (
				<div className='rounded-lg border border-dashed border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950'>
					<p className='text-sm text-yellow-700 dark:text-yellow-300'>
						Невідомий тип блоку: {(block as LessonBlock).type}
					</p>
				</div>
			)
	}
}
