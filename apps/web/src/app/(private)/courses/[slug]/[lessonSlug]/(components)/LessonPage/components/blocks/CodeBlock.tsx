'use client'

import type { CodeBlock as CodeBlockType } from '@studyx/types'
import { Check, Copy, Play, Terminal } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface CodeBlockProps {
	block: CodeBlockType
}

export const CodeBlock = ({ block }: CodeBlockProps) => {
	const [code, setCode] = useState(block.code)
	const [output, setOutput] = useState<string | null>(null)
	const [isRunning, setIsRunning] = useState(false)
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleRun = async () => {
		if (!block.runnable) return

		setIsRunning(true)
		setOutput(null)

		try {
			// TODO: Інтеграція з сервісом запуску коду (Judge0/Piston)
			// Поки що просто показуємо заглушку
			await new Promise(resolve => setTimeout(resolve, 1000))
			setOutput('// Результат виконання буде тут\n// Інтеграція з code runner в розробці')
		} catch (error) {
			setOutput(`Помилка: ${error instanceof Error ? error.message : 'Невідома помилка'}`)
		} finally {
			setIsRunning(false)
		}
	}

	return (
		<div className='overflow-hidden rounded-xl border'>
			{/* Заголовок */}
			<div className='bg-muted/50 flex items-center justify-between border-b px-4 py-2'>
				<div className='flex items-center gap-2'>
					<Terminal className='h-4 w-4' />
					<span className='text-sm font-medium'>{block.filename ?? block.language}</span>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						onClick={handleCopy}
						className='h-8 gap-1.5'
					>
						{copied ? (
							<>
								<Check className='h-3.5 w-3.5' />
								<span className='text-xs'>Скопійовано</span>
							</>
						) : (
							<>
								<Copy className='h-3.5 w-3.5' />
								<span className='text-xs'>Копіювати</span>
							</>
						)}
					</Button>
					{block.runnable && (
						<Button
							variant='default'
							size='sm'
							onClick={handleRun}
							disabled={isRunning}
							className='h-8 gap-1.5'
						>
							<Play className='h-3.5 w-3.5' />
							<span className='text-xs'>{isRunning ? 'Виконується...' : 'Запустити'}</span>
						</Button>
					)}
				</div>
			</div>

			{/* Редактор / Код */}
			<div className='bg-[#0d1117]'>
				{block.readonly ? (
					<pre className='overflow-x-auto p-4 text-sm text-gray-300'>
						<code>{code}</code>
					</pre>
				) : (
					<textarea
						value={code}
						onChange={e => setCode(e.target.value)}
						className='min-h-[200px] w-full resize-y bg-transparent p-4 font-mono text-sm text-gray-300 focus:outline-none'
						spellCheck={false}
					/>
				)}
			</div>

			{/* Вивід */}
			{output !== null && (
				<div className='border-t bg-black/50'>
					<div className='border-b px-4 py-2'>
						<span className='text-xs font-medium text-gray-400'>Результат</span>
					</div>
					<pre className='overflow-x-auto p-4 text-sm text-green-400'>
						<code>{output}</code>
					</pre>
				</div>
			)}
		</div>
	)
}
