'use client'

import type { LessonAttachment, LessonNavItem } from '@studyx/types'
import { Button } from '@studyx/ui/base'
import {
	ArrowRightIcon,
	ExternalLinkIcon,
	FileIcon,
	FileTextIcon,
	LinkIcon,
	// ListIcon,
	SparklesIcon
} from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/shared/helpers'

interface LessonRightPanelProps {
	attachments: LessonAttachment[]
	nextLesson: LessonNavItem | null
	courseSlug: string
}

// interface TocItem {
// 	id: string
// 	text: string
// 	level: number
// }

export const LessonRightPanel = ({
	attachments,
	nextLesson,
	courseSlug
}: LessonRightPanelProps) => {
	// const [activeId, setActiveId] = useState<string>('')
	const [isCompleted, setIsCompleted] = useState(false)
	const [showCompletionModal, setShowCompletionModal] = useState(false)
	// const tocItems = extractTocFromMarkdown(content)

	const { scrollYProgress } = useScroll()
	const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
	const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100])
	const [displayPercent, setDisplayPercent] = useState(0)

	useEffect(() => {
		const unsubscribe = progressPercent.on('change', v => {
			setDisplayPercent(Math.round(v))
			if (v > 95 && !isCompleted) {
				setIsCompleted(true)
				setTimeout(() => setShowCompletionModal(true), 500)
			}
		})
		return () => unsubscribe()
	}, [progressPercent, isCompleted])

	// useEffect(() => {
	// 	const observer = new IntersectionObserver(
	// 		entries => {
	// 			entries.forEach(entry => {
	// 				if (entry.isIntersecting) {
	// 					setActiveId(entry.target.id)
	// 				}
	// 			})
	// 		},
	// 		{
	// 			rootMargin: '-80px 0px -80% 0px',
	// 			threshold: 0
	// 		}
	// 	)

	// 	tocItems.forEach(item => {
	// 		const element = document.getElementById(item.id)
	// 		if (element) observer.observe(element)
	// 	})

	// 	return () => observer.disconnect()
	// }, [tocItems])

	// const scrollToSection = (id: string) => {
	// 	const element = document.getElementById(id)
	// 	if (element) {
	// 		element.scrollIntoView({ behavior: 'smooth', block: 'start' })
	// 	}
	// }

	// const activeIndex = tocItems.findIndex(item => item.id === activeId)

	return (
		<div className='space-y-4'>
			{/* {tocItems.length > 0 && (
				<div className='bg-card rounded-xl border p-4'>
					<div className='mb-3 flex items-center justify-between'>
						<div className='flex items-center gap-2 text-sm font-semibold'>
							<ListIcon className='h-4 w-4' />
							Зміст
						</div>
					</div>

					<div className='relative'>
						<nav className='relative space-y-0.5'>
							{tocItems.map((item, index) => {
								const isPassed = activeIndex >= index
								const isActive = activeId === item.id

								return (
									<button
										key={item.id}
										onClick={() => scrollToSection(item.id)}
										className={cn(
											'relative block w-full truncate rounded-r-lg px-2 py-1.5 text-left text-sm transition-all',
											item.level === 2 && 'pl-3',
											item.level === 3 && 'pl-5',
											isActive
												? 'bg-primary/10 text-primary font-medium'
												: isPassed
													? 'text-foreground'
													: 'text-muted-foreground hover:text-foreground'
										)}
									>
										<span
											className={cn(
												'absolute top-1/2 -left-4 h-2 w-2 -translate-y-1/2 rounded-full border-2 transition-all',
												isActive
													? 'scale-125 border-violet-500 bg-violet-500'
													: isPassed
														? 'border-violet-500 bg-violet-500'
														: 'bg-muted border-muted-foreground/30'
											)}
										/>
										{item.text}
									</button>
								)
							})}
						</nav>
					</div>
				</div>
			)} */}

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className='bg-card rounded-xl border p-4'
			>
				<div className='mb-3'>
					<div className='mb-1.5 flex items-center justify-between text-xs'>
						<span className='text-muted-foreground'>Прогрес читання</span>
						<span className='font-medium tabular-nums'>{displayPercent}%</span>
					</div>
					<div className='bg-muted h-2 overflow-hidden rounded-full'>
						<motion.div
							className='h-full rounded-full bg-linear-to-r from-violet-500 to-purple-500'
							style={{ scaleX: scaleY, transformOrigin: '0%' }}
						/>
					</div>
				</div>

				{isCompleted ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className='space-y-2'
					>
						{nextLesson && (
							<Link
								href={`/courses/${courseSlug}/${nextLesson.slug}`}
								className='block'
							>
								<Button
									variant='outline'
									size='sm'
									className='w-full gap-2'
								>
									Наступне заняття
									<ArrowRightIcon className='h-4 w-4' />
								</Button>
							</Link>
						)}
					</motion.div>
				) : (
					<p className='text-muted-foreground text-center text-xs'>
						Дочитайте до кінця для завершення
					</p>
				)}
			</motion.div>

			{attachments && attachments.length > 0 && (
				<div className='bg-card rounded-xl border p-4'>
					<div className='mb-3 flex items-center gap-2 text-sm font-semibold'>
						<FileIcon className='h-4 w-4' />
						Вкладення
					</div>
					<div className='space-y-2'>
						{attachments.map(attachment => (
							<a
								key={attachment.id}
								href={attachment.url ?? '#'}
								target='_blank'
								rel='noopener noreferrer'
								className='bg-muted/30 hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors'
							>
								<AttachmentIcon type={attachment.type} />
								<span className='flex-1 truncate'>{attachment.title}</span>
								<ExternalLinkIcon className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
							</a>
						))}
					</div>
				</div>
			)}

			<AnimatePresence>
				{showCompletionModal && (
					// Header має position: sticky(перекриває весь контент), тому використовується портал щоб модалка та блюр коректно відображалися
					<>
						{/* Backdrop */}
						{createPortal(
							<motion.button
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setShowCompletionModal(false)}
								className='fixed inset-0 -inset-y-4 z-40 bg-black/20 backdrop-blur-sm'
								aria-label='Закрити'
							/>,
							document.body
						)}

						{/* Modal */}
						{createPortal(
							<motion.div
								initial={{ opacity: 0, y: 100, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 100, scale: 0.9 }}
								transition={{ type: 'spring', damping: 25, stiffness: 300 }}
								className='fixed bottom-8 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4'
							>
								<div className='bg-card relative overflow-hidden rounded-2xl border p-6 shadow-xl'>
									{/* Декоративні градієнти */}
									<div className='absolute -top-10 -right-10 h-32 w-32 rounded-full bg-linear-to-br from-violet-400 to-purple-500 opacity-20 blur-2xl' />
									<div className='absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 opacity-20 blur-2xl' />

									<div className='relative space-y-4'>
										<div className='flex items-center gap-3'>
											<motion.div
												initial={{ scale: 0, rotate: -180 }}
												animate={{ scale: 1, rotate: 0 }}
												transition={{ delay: 0.2, type: 'spring', damping: 15 }}
												className='flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-lg'
											>
												<SparklesIcon className='h-6 w-6' />
											</motion.div>
											<div>
												<motion.h3
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.3 }}
													className='text-lg font-bold'
												>
													Ви дійшли до кінця! 🎉
												</motion.h3>
												<motion.p
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.4 }}
													className='text-muted-foreground text-sm'
												>
													Готові позначити як завершене?
												</motion.p>
											</div>
										</div>

										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
											className='flex flex-col gap-2 sm:flex-row'
										>
											<Button
												onClick={() => setShowCompletionModal(false)}
												variant='outline'
												size='lg'
												className='cursor-pointer gap-2'
											>
												Закрити
											</Button>
											{nextLesson && (
												<Link href={`/courses/${courseSlug}/${nextLesson.slug}`}>
													<Button
														className='group cursor-pointer gap-2 bg-linear-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600'
														size='lg'
													>
														Наступне заняття
														<ArrowRightIcon size={16} />
													</Button>
												</Link>
											)}
										</motion.div>

										{nextLesson && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.6 }}
												className='bg-muted/50 rounded-lg border p-3'
											>
												<p className='text-muted-foreground text-xs'>Наступне заняття:</p>
												<p className='text-sm font-medium'>{nextLesson.title}</p>
											</motion.div>
										)}
									</div>
								</div>
							</motion.div>,
							document.body
						)}
					</>
				)}
			</AnimatePresence>
		</div>
	)
}

