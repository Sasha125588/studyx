'use client'

import type { CodeBlock, CodeLanguage } from '@studyx/types'
import { CODE_LANGUAGES } from '@studyx/types'
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@studyx/ui/base'

interface CodeBlockEditorProps {
  block: CodeBlock
  onUpdate: (updates: Partial<CodeBlock>) => void
}

export function CodeBlockEditor({ block, onUpdate }: CodeBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label className="text-xs">Мова</Label>
          <Select
            value={block.language}
            onValueChange={v => onUpdate({ language: v as CodeLanguage })}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CODE_LANGUAGES.map(lang => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs">Назва файлу (необов&apos;язково)</Label>
          <Input
            value={block.filename ?? ''}
            onChange={e => onUpdate({ filename: e.target.value })}
            placeholder="main.js"
            className="mt-1.5"
          />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={!block.readonly}
              onChange={e => onUpdate({ readonly: !e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm">Редагований</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={block.runnable}
              onChange={e => onUpdate({ runnable: e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm">Запускний</span>
          </label>
        </div>
      </div>

      <div>
        <Label className="text-xs">Код</Label>
        <textarea
          value={block.code}
          onChange={e => onUpdate({ code: e.target.value })}
          placeholder="// Введіть код тут..."
          rows={10}
          className="mt-1.5 w-full resize-y rounded-lg border bg-[#0d1117] p-4 font-mono text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
