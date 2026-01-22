'use client'

import type { LessonBlock } from '@studyx/types'
import { Button } from '@studyx/ui/base'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  GripVerticalIcon,
  Trash2Icon,
} from 'lucide-react'

import { CalloutBlockEditor } from './editors/CalloutBlockEditor'
import { CodeBlockEditor } from './editors/CodeBlockEditor'
import { CodeExerciseBlockEditor } from './editors/CodeExerciseBlockEditor'
import { FileUploadBlockEditor } from './editors/FileUploadBlockEditor'
import { HeadingBlockEditor } from './editors/HeadingBlockEditor'
import { ImageBlockEditor } from './editors/ImageBlockEditor'
import { QuizBlockEditor } from './editors/QuizBlockEditor'
import { TextBlockEditor } from './editors/TextBlockEditor'
import { VideoBlockEditor } from './editors/VideoBlockEditor'

interface BlockListProps {
  blocks: LessonBlock[]
  onUpdateBlock: (id: string, updates: Partial<LessonBlock>) => void
  onDeleteBlock: (id: string) => void
  onMoveBlock: (id: string, direction: 'up' | 'down') => void
  onDuplicateBlock: (id: string) => void
}

export function BlockList({
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
}: BlockListProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockWrapper
          key={block.id}
          block={block}
          index={index}
          totalBlocks={blocks.length}
          onUpdate={updates => onUpdateBlock(block.id, updates)}
          onDelete={() => onDeleteBlock(block.id)}
          onMoveUp={() => onMoveBlock(block.id, 'up')}
          onMoveDown={() => onMoveBlock(block.id, 'down')}
          onDuplicate={() => onDuplicateBlock(block.id)}
        />
      ))}
    </div>
  )
}

interface BlockWrapperProps {
  block: LessonBlock
  index: number
  totalBlocks: number
  onUpdate: (updates: Partial<LessonBlock>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
}

const blockTypeLabels: Record<string, string> = {
  'text': 'Текст',
  'heading': 'Заголовок',
  'image': 'Зображення',
  'video': 'Відео',
  'callout': 'Виноска',
  'divider': 'Розділювач',
  'code': 'Код',
  'code-exercise': 'Задача з кодом',
  'file-upload': 'Завантаження файлу',
  'quiz': 'Тест',
}

function BlockWrapper({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
}: BlockWrapperProps) {
  return (
    <div className="group bg-card relative rounded-xl border transition-shadow hover:shadow-md">
      {/* Block header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <GripVerticalIcon className="text-muted-foreground h-4 w-4 cursor-grab" />
          <span className="text-muted-foreground text-xs font-medium">
            {index + 1}
            .
            {blockTypeLabels[block.type] ?? block.type}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={index === 0}
            className="h-7 w-7 p-0"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={index === totalBlocks - 1}
            className="h-7 w-7 p-0"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            className="h-7 w-7 p-0"
          >
            <CopyIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Block content */}
      <div className="p-4">
        <BlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  )
}

interface BlockEditorProps {
  block: LessonBlock
  onUpdate: (updates: Partial<LessonBlock>) => void
}

function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  switch (block.type) {
    case 'text':
      return (
        <TextBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'heading':
      return (
        <HeadingBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'image':
      return (
        <ImageBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'video':
      return (
        <VideoBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'callout':
      return (
        <CalloutBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'divider':
      return <div className="text-muted-foreground text-center text-sm">— Розділювач —</div>
    case 'code':
      return (
        <CodeBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'code-exercise':
      return (
        <CodeExerciseBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'file-upload':
      return (
        <FileUploadBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    case 'quiz':
      return (
        <QuizBlockEditor
          block={block}
          onUpdate={onUpdate}
        />
      )
    default:
      return (
        <div className="text-muted-foreground text-sm">
          Редактор для типу &quot;
          {(block as LessonBlock).type}
          &quot; не реалізовано
        </div>
      )
  }
}
