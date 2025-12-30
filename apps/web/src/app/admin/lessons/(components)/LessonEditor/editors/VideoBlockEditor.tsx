'use client'

import type { VideoBlock } from '@studyx/types'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

interface VideoBlockEditorProps {
	block: VideoBlock
	onUpdate: (updates: Partial<VideoBlock>) => void
}

export const VideoBlockEditor = ({ block, onUpdate }: VideoBlockEditorProps) => {
	return (
		<div className='space-y-4'>
			<div className='grid gap-4 md:grid-cols-3'>
				<div className='md:col-span-2'>
					<Label className='text-xs'>URL відео</Label>
					<Input
						value={block.url}
						onChange={e => onUpdate({ url: e.target.value })}
						placeholder='https://youtube.com/watch?v=... або https://vimeo.com/...'
						className='mt-1.5'
					/>
				</div>
				<div>
					<Label className='text-xs'>Платформа</Label>
					<Select
						value={block.provider}
						onValueChange={v => onUpdate({ provider: v as VideoBlock['provider'] })}
					>
						<SelectTrigger className='mt-1.5'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='youtube'>YouTube</SelectItem>
							<SelectItem value='vimeo'>Vimeo</SelectItem>
							<SelectItem value='uploaded'>Завантажене</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div>
				<Label className='text-xs'>Підпис (необов&apos;язково)</Label>
				<Input
					value={block.caption ?? ''}
					onChange={e => onUpdate({ caption: e.target.value })}
					placeholder='Підпис під відео'
					className='mt-1.5'
				/>
			</div>

			{/* Preview */}
			{block.url && block.provider !== 'uploaded' && (
				<div className='mt-4'>
					<Label className='text-xs'>Попередній перегляд</Label>
					<div className='bg-muted mt-1.5 aspect-video overflow-hidden rounded-lg border'>
						<iframe
							src={getEmbedUrl(block.url, block.provider)}
							title='Video preview'
							className='h-full w-full'
							allowFullScreen
						/>
					</div>
				</div>
			)}
		</div>
	)
}

const getEmbedUrl = (url: string, provider: VideoBlock['provider']): string => {
	if (provider === 'youtube') {
		const videoId = extractYouTubeId(url)
		return videoId ? `https://www.youtube.com/embed/${videoId}` : url
	}
	if (provider === 'vimeo') {
		const videoId = extractVimeoId(url)
		return videoId ? `https://player.vimeo.com/video/${videoId}` : url
	}
	return url
}

const extractYouTubeId = (url: string): string | null => {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/^([a-zA-Z0-9_-]{11})$/
	]
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}
	return null
}

const extractVimeoId = (url: string): string | null => {
	const match = url.match(/(?:vimeo\.com\/)(\d+)/)
	return match ? match[1] : null
}
