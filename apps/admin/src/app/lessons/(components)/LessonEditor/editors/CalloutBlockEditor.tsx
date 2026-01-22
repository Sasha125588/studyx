'use client'

import type { CalloutBlock, CalloutVariant } from '@studyx/types'
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@studyx/ui/base'
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon, LightbulbIcon } from 'lucide-react'

interface CalloutBlockEditorProps {
  block: CalloutBlock
  onUpdate: (updates: Partial<CalloutBlock>) => void
}

const variants: { value: CalloutVariant, label: string, icon: typeof InfoIcon }[] = [
  { value: 'info', label: 'Інформація', icon: InfoIcon },
  { value: 'warning', label: 'Попередження', icon: AlertTriangleIcon },
  { value: 'tip', label: 'Порада', icon: LightbulbIcon },
  { value: 'danger', label: 'Увага', icon: AlertCircleIcon },
]

export function CalloutBlockEditor({ block, onUpdate }: CalloutBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-xs">Тип виноски</Label>
          <Select
            value={block.variant}
            onValueChange={v => onUpdate({ variant: v as CalloutVariant })}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variants.map(v => (
                <SelectItem
                  key={v.value}
                  value={v.value}
                >
                  <div className="flex items-center gap-2">
                    <v.icon className="h-4 w-4" />
                    {v.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Заголовок (необов&apos;язково)</Label>
          <Input
            value={block.title ?? ''}
            onChange={e => onUpdate({ title: e.target.value })}
            placeholder="Заголовок виноски"
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Контент</Label>
        <textarea
          value={block.content}
          onChange={e => onUpdate({ content: e.target.value })}
          placeholder="Введіть текст виноски..."
          rows={3}
          className="border-input bg-background focus:ring-ring mt-1.5 w-full resize-y rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
      </div>
    </div>
  )
}
