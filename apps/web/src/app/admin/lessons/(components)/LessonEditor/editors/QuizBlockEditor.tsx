'use client'

import type { QuizBlock, QuizOption, QuizQuestion, QuizQuestionType } from '@studyx/types'
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { nanoid } from 'nanoid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

interface QuizBlockEditorProps {
	block: QuizBlock
	onUpdate: (updates: Partial<QuizBlock>) => void
}

export const QuizBlockEditor = ({ block, onUpdate }: QuizBlockEditorProps) => {
	const addQuestion = () => {
		const newQuestion: QuizQuestion = {
			id: nanoid(),
			text: '',
			type: 'single',
			options: [
				{ id: nanoid(), text: '', isCorrect: false },
				{ id: nanoid(), text: '', isCorrect: false }
			],
			points: 1
		}
		onUpdate({ questions: [...block.questions, newQuestion] })
	}

	const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
		const newQuestions = [...block.questions]
		newQuestions[index] = { ...newQuestions[index], ...updates }
		onUpdate({ questions: newQuestions })
	}

	const deleteQuestion = (index: number) => {
		onUpdate({ questions: block.questions.filter((_, i) => i !== index) })
	}

	return (
		<div className='space-y-4'>
			{/* Quiz settings */}
			<div className='grid gap-4 md:grid-cols-3'>
				<div>
					<Label className='text-xs'>Назва тесту (необов&apos;язково)</Label>
					<Input
						value={block.title ?? ''}
						onChange={e => onUpdate({ title: e.target.value })}
						placeholder='Тест з теми...'
						className='mt-1.5'
					/>
				</div>
				<div>
					<Label className='text-xs'>Макс. спроб</Label>
					<Input
						type='number'
						min={1}
						value={block.maxAttempts ?? ''}
						onChange={e =>
							onUpdate({ maxAttempts: e.target.value ? Number(e.target.value) : undefined })
						}
						placeholder='Безліміт'
						className='mt-1.5'
					/>
				</div>
				<div className='flex items-end gap-4'>
					<label className='flex cursor-pointer items-center gap-2'>
						<input
							type='checkbox'
							checked={block.showCorrectAnswers ?? true}
							onChange={e => onUpdate({ showCorrectAnswers: e.target.checked })}
							className='h-4 w-4'
						/>
						<span className='text-sm'>Показувати відповіді</span>
					</label>
				</div>
			</div>

			{/* Questions */}
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<Label className='text-sm font-medium'>Питання ({block.questions.length})</Label>
					<Button
						variant='outline'
						size='sm'
						onClick={addQuestion}
					>
						<PlusIcon className='mr-2 h-4 w-4' />
						Додати питання
					</Button>
				</div>

				{block.questions.map((question, index) => (
					<QuestionEditor
						key={question.id}
						question={question}
						index={index}
						onUpdate={updates => updateQuestion(index, updates)}
						onDelete={() => deleteQuestion(index)}
					/>
				))}

				{block.questions.length === 0 && (
					<div className='rounded-lg border-2 border-dashed py-8 text-center'>
						<p className='text-muted-foreground'>Додайте перше питання, щоб почати</p>
					</div>
				)}
			</div>
		</div>
	)
}

interface QuestionEditorProps {
	question: QuizQuestion
	index: number
	onUpdate: (updates: Partial<QuizQuestion>) => void
	onDelete: () => void
}

const QuestionEditor = ({ question, index, onUpdate, onDelete }: QuestionEditorProps) => {
	const addOption = () => {
		const newOption: QuizOption = { id: nanoid(), text: '', isCorrect: false }
		onUpdate({ options: [...(question.options ?? []), newOption] })
	}

	const updateOption = (optionIndex: number, updates: Partial<QuizOption>) => {
		const newOptions = [...(question.options ?? [])]
		newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates }

		// Для single choice — тільки одна правильна відповідь
		if (question.type === 'single' && updates.isCorrect) {
			newOptions.forEach((opt, i) => {
				if (i !== optionIndex) opt.isCorrect = false
			})
		}

		onUpdate({ options: newOptions })
	}

	const deleteOption = (optionIndex: number) => {
		onUpdate({ options: question.options?.filter((_, i) => i !== optionIndex) })
	}

	return (
		<div className='rounded-lg border bg-gray-50 p-4 dark:bg-gray-900/50'>
			<div className='mb-3 flex items-start gap-3'>
				<GripVerticalIcon className='text-muted-foreground mt-2 h-4 w-4 shrink-0' />
				<div className='min-w-0 flex-1 space-y-3'>
					<div className='flex gap-3'>
						<div className='flex-1'>
							<Input
								value={question.text}
								onChange={e => onUpdate({ text: e.target.value })}
								placeholder={`Питання ${index + 1}`}
								className='font-medium'
							/>
						</div>
						<Select
							value={question.type}
							onValueChange={v => onUpdate({ type: v as QuizQuestionType })}
						>
							<SelectTrigger className='w-40'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='single'>Одна відповідь</SelectItem>
								<SelectItem value='multiple'>Кілька відповідей</SelectItem>
								<SelectItem value='text'>Текстова</SelectItem>
							</SelectContent>
						</Select>
						<Input
							type='number'
							min={1}
							max={10}
							value={question.points}
							onChange={e => onUpdate({ points: Number(e.target.value) })}
							className='w-20'
							title='Бали'
						/>
						<Button
							variant='ghost'
							size='sm'
							onClick={onDelete}
							className='text-red-500 hover:text-red-600'
						>
							<Trash2Icon className='h-4 w-4' />
						</Button>
					</div>

					{/* Options for single/multiple */}
					{question.type !== 'text' && (
						<div className='space-y-2'>
							{question.options?.map((option, optionIndex) => (
								<div
									key={option.id}
									className='flex items-center gap-2'
								>
									<input
										type={question.type === 'single' ? 'radio' : 'checkbox'}
										checked={option.isCorrect}
										onChange={e => updateOption(optionIndex, { isCorrect: e.target.checked })}
										className='h-4 w-4'
									/>
									<Input
										value={option.text}
										onChange={e => updateOption(optionIndex, { text: e.target.value })}
										placeholder={`Варіант ${optionIndex + 1}`}
										className='flex-1'
									/>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => deleteOption(optionIndex)}
										className='h-8 w-8 p-0'
									>
										<Trash2Icon className='h-3 w-3' />
									</Button>
								</div>
							))}
							<Button
								variant='outline'
								size='sm'
								onClick={addOption}
								className='mt-2'
							>
								<PlusIcon className='mr-1 h-3 w-3' />
								Додати варіант
							</Button>
						</div>
					)}

					{/* Correct answer for text type */}
					{question.type === 'text' && (
						<div>
							<Label className='text-xs'>Правильна відповідь</Label>
							<Input
								value={question.correctAnswer ?? ''}
								onChange={e => onUpdate({ correctAnswer: e.target.value })}
								placeholder='Введіть правильну відповідь'
								className='mt-1'
							/>
						</div>
					)}

					{/* Explanation */}
					<div>
						<Label className='text-xs'>Пояснення (необов&apos;язково)</Label>
						<Input
							value={question.explanation ?? ''}
							onChange={e => onUpdate({ explanation: e.target.value })}
							placeholder='Пояснення правильної відповіді'
							className='mt-1'
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
