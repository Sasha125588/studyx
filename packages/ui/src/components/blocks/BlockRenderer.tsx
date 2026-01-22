'use client'

import type { BlockSubmission, LessonBlock } from '@studyx/types'

import { EmptyCard } from '../common/EmptyCard/EmptyCard'

import { CalloutBlock } from './view/CalloutBlock'
import { CodeBlock } from './view/CodeBlock'
import { CodeExerciseBlock } from './view/CodeExerciseBlock'
import { DividerBlock } from './view/DividerBlock'
import { FileUploadBlock } from './view/FileUploadBlock'
import { HeadingBlock } from './view/HeadingBlock'
import { ImageBlock } from './view/ImageBlock'
import { QuizBlock } from './view/QuizBlock'
import { TextBlock } from './view/TextBlock'
import { VideoBlock } from './view/VideoBlock'

interface BlockRendererProps {
  blocks: LessonBlock[]
  lessonId: number
  submissions?: BlockSubmission[]
  isPreview?: boolean
}

export function BlockRenderer({
  blocks,
  lessonId,
  submissions = [],
  isPreview = false,
}: BlockRendererProps) {
  const submissionsMap = new Map(submissions.map(s => [s.blockId, s]))

  if (!blocks || blocks.length === 0) {
    return (
      <EmptyCard
        title="Контент ще не додано"
        description="Наразі для цього заняття немає доступного контенту."
      />
    )
  }

  return (
    <div className="space-y-6">
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

function BlockItem({ block, lessonId, submission, isPreview }: BlockItemProps) {
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
        <div className="rounded-lg border border-dashed border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Невідомий тип блоку:
            {' '}
            {(block as LessonBlock).type}
          </p>
        </div>
      )
  }
}
