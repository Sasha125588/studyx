'use client'

import {
	type BlockSubmission,
	type QuizBlock as QuizBlockType,
	type QuizQuestion,
	SubmissionTypes
} from '@studyx/types'
import { CheckIcon, HelpCircle, SendIcon } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'

import { cn } from '../../../shared/utils'
import { Button, Input } from '../../base'

interface QuizBlockProps {
	block: QuizBlockType
	lessonId: number
	submission?: BlockSubmission
	isPreview?: boolean
}

interface Answer {
	questionId: string
	selectedOptionIds?: string[]
	textAnswer?: string
}

export const QuizBlock = ({ block, submission, isPreview = false }: QuizBlockProps) => {
	const [answers, setAnswers] = useState<Answer[]>(() => {
		if (submission?.content.type === SubmissionTypes.QUIZ) {
			return submission.content.answers
		}
		return []
	})
	const [isPending, startTransition] = useTransition()
	const [isSubmitted, setIsSubmitted] = useState(!!submission)
	const [showResults, setShowResults] = useState(!!submission)

	const totalPoints = block.questions.reduce((sum, q) => sum + q.points, 0)

	const earnedPoints = answers.reduce((sum, answer) => {
		const question = block.questions.find(q => q.id === answer.questionId)
		if (!question) return sum

		let isCorrect = false

		if (question.type === 'text') {
			isCorrect =
				answer.textAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()
		} else {
			isCorrect =
				question.options?.some(
					option => option.id === answer.selectedOptionIds?.[0] && option.isCorrect
				) ?? false
		}

		return sum + (isCorrect ? question.points : 0)
	}, 0)

	const correctPointsPercentage = Math.round((earnedPoints / totalPoints) * 100)

	const getAnswer = (questionId: string): Answer | undefined => {
		return answers.find(a => a.questionId === questionId)
	}

	const handleOptionSelect = (questionId: string, optionId: string, isMultiple: boolean) => {
		if (isSubmitted || isPreview) return

		setAnswers(prev => {
			const existing = prev.find(a => a.questionId === questionId)

			if (isMultiple) {
				const currentOptions = existing?.selectedOptionIds ?? []
				const newOptions = currentOptions.includes(optionId)
					? currentOptions.filter(id => id !== optionId)
					: [...currentOptions, optionId]

				return existing
					? prev.map(a =>
							a.questionId === questionId ? { ...a, selectedOptionIds: newOptions } : a
						)
					: [...prev, { questionId, selectedOptionIds: newOptions }]
			} else {
				return existing
					? prev.map(a =>
							a.questionId === questionId ? { ...a, selectedOptionIds: [optionId] } : a
						)
					: [...prev, { questionId, selectedOptionIds: [optionId] }]
			}
		})
	}

	const handleTextAnswer = (questionId: string, text: string) => {
		if (isSubmitted || isPreview) return

		setAnswers(prev => {
			const existing = prev.find(a => a.questionId === questionId)
			return existing
				? prev.map(a => (a.questionId === questionId ? { ...a, textAnswer: text } : a))
				: [...prev, { questionId, textAnswer: text }]
		})
	}

	const handleSubmit = useCallback(async () => {
		if (isPreview) return

		startTransition(async () => {
			try {
				// TODO: Відправка на сервер
				await new Promise(resolve => setTimeout(resolve, 1000))
				setIsSubmitted(true)
				setShowResults(block.showCorrectAnswers ?? true)
			} catch (error) {
				console.error('Failed to submit quiz:', error)
			}
		})
	}, [isPreview, block.showCorrectAnswers, startTransition])

	const isOptionCorrect = (question: QuizQuestion, optionId: string): boolean | null => {
		if (!showResults) return null
		return question.options?.find(o => o.id === optionId)?.isCorrect ?? false
	}

	const isQuestionAnsweredCorrectly = (question: QuizQuestion) => {
		if (!showResults) return null
		const answer = getAnswer(question.id)
		if (!answer) return false

		if (question.type === 'text') {
			return (
				answer.textAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()
			)
		}

		const correctOptionIds = question.options?.filter(o => o.isCorrect).map(o => o.id) ?? []
		const selectedIds = answer.selectedOptionIds ?? []

		return (
			correctOptionIds.length === selectedIds.length &&
			correctOptionIds.every(id => selectedIds.includes(id))
		)
	}

	return (
		<div className='overflow-hidden rounded-xl border-2 border-amber-200 dark:border-amber-800'>
			{/* Заголовок */}
			<div className='flex items-center justify-between bg-amber-50 px-4 py-3 dark:bg-amber-950/50'>
				<div className='flex items-center gap-2'>
					<HelpCircle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
					<span className='font-semibold text-amber-900 dark:text-amber-100'>
						{block.title ?? 'Тест'}
					</span>
				</div>
			</div>

			{/* Опис
			{block.description && (
				<div className='prose prose-sm dark:prose-invert max-w-none border-b px-4 py-3'>
					<ReactMarkdown>{block.description}</ReactMarkdown>
				</div>
			)} */}

			{/* Питання */}
			<div className='divide-y'>
				{block.questions.map((question, index) => {
					const isAnsweredCorrectly = isQuestionAnsweredCorrectly(question)

					return (
						<div
							key={question.id}
							className='p-4'
						>
							<div className='mb-3 flex h-10 items-center justify-between'>
								<div className='flex items-center gap-2'>
									<span
										className={cn(
											'border-muted-foreground/30 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
											isAnsweredCorrectly === null
												? ''
												: isAnsweredCorrectly
													? 'border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
													: 'border-red-500 bg-red-200 dark:border-red-700 dark:bg-red-950/30'
										)}
									>
										{index + 1}
									</span>
									<p className='text-[15px]'>{question.text}</p>
								</div>
								<span className='text-muted-foreground text-xs'>
									{question.points} {question.points === 1 ? 'бал' : 'балів'}
								</span>
							</div>

							{/* Варіанти відповіді */}
							{question.type !== 'text' && question.options && (
								<div className='ml-8 space-y-2'>
									{question.options.map(option => {
										const answer = getAnswer(question.id)
										const isSelected = answer?.selectedOptionIds?.includes(option.id)
										const correctStatus = isOptionCorrect(question, option.id)

										return (
											<button
												key={option.id}
												onClick={() =>
													handleOptionSelect(question.id, option.id, question.type === 'multiple')
												}
												disabled={isSubmitted || isPreview}
												className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
													isSelected
														? showResults
															? correctStatus
																? 'border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
																: 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950/30'
															: 'border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30'
														: showResults && correctStatus
															? 'border-green-500 bg-green-50/50 dark:border-green-700 dark:bg-green-950/20'
															: 'hover:bg-muted/50'
												} disabled:cursor-not-allowed`}
											>
												<div
													className={`border-muted-foreground/30 rounded-${question.type === 'multiple' ? '2xs' : 'full'} flex size-5 shrink-0 items-center justify-center border`}
												>
													{isSelected && (
														<CheckIcon
															size={12}
															className='stroke-blue-500 stroke-3'
														/>
													)}
												</div>
												<span className='text-sm'>{option.text}</span>
											</button>
										)
									})}
								</div>
							)}

							{/* Текстова відповідь */}
							{question.type === 'text' && (
								<div className='ml-8'>
									<Input
										value={getAnswer(question.id)?.textAnswer ?? ''}
										onChange={e => handleTextAnswer(question.id, e.target.value)}
										disabled={isSubmitted || isPreview}
										placeholder='Введіть відповідь...'
										// className='border-input bg-background w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
									/>
									{showResults && question.correctAnswer && (
										<p className='text-accent-foreground/90 mt-1 text-sm'>
											Правильна відповідь: {question.correctAnswer}
										</p>
									)}
								</div>
							)}

							{/* Пояснення */}
							{showResults && question.explanation && (
								<div className='mt-3 ml-8 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-200'>
									<strong>Пояснення:</strong> {question.explanation}
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* Кнопка відправки */}
			{!isSubmitted && !isPreview && (
				<div className='border-t bg-gray-50 px-4 py-3 dark:bg-gray-900/50'>
					<Button
						onClick={handleSubmit}
						disabled={isPending || answers.length !== block.questions.length}
						className='bg-primary hover:bg-primary/90 w-full gap-2 text-white'
					>
						<SendIcon size={16} />
						{isPending ? 'Відправка...' : 'Завершити тест'}
					</Button>
					{answers.length !== block.questions.length && (
						<p className='text-muted-foreground mt-2 text-center text-xs'>
							Відповіді на всі питання: {answers.length}/{block.questions.length}
						</p>
					)}
				</div>
			)}

			{/* Результат */}
			{isSubmitted && (
				<div
					className={cn(
						'border-t p-4 text-center',
						correctPointsPercentage >= 50
							? 'bg-green-50 dark:bg-green-950/30'
							: 'bg-red-50 dark:bg-red-950/30'
					)}
				>
					<p
						className={cn(
							'font-semibold',
							correctPointsPercentage >= 50
								? 'text-green-800 dark:text-green-200'
								: 'text-red-800 dark:text-red-200'
						)}
					>
						Тест завершено! Ваш результат: {earnedPoints}/{totalPoints} балів
					</p>
					<p className='text-muted-foreground mt-2 text-center text-xs'>
						Відсоток правильних відповідей: {correctPointsPercentage}%
					</p>
				</div>
			)}
		</div>
	)
}
