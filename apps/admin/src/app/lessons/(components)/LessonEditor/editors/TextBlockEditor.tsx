'use client'

import type { TextBlock } from '@studyx/types'
import type { Value } from 'platejs'
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from '@platejs/basic-nodes/react'
import { Editor, EditorContainer } from '@studyx/ui/base'
import { Plate, usePlateEditor } from 'platejs/react'
import { useCallback, useEffect, useRef } from 'react'

interface TextBlockEditorProps {
  block: TextBlock
  onUpdate: (updates: Partial<TextBlock>) => void
}

// Конвертація тексту в Plate Value
function textToPlateValue(text: string): Value {
  if (!text) {
    return [{ type: 'p', children: [{ text: '' }] }]
  }

  // Розбиваємо на параграфи
  const paragraphs = text.split('\n\n')
  return paragraphs.map(p => ({
    type: 'p',
    children: [{ text: p }],
  }))
}

// Конвертація Plate Value в текст
function plateValueToText(value: Value): string {
  return value
    .map((node) => {
      if ('children' in node && Array.isArray(node.children)) {
        return node.children.map(child => ('text' in child ? (child.text as string) : '')).join('')
      }
      return ''
    })
    .join('\n\n')
}

export function TextBlockEditor({ block, onUpdate }: TextBlockEditorProps) {
  const isUpdatingRef = useRef(false)

  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin],
    value: textToPlateValue(block.content),
  })

  // Оновлення батьківського компонента при зміні
  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      if (isUpdatingRef.current)
        return

      const text = plateValueToText(value)
      if (text !== block.content) {
        onUpdate({ content: text })
      }
    },
    [block.content, onUpdate],
  )

  // Синхронізація при зміні block.content ззовні
  useEffect(() => {
    const currentText = plateValueToText(editor.children as Value)
    if (block.content !== currentText) {
      isUpdatingRef.current = true
      editor.tf.setValue(textToPlateValue(block.content))
      isUpdatingRef.current = false
    }
  }, [block.content, editor])

  return (
    <div>
      <label className="text-muted-foreground mb-1.5 block text-xs">Контент</label>
      <div className="rounded-lg border">
        <Plate
          editor={editor}
          onChange={handleChange}
        >
          <EditorContainer variant="default">
            <Editor
              variant="none"
              placeholder="Введіть текст... Використовуйте Ctrl+B для жирного, Ctrl+I для курсиву"
              className="min-h-[150px] p-3 text-sm"
            />
          </EditorContainer>
        </Plate>
      </div>
    </div>
  )
}
