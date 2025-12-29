'use client'

import {
	type BlockSubmission,
	type FileUploadBlock as FileUploadBlockType,
	SubmissionTypes
} from '@studyx/types'
import { AlertCircle, Check, File, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface FileUploadBlockProps {
	block: FileUploadBlockType
	lessonId?: number // Буде використано для API запитів
	submission?: BlockSubmission
	isPreview?: boolean
}

interface UploadedFile {
	id: string
	name: string
	size: number
	status: 'uploading' | 'done' | 'error'
}

export const FileUploadBlock = ({ block, submission, isPreview = false }: FileUploadBlockProps) => {
	const [files, setFiles] = useState<UploadedFile[]>(() => {
		if (submission?.content.type === SubmissionTypes.FILE) {
			return submission.content.files.map(f => ({
				id: f.id,
				name: f.originalFilename,
				size: f.sizeBytes,
				status: 'done' as const
			}))
		}
		return []
	})
	const [isDragging, setIsDragging] = useState(false)

	const isGraded = submission?.score !== null && submission?.score !== undefined

	// Обробка файлів - визначено перед використанням в інших callbacks
	const handleFiles = useCallback(
		(newFiles: File[]) => {
			// Перевірка кількості файлів
			if (files.length + newFiles.length > block.maxFiles) {
				alert(`Максимальна кількість файлів: ${block.maxFiles}`)
				return
			}

			// Перевірка типів файлів
			const allowedExtensions = block.allowedTypes.map(t => `.${t.toLowerCase()}`)
			const validFiles = newFiles.filter(file => {
				const ext = '.' + file.name.split('.').pop()?.toLowerCase()
				return allowedExtensions.includes(ext)
			})

			if (validFiles.length !== newFiles.length) {
				alert(`Дозволені формати: ${block.allowedTypes.join(', ')}`)
			}

			// Перевірка розміру
			const maxSizeBytes = block.maxSizeMB * 1024 * 1024
			const sizeValidFiles = validFiles.filter(file => {
				if (file.size > maxSizeBytes) {
					alert(`Файл "${file.name}" перевищує максимальний розмір ${block.maxSizeMB} MB`)
					return false
				}
				return true
			})

			// Додаємо файли
			const uploadedFiles: UploadedFile[] = sizeValidFiles.map(file => ({
				id: crypto.randomUUID(),
				name: file.name,
				size: file.size,
				status: 'uploading' as const
			}))

			setFiles(prev => [...prev, ...uploadedFiles])

			// TODO: Реальне завантаження на сервер
			// Імітуємо завантаження
			uploadedFiles.forEach(file => {
				setTimeout(() => {
					setFiles(prev =>
						prev.map(f => (f.id === file.id ? { ...f, status: 'done' as const } : f))
					)
				}, 1500)
			})
		},
		[files.length, block.maxFiles, block.allowedTypes, block.maxSizeMB]
	)

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)

			if (isPreview || isGraded) return

			const droppedFiles = Array.from(e.dataTransfer.files)
			handleFiles(droppedFiles)
		},
		[isPreview, isGraded, handleFiles]
	)

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files || isPreview || isGraded) return

			const selectedFiles = Array.from(e.target.files)
			handleFiles(selectedFiles)
		},
		[isPreview, isGraded, handleFiles]
	)

	const removeFile = (id: string) => {
		setFiles(prev => prev.filter(f => f.id !== id))
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	return (
		<div className='overflow-hidden rounded-xl border-2 border-violet-200 dark:border-violet-800'>
			{/* Заголовок */}
			<div className='flex items-center justify-between bg-violet-50 px-4 py-3 dark:bg-violet-950/50'>
				<div className='flex items-center gap-2'>
					<Upload className='h-5 w-5 text-violet-600 dark:text-violet-400' />
					<span className='font-semibold text-violet-900 dark:text-violet-100'>
						Завантаження файлів
					</span>
				</div>
				<div className='flex items-center gap-2'>
					<Badge variant={isGraded ? 'default' : 'secondary'}>
						{isGraded ? `${submission.score}/${block.maxScore} балів` : `${block.maxScore} балів`}
					</Badge>
				</div>
			</div>

			{/* Інструкції */}
			<div className='prose prose-sm dark:prose-invert max-w-none border-b px-4 py-3'>
				<ReactMarkdown>{block.instructions}</ReactMarkdown>
			</div>

			{/* Зона завантаження */}
			{!isPreview && !isGraded && (
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`m-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
						isDragging
							? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
							: 'border-muted-foreground/25 hover:border-muted-foreground/50'
					}`}
				>
					<Upload className='text-muted-foreground mx-auto h-10 w-10' />
					<p className='text-muted-foreground mt-2'>
						Перетягніть файли сюди або{' '}
						<label className='cursor-pointer text-violet-600 underline hover:no-underline dark:text-violet-400'>
							виберіть
							<input
								type='file'
								className='hidden'
								multiple={block.maxFiles > 1}
								accept={block.allowedTypes.map(t => `.${t}`).join(',')}
								onChange={handleFileSelect}
							/>
						</label>
					</p>
					<p className='text-muted-foreground mt-1 text-xs'>
						Формати: {block.allowedTypes.join(', ')} • Макс. {block.maxSizeMB} MB • До{' '}
						{block.maxFiles} файлів
					</p>
				</div>
			)}

			{/* Список файлів */}
			{files.length > 0 && (
				<div className='border-t p-4'>
					<p className='mb-2 text-sm font-medium'>Завантажені файли:</p>
					<ul className='space-y-2'>
						{files.map(file => (
							<li
								key={file.id}
								className='bg-muted/50 flex items-center justify-between rounded-lg p-3'
							>
								<div className='flex items-center gap-3'>
									<File className='h-5 w-5 text-violet-600' />
									<div>
										<p className='text-sm font-medium'>{file.name}</p>
										<p className='text-muted-foreground text-xs'>{formatFileSize(file.size)}</p>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									{file.status === 'uploading' && (
										<span className='text-muted-foreground text-xs'>Завантаження...</span>
									)}
									{file.status === 'done' && <Check className='h-4 w-4 text-green-600' />}
									{file.status === 'error' && <AlertCircle className='h-4 w-4 text-red-600' />}
									{!isPreview && !isGraded && (
										<Button
											variant='ghost'
											size='sm'
											onClick={() => removeFile(file.id)}
											className='h-8 w-8 p-0'
										>
											<X className='h-4 w-4' />
										</Button>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Фідбек від викладача */}
			{submission?.feedback && (
				<div className='border-t bg-blue-50 p-4 dark:bg-blue-950/30'>
					<p className='mb-1 text-sm font-medium text-blue-900 dark:text-blue-100'>
						Коментар викладача:
					</p>
					<p className='text-sm text-blue-800 dark:text-blue-200'>{submission.feedback}</p>
				</div>
			)}
		</div>
	)
}
