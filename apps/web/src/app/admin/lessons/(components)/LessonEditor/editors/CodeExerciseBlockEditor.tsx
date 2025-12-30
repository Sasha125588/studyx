'use client'

import type { CodeExerciseBlock, CodeLanguage } from '@studyx/types'
import { CODE_LANGUAGES } from '@studyx/types'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

interface CodeExerciseBlockEditorProps {
	block: CodeExerciseBlock
	onUpdate: (updates: Partial<CodeExerciseBlock>) => void
}

export const CodeExerciseBlockEditor = ({ block, onUpdate }: CodeExerciseBlockEditorProps) => {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 md:grid-cols-3'>
				<div>
					<Label className='text-xs'>Мова програмування</Label>
					<Select
						value={block.language}
						onValueChange={v => onUpdate({ language: v as CodeLanguage })}
					>
						<SelectTrigger className='mt-1.5'>
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
				<div>
					<Label className='text-xs'>Макс. балів</Label>
					<Input
						type='number'
						min={1}
						max={100}
						value={block.maxScore}
						onChange={e => onUpdate({ maxScore: Number(e.target.value) })}
						className='mt-1.5'
					/>
				</div>
				<div>
					<Label className='text-xs'>Очікуваний вивід (необов&apos;язково)</Label>
					<Input
						value={block.expectedOutput ?? ''}
						onChange={e => onUpdate({ expectedOutput: e.target.value })}
						placeholder='Hello, World!'
						className='mt-1.5'
					/>
				</div>
			</div>

			<div>
				<Label className='text-xs'>Умова завдання (Markdown)</Label>
				<textarea
					value={block.instructions}
					onChange={e => onUpdate({ instructions: e.target.value })}
					placeholder='Опишіть завдання для студента...'
					rows={4}
					className='border-input bg-background focus:ring-ring mt-1.5 w-full resize-y rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none'
				/>
			</div>

			<div>
				<Label className='text-xs'>Початковий код (шаблон для студента)</Label>
				<textarea
					value={block.starterCode}
					onChange={e => onUpdate({ starterCode: e.target.value })}
					placeholder='// Введіть початковий код тут...'
					rows={6}
					className='mt-1.5 w-full resize-y rounded-lg border bg-[#0d1117] p-4 font-mono text-sm text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none'
					spellCheck={false}
				/>
			</div>

			<div>
				<Label className='text-xs'>Правильне рішення (тільки для викладача)</Label>
				<textarea
					value={block.solutionCode ?? ''}
					onChange={e => onUpdate({ solutionCode: e.target.value })}
					placeholder='// Введіть правильне рішення...'
					rows={6}
					className='mt-1.5 w-full resize-y rounded-lg border bg-[#0d1117] p-4 font-mono text-sm text-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none'
					spellCheck={false}
				/>
				<p className='text-muted-foreground mt-1 text-xs'>Це рішення не буде видно студентам</p>
			</div>
		</div>
	)
}
