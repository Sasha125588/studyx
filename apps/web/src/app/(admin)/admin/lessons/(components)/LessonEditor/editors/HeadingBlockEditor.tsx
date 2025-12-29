'use client'

import type { HeadingBlock } from '@studyx/types'

import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

interface HeadingBlockEditorProps {
	block: HeadingBlock
	onUpdate: (updates: Partial<HeadingBlock>) => void
}

export const HeadingBlockEditor = ({ block, onUpdate }: HeadingBlockEditorProps) => {
	return (
		<div className='flex gap-3'>
			<div className='w-24'>
				<label className='text-muted-foreground mb-1.5 block text-xs'>Рівень</label>
				<Select
					value={String(block.level)}
					onValueChange={v => onUpdate({ level: Number(v) as 1 | 2 | 3 })}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='1'>H1</SelectItem>
						<SelectItem value='2'>H2</SelectItem>
						<SelectItem value='3'>H3</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='flex-1'>
				<label className='text-muted-foreground mb-1.5 block text-xs'>Текст заголовку</label>
				<Input
					value={block.text}
					onChange={e => onUpdate({ text: e.target.value })}
					placeholder='Введіть заголовок...'
					className={
						block.level === 1
							? 'text-2xl font-bold'
							: block.level === 2
								? 'text-xl font-semibold'
								: 'text-lg font-medium'
					}
				/>
			</div>
		</div>
	)
}
