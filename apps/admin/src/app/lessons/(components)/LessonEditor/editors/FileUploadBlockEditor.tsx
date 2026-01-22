'use client'

import type { FileUploadBlock } from '@studyx/types'
import { Badge, Button, Input, Label } from '@studyx/ui/base'
import { XIcon } from 'lucide-react'

interface FileUploadBlockEditorProps {
  block: FileUploadBlock
  onUpdate: (updates: Partial<FileUploadBlock>) => void
}

const commonFileTypes = ['pdf', 'docx', 'doc', 'zip', 'rar', 'txt', 'xlsx', 'pptx', 'jpg', 'png']

export function FileUploadBlockEditor({ block, onUpdate }: FileUploadBlockEditorProps) {
  const addFileType = (type: string) => {
    if (!block.allowedTypes.includes(type)) {
      onUpdate({ allowedTypes: [...block.allowedTypes, type] })
    }
  }

  const removeFileType = (type: string) => {
    onUpdate({ allowedTypes: block.allowedTypes.filter(t => t !== type) })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label className="text-xs">Макс. балів</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={block.maxScore}
            onChange={e => onUpdate({ maxScore: Number(e.target.value) })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-xs">Макс. кількість файлів</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={block.maxFiles}
            onChange={e => onUpdate({ maxFiles: Number(e.target.value) })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-xs">Макс. розмір файлу (MB)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={block.maxSizeMB}
            onChange={e => onUpdate({ maxSizeMB: Number(e.target.value) })}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Інструкції для студента</Label>
        <textarea
          value={block.instructions}
          onChange={e => onUpdate({ instructions: e.target.value })}
          placeholder="Опишіть, що потрібно завантажити..."
          rows={3}
          className="border-input bg-background focus:ring-ring mt-1.5 w-full resize-y rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      <div>
        <Label className="text-xs">Дозволені формати</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {block.allowedTypes.map(type => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1"
            >
              .
              {type}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFileType(type)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {commonFileTypes
            .filter(t => !block.allowedTypes.includes(t))
            .map(type => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addFileType(type)}
                className="h-7 text-xs"
              >
                + .
                {type}
              </Button>
            ))}
        </div>
      </div>
    </div>
  )
}
