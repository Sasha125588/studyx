'use client'

import type { BlockType, Course, LessonBlock, Module } from '@studyx/types'
import { ArrowLeftIcon, EyeIcon, Loader2Icon, SaveIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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

import { handleCreateLesson } from '../../(actions)/handleCreateLesson'
import { handleUpdateLesson } from '../../(actions)/handleUpdateLesson'

import { BlockList } from './BlockList'
import { BlockToolbar } from './BlockToolbar'
import { BlockRenderer } from '@/app/(private)/courses/[slug]/[lessonSlug]/(components)/LessonPage/components/blocks'

interface LessonEditorProps {
	initialData?: {
		id?: number
		title: string
		slug: string
		type: 'lecture' | 'practical' | 'test'
		blocks: LessonBlock[]
		moduleId?: number
		courseId?: number
	}
	courses?: Course[]
	modules?: Module[]
}

export const LessonEditor = ({
	initialData,
	courses = [],
	modules: initialModules = []
}: LessonEditorProps) => {
	const [title, setTitle] = useState(initialData?.title ?? '')
	const [slug, setSlug] = useState(initialData?.slug ?? '')
	const [type, setType] = useState<'lecture' | 'practical' | 'test'>(initialData?.type ?? 'lecture')
	const [blocks, setBlocks] = useState<LessonBlock[]>(initialData?.blocks ?? [])
	const [isPreview, setIsPreview] = useState(false)
	const [isSaving, setIsSaving] = useState(false)

	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
		initialData?.courseId ?? null
	)
	const [selectedModuleId, setSelectedModuleId] = useState<number | null>(
		initialData?.moduleId ?? null
	)
	const [availableModules, setAvailableModules] = useState<Module[]>(initialModules)
	const [isLoadingModules, setIsLoadingModules] = useState(false)

	useEffect(() => {
		if (!selectedCourseId) {
			setAvailableModules([])
			setSelectedModuleId(null)
			return
		}

		const loadModules = async () => {
			setIsLoadingModules(true)
			try {
				const response = await fetch(`/api/modules/course?courseId=${selectedCourseId}`)
				const data = (await response.json()) ?? []
				setAvailableModules(data)
			} catch (error) {
				console.error('Failed to load modules:', error)
			} finally {
				setIsLoadingModules(false)
			}
		}

		loadModules()
	}, [selectedCourseId])

	const generateSlug = useCallback((text: string) => {
		return text
			.toLowerCase()
			.replace(/[^a-zа-яіїєґ0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.slice(0, 100)
	}, [])

	const handleTitleChange = (value: string) => {
		setTitle(value)
		if (!initialData?.id) {
			setSlug(generateSlug(value))
		}
	}

	const addBlock = useCallback((blockType: BlockType) => {
		const id = nanoid()

		const newBlock = createEmptyBlock(blockType, id)
		setBlocks(prev => [...prev, newBlock])
	}, [])

	const updateBlock = useCallback((id: string, updates: Partial<LessonBlock>) => {
		setBlocks(prev =>
			prev.map(block => (block.id === id ? ({ ...block, ...updates } as LessonBlock) : block))
		)
	}, [])

	const deleteBlock = useCallback((id: string) => {
		setBlocks(prev => prev.filter(block => block.id !== id))
	}, [])

	const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
		setBlocks(prev => {
			const index = prev.findIndex(b => b.id === id)
			if (index === -1) return prev
			if (direction === 'up' && index === 0) return prev
			if (direction === 'down' && index === prev.length - 1) return prev

			const newBlocks = [...prev]
			const swapIndex = direction === 'up' ? index - 1 : index + 1
			;[newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]]
			return newBlocks
		})
	}, [])

	const duplicateBlock = useCallback((id: string) => {
		setBlocks(prev => {
			const index = prev.findIndex(block => block.id === id)
			if (index === -1) return prev

			const block = prev[index]
			const newBlock = { ...block, id: nanoid() }
			const newBlocks = [...prev]
			newBlocks.splice(index + 1, 0, newBlock)
			return newBlocks
		})
	}, [])

	const handleSave = async () => {
		if (!title.trim()) {
			alert('Введіть назву уроку')
			return
		}

		if (!selectedModuleId) {
			alert('Оберіть модуль для уроку')
			return
		}

		setIsSaving(true)
		try {
			const lessonData = {
				title,
				slug,
				type,
				blocks,
				moduleId: selectedModuleId
			}

			const method = initialData?.id ? 'PUT' : 'POST'

			if (method === 'PUT') {
				const response = await handleUpdateLesson({ id: initialData?.id ?? 0, ...lessonData })
				if (response.error) {
					toast.error('Помилка збереження')
					return
				}
			} else {
				const response = await handleCreateLesson(lessonData)
				if (response.error) {
					toast.error('Помилка збереження')
					return
				}
			}

			toast.success('Урок збережено!')
		} catch (error) {
			console.error('Failed to save:', error)
			toast.error('Помилка збереження')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='bg-card flex items-center justify-between rounded-xl border p-4'>
				<div className='flex items-center gap-4'>
					<Link href='/admin/lessons'>
						<Button
							variant='ghost'
							size='sm'
						>
							<ArrowLeftIcon className='mr-2 h-4 w-4' />
							Назад
						</Button>
					</Link>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setIsPreview(!isPreview)}
					>
						<EyeIcon className='mr-2 h-4 w-4' />
						{isPreview ? 'Редагування' : 'Перегляд'}
					</Button>
					<Button
						size='sm'
						onClick={handleSave}
						disabled={isSaving}
					>
						<SaveIcon className='mr-2 h-4 w-4' />
						{isSaving ? 'Збереження...' : 'Зберегти'}
					</Button>
				</div>
			</div>

			{/* Meta fields */}
			<div className='bg-card rounded-xl border p-6'>
				{/* Курс і Модуль */}
				<div className='mb-6 grid gap-6 md:grid-cols-2'>
					<div>
						<Label htmlFor='course'>Курс</Label>
						<Select
							value={selectedCourseId?.toString() ?? ''}
							onValueChange={v => {
								setSelectedCourseId(v ? Number(v) : null)
								setSelectedModuleId(null)
							}}
						>
							<SelectTrigger className='mt-1.5'>
								<SelectValue placeholder='Оберіть курс' />
							</SelectTrigger>
							<SelectContent>
								{courses.map(course => (
									<SelectItem
										key={course.id}
										value={course.id.toString()}
									>
										{course.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor='module'>Модуль</Label>
						<Select
							value={selectedModuleId?.toString() ?? ''}
							onValueChange={v => setSelectedModuleId(v ? Number(v) : null)}
							disabled={!selectedCourseId || isLoadingModules}
						>
							<SelectTrigger className='mt-1.5'>
								{isLoadingModules ? (
									<div className='flex items-center gap-2'>
										<Loader2Icon className='h-4 w-4 animate-spin' />
										<span>Завантаження...</span>
									</div>
								) : (
									<SelectValue
										placeholder={selectedCourseId ? 'Оберіть модуль' : 'Спочатку оберіть курс'}
									/>
								)}
							</SelectTrigger>
							<SelectContent>
								{availableModules.map(module => (
									<SelectItem
										key={module.id}
										value={module.id.toString()}
									>
										{module.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Назва і Тип */}
				<div className='grid gap-6 md:grid-cols-3'>
					<div className='md:col-span-2'>
						<Label htmlFor='title'>Назва уроку</Label>
						<Input
							id='title'
							value={title}
							onChange={e => handleTitleChange(e.target.value)}
							placeholder='Введіть назву уроку'
							className='mt-1.5'
						/>
					</div>
					<div>
						<Label htmlFor='type'>Тип уроку</Label>
						<Select
							value={type}
							onValueChange={v => setType(v as typeof type)}
						>
							<SelectTrigger className='mt-1.5'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='lecture'>Лекція</SelectItem>
								<SelectItem value='practical'>Практична</SelectItem>
								<SelectItem value='test'>Тест</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='mt-4'>
					<Label htmlFor='slug'>URL-адреса (slug)</Label>
					<Input
						id='slug'
						value={slug}
						onChange={e => setSlug(e.target.value)}
						placeholder='url-адреса-уроку'
						className='mt-1.5 font-mono text-sm'
					/>
				</div>
			</div>

			{/* Content */}
			{isPreview ? (
				<div className='bg-card rounded-xl border p-6'>
					<h2 className='mb-6 text-2xl font-bold'>{title || 'Назва уроку'}</h2>
					<BlockRenderer
						blocks={blocks}
						lessonId={0}
						isPreview={true}
					/>
				</div>
			) : (
				<>
					{/* Block Toolbar */}
					<BlockToolbar onAddBlock={addBlock} />

					{/* Block List */}
					<BlockList
						blocks={blocks}
						onUpdateBlock={updateBlock}
						onDeleteBlock={deleteBlock}
						onMoveBlock={moveBlock}
						onDuplicateBlock={duplicateBlock}
					/>

					{blocks.length === 0 && (
						<div className='rounded-xl border-2 border-dashed py-16 text-center'>
							<p className='text-muted-foreground text-lg'>Урок порожній</p>
							<p className='text-muted-foreground mt-1 text-sm'>
								Натисніть на кнопку вище, щоб додати перший блок
							</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}

const createEmptyBlock = (type: BlockType, id: string): LessonBlock => {
	switch (type) {
		case 'text':
			return { id, type: 'text' as const, content: '' }
		case 'heading':
			return { id, type: 'heading' as const, level: 2 as const, text: '' }
		case 'image':
			return { id, type: 'image' as const, url: '', alt: '' }
		case 'video':
			return { id, type: 'video' as const, url: '', provider: 'youtube' as const }
		case 'callout':
			return { id, type: 'callout' as const, variant: 'info' as const, content: '' }
		case 'divider':
			return { id, type: 'divider' as const }
		case 'code':
			return {
				id,
				type: 'code' as const,
				language: 'javascript' as const,
				code: '',
				readonly: true,
				runnable: false
			}
		case 'code-exercise':
			return {
				id,
				type: 'code-exercise' as const,
				language: 'javascript' as const,
				instructions: '',
				starterCode: '',
				maxScore: 10
			}
		case 'file-upload':
			return {
				id,
				type: 'file-upload' as const,
				instructions: '',
				allowedTypes: ['pdf'],
				maxFiles: 1,
				maxSizeMB: 10,
				maxScore: 10
			}
		case 'quiz':
			return {
				id,
				type: 'quiz' as const,
				questions: [],
				showCorrectAnswers: true
			}
		default:
			throw new Error(`Unknown block type: ${type}`)
	}
}
