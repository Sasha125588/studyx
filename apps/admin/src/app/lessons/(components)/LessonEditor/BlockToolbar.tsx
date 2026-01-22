'use client'

import type { BlockType } from '@studyx/types'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@studyx/ui/base'
import {
  AlertCircleIcon,
  Code2Icon,
  FileCodeIcon,
  Heading2Icon,
  HelpCircleIcon,
  ImageIcon,
  MinusIcon,
  PlusIcon,
  TypeIcon,
  UploadIcon,
  VideoIcon,
} from 'lucide-react'

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void
}

const blockTypes: { type: BlockType, label: string, icon: typeof TypeIcon, category: string }[] = [
  // Контент
  { type: 'text', label: 'Текст', icon: TypeIcon, category: 'content' },
  { type: 'heading', label: 'Заголовок', icon: Heading2Icon, category: 'content' },
  { type: 'image', label: 'Зображення', icon: ImageIcon, category: 'content' },
  { type: 'video', label: 'Відео', icon: VideoIcon, category: 'content' },
  { type: 'callout', label: 'Виноска', icon: AlertCircleIcon, category: 'content' },
  { type: 'divider', label: 'Розділювач', icon: MinusIcon, category: 'content' },
  { type: 'code', label: 'Код', icon: Code2Icon, category: 'content' },
  // Інтерактивні
  { type: 'code-exercise', label: 'Задача з кодом', icon: FileCodeIcon, category: 'interactive' },
  { type: 'file-upload', label: 'Завантаження файлу', icon: UploadIcon, category: 'interactive' },
  { type: 'quiz', label: 'Тест', icon: HelpCircleIcon, category: 'interactive' },
]

export function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  const contentBlocks = blockTypes.filter(b => b.category === 'content')
  const interactiveBlocks = blockTypes.filter(b => b.category === 'interactive')

  return (
    <div className="bg-card flex items-center gap-2 rounded-xl border p-3">
      <span className="text-muted-foreground mr-2 text-sm font-medium">Додати блок:</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Додати блок
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56"
        >
          <DropdownMenuLabel>Контент</DropdownMenuLabel>
          {contentBlocks.map(block => (
            <DropdownMenuItem
              key={block.type}
              onClick={() => onAddBlock(block.type)}
            >
              <block.icon className="mr-2 h-4 w-4" />
              {block.label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Інтерактивні</DropdownMenuLabel>
          {interactiveBlocks.map(block => (
            <DropdownMenuItem
              key={block.type}
              onClick={() => onAddBlock(block.type)}
            >
              <block.icon className="mr-2 h-4 w-4" />
              {block.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick access buttons */}
      <div className="flex gap-1 border-l pl-2">
        {contentBlocks.slice(0, 4).map(block => (
          <Button
            key={block.type}
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock(block.type)}
            title={block.label}
            className="h-8 w-8 p-0"
          >
            <block.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}
