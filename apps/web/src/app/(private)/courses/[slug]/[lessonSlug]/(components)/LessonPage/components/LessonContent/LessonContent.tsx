import 'highlight.js/styles/github-dark.css'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface LessonContentProps {
	content: string | null
	isLecture: boolean
}

export const LessonContent = ({ content, isLecture }: LessonContentProps) => {
	if (!content) {
		return (
			<div className='flex h-64 items-center justify-center rounded-xl border border-dashed'>
				<p className='text-muted-foreground'>Контент ще не додано</p>
			</div>
		)
	}

	return (
		<article
			className={`prose prose-lg dark:prose-invert max-w-none ${
				isLecture ? 'prose-blue' : 'prose-emerald'
			}`}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex, rehypeHighlight]}
				components={{
					h1: ({ children }) => (
						<h1
							id={generateId(children)}
							className='scroll-mt-20'
						>
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2
							id={generateId(children)}
							className='scroll-mt-20'
						>
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3
							id={generateId(children)}
							className='scroll-mt-20'
						>
							{children}
						</h3>
					),
					// Стилізація блоків коду
					pre: ({ children }) => (
						<pre className='overflow-x-auto rounded-xl border bg-[#0d1117] p-4 text-sm'>
							{children}
						</pre>
					),
					code: ({ className, children, ...props }) => {
						const isInline = !className
						if (isInline) {
							return (
								<code
									className='bg-muted rounded px-1.5 py-0.5 text-sm font-medium'
									{...props}
								>
									{children}
								</code>
							)
						}
						return (
							<code
								className={className}
								{...props}
							>
								{children}
							</code>
						)
					},
					table: ({ children }) => (
						<div className='overflow-x-auto'>
							<table className='min-w-full'>{children}</table>
						</div>
					),
					a: ({ href, children }) => (
						<Link
							href={href ?? '#'}
							target={'_blank'}
							rel='noopener noreferrer'
							className='text-primary hover:underline'
						>
							{children}
						</Link>
					),
					blockquote: ({ children }) => (
						<blockquote className='border-primary/30 bg-primary/5 border-l-4 py-1 pl-4 italic'>
							{children}
						</blockquote>
					),
					img: ({ src, alt }) => (
						<Image
							src={typeof src === 'string' ? src : '/images/placeholder.png'}
							alt={alt ?? ''}
							className='rounded-xl border shadow-sm'
							loading='lazy'
						/>
					),
					// Обробка параграфів з **bold** як заголовків
					p: ({ children, node }) => {
						const nodeChildren = node?.children
						if (
							nodeChildren?.length === 1 &&
							nodeChildren[0].type === 'element' &&
							nodeChildren[0].tagName === 'strong'
						) {
							const text = extractTextFromChildren(children)
							if (text.length > 5) {
								const id = generateId(children)
								return (
									<p
										id={id}
										className='scroll-mt-20 text-xl font-bold'
									>
										{children}
									</p>
								)
							}
						}
						return <p>{children}</p>
					}
				}}
			>
				{content}
			</ReactMarkdown>
		</article>
	)
}

const extractTextFromChildren = (children: React.ReactNode): string => {
	if (typeof children === 'string') return children
	if (Array.isArray(children)) {
		return children.map(extractTextFromChildren).join('')
	}
	if (typeof children === 'object' && children !== null && 'props' in children) {
		return extractTextFromChildren(
			(children as { props: { children: React.ReactNode } }).props.children
		)
	}
	return ''
}

const generateId = (children: React.ReactNode): string => {
	const text = extractTextFromChildren(children)
	return text
		.toLowerCase()
		.replace(/[^a-zа-яіїєґ0-9\s]/g, '')
		.replace(/\s+/g, '-')
		.slice(0, 50)
}
