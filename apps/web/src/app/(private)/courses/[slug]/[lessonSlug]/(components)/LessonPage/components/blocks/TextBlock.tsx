'use client'

import type { TextBlock as TextBlockType } from '@studyx/types'
import 'highlight.js/styles/github-dark.css'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface TextBlockProps {
	block: TextBlockType
}

export const TextBlock = ({ block }: TextBlockProps) => {
	return (
		<article className='prose prose-lg dark:prose-invert max-w-none'>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkMath]}
				rehypePlugins={[rehypeKatex, rehypeHighlight]}
			>
				{block.content}
			</ReactMarkdown>
		</article>
	)
}