const AttachmentIcon = ({ type }: { type: string | null }) => {
	const iconClass = 'h-4 w-4 shrink-0'

	switch (type) {
		case 'pdf':
			return <FileTextIcon className={cn(iconClass, 'text-red-500')} />
		case 'link':
			return <LinkIcon className={cn(iconClass, 'text-blue-500')} />
		default:
			return <FileIcon className={cn(iconClass, 'text-muted-foreground')} />
	}
}

// const extractTocFromMarkdown = (content: string | null): TocItem[] => {
// 	if (!content) return []

// 	const items: TocItem[] = []

// 	// Парсимо стандартні markdown заголовки (# Заголовок)
// 	const headingRegex = /^(#{1,3})\s+(.+)$/gm
// 	let match

// 	while ((match = headingRegex.exec(content)) !== null) {
// 		const level = match[1].length
// 		const text = match[2].trim()
// 		const id = generateTocId(text)
// 		items.push({ id, text, level })
// 	}

// 	// Якщо не знайшли markdown заголовки, парсимо **bold** заголовки
// 	if (items.length === 0) {
// 		// Шукаємо рядки що починаються з **текст** (жирний текст на початку рядка)
// 		const boldHeadingRegex = /^\*\*([^*]+)\*\*\s*$/gm

// 		while ((match = boldHeadingRegex.exec(content)) !== null) {
// 			const text = match[1].trim()
// 			// Пропускаємо дуже короткі "заголовки" (менше 3 символів)
// 			if (text.length < 3) continue

// 			const id = generateTocId(text)
// 			// Визначаємо рівень за контекстом
// 			const level = text.includes('Завдання') ? 2 : 1
// 			items.push({ id, text, level })
// 		}
// 	}

// 	return items
// }

// const generateTocId = (text: string): string => {
// 	return text
// 		.toLowerCase()
// 		.replace(/[^a-zа-яіїєґ0-9\s]/g, '')
// 		.replace(/\s+/g, '-')
// 		.slice(0, 50)
// }
