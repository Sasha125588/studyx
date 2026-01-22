'use client'

import type { ImageBlock } from '@studyx/types'
import { Input, Label } from '@studyx/ui/base'
import Image from 'next/image'

interface ImageBlockEditorProps {
  block: ImageBlock
  onUpdate: (updates: Partial<ImageBlock>) => void
}

export function ImageBlockEditor({ block, onUpdate }: ImageBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-xs">URL зображення</Label>
          <Input
            value={block.url}
            onChange={e => onUpdate({ url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-xs">Alt текст</Label>
          <Input
            value={block.alt ?? ''}
            onChange={e => onUpdate({ alt: e.target.value })}
            placeholder="Опис зображення"
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-xs">Підпис (необов&apos;язково)</Label>
          <Input
            value={block.caption ?? ''}
            onChange={e => onUpdate({ caption: e.target.value })}
            placeholder="Підпис під зображенням"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-xs">Ширина (%)</Label>
          <Input
            type="number"
            min={10}
            max={100}
            value={block.width ?? 100}
            onChange={e => onUpdate({ width: Number(e.target.value) })}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Preview */}
      {block.url && (
        <div className="mt-4">
          <Label className="text-xs">Попередній перегляд</Label>
          <div
            className="bg-muted mt-1.5 overflow-hidden rounded-lg border"
            style={{ maxWidth: `${block.width ?? 100}%` }}
          >
            <Image
              src={block.url}
              alt={block.alt ?? ''}
              width={400}
              height={225}
              className="h-auto w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/placeholder-image.png'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
