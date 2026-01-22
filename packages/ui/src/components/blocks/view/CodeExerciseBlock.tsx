'use client'

import type { BlockSubmission, CodeExerciseBlock as CodeExerciseBlockType } from '@studyx/types'
import {

  SubmissionTypes,
} from '@studyx/types'
import { Check, ChevronDown, ChevronUp, Code2, Play, Save } from 'lucide-react'
import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Badge, Button } from '../../base'

interface CodeExerciseBlockProps {
  block: CodeExerciseBlockType
  lessonId: number
  submission?: BlockSubmission
  isPreview?: boolean
}

export function CodeExerciseBlock({
  block,
  submission,
  isPreview = false,
}: CodeExerciseBlockProps) {
  const [code, setCode] = useState(
    submission?.content.type === SubmissionTypes.CODE ? submission.content.code : block.starterCode,
  )
  const [output, setOutput] = useState<string | null>(
    submission?.content.type === SubmissionTypes.CODE ? (submission.content.output ?? null) : null,
  )
  const [isRunning, setIsRunning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setOutput(null)

    try {
      // TODO: Інтеграція з сервісом запуску коду
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOutput('// Результат виконання\nconsole.log("Hello, World!");\n// Output: Hello, World!')
    }
    catch (error) {
      setOutput(`Помилка: ${error instanceof Error ? error.message : 'Невідома помилка'}`)
    }
    finally {
      setIsRunning(false)
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (isPreview)
      return

    setIsSaving(true)
    try {
      // TODO: Відправка на сервер через API
      await new Promise(resolve => setTimeout(resolve, 500))
      // toast.success('Рішення збережено!')
    }
    catch (error) {
      console.error('Failed to save:', error)
      // toast.error('Помилка збереження')
    }
    finally {
      setIsSaving(false)
    }
  }, [isPreview])

  const isGraded = submission?.score !== null && submission?.score !== undefined
  const scorePercentage = isGraded ? (submission.score! / block.maxScore) * 100 : null

  return (
    <div className="overflow-hidden rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
      {/* Заголовок */}
      <div className="flex items-center justify-between bg-emerald-50 px-4 py-3 dark:bg-emerald-950/50">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">
            Практичне завдання
          </span>
          <Badge
            variant="outline"
            className="ml-2"
          >
            {block.language}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isGraded ? 'default' : 'secondary'}>
            {isGraded ? `${submission.score}/${block.maxScore} балів` : `${block.maxScore} балів`}
          </Badge>
          {isGraded && (
            <Badge variant={scorePercentage! >= 70 ? 'default' : 'destructive'}>
              {scorePercentage! >= 70 ? 'Зараховано' : 'Потрібно доопрацювати'}
            </Badge>
          )}
        </div>
      </div>

      {/* Інструкції */}
      <div className="border-b">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-2 text-left"
        >
          <span className="text-sm font-medium">Умова завдання</span>
          {showInstructions
            ? (
                <ChevronUp className="h-4 w-4" />
              )
            : (
                <ChevronDown className="h-4 w-4" />
              )}
        </button>
        {showInstructions && (
          <div className="prose prose-sm dark:prose-invert max-w-none border-t px-4 py-3">
            <ReactMarkdown>{block.instructions}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Редактор коду */}
      <div className="bg-[#0d1117]">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          disabled={isPreview || isGraded}
          className="min-h-[250px] w-full resize-y bg-transparent p-4 font-mono text-sm text-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Напишіть ваше рішення тут..."
          spellCheck={false}
        />
      </div>

      {/* Кнопки */}
      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3 dark:bg-gray-900/50">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isPreview}
            className="gap-1.5"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Виконується...' : 'Запустити'}
          </Button>
        </div>
        {!isPreview && !isGraded && (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-1.5"
          >
            {isSaving
              ? (
                  <>Збереження...</>
                )
              : (
                  <>
                    <Save className="h-4 w-4" />
                    Зберегти рішення
                  </>
                )}
          </Button>
        )}
        {isGraded && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            Перевірено
          </div>
        )}
      </div>

      {/* Результат виконання */}
      {output !== null && (
        <div className="border-t bg-black/80">
          <div className="border-b border-gray-800 px-4 py-2">
            <span className="text-xs font-medium text-gray-400">Результат виконання</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm text-green-400">
            <code>{output}</code>
          </pre>
        </div>
      )}

      {/* Фідбек від викладача */}
      {submission?.feedback && (
        <div className="border-t bg-blue-50 p-4 dark:bg-blue-950/30">
          <p className="mb-1 text-sm font-medium text-blue-900 dark:text-blue-100">
            Коментар викладача:
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">{submission.feedback}</p>
        </div>
      )}
    </div>
  )
}
