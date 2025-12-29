import type { VideoBlock as VideoBlockType } from '@studyx/types'

interface VideoBlockProps {
	block: VideoBlockType
}

export const VideoBlock = ({ block }: VideoBlockProps) => {
	const getEmbedUrl = () => {
		if (block.provider === 'youtube') {
			const videoId = extractYouTubeId(block.url)
			return videoId ? `https://www.youtube.com/embed/${videoId}` : block.url
		}
		if (block.provider === 'vimeo') {
			const videoId = extractVimeoId(block.url)
			return videoId ? `https://player.vimeo.com/video/${videoId}` : block.url
		}
		return block.url
	}

	return (
		<figure className='my-6'>
			<div className='aspect-video overflow-hidden rounded-xl border'>
				{block.provider === 'uploaded' ? (
					<video
						src={block.url}
						controls
						className='h-full w-full'
					>
						Ваш браузер не підтримує відтворення відео.
					</video>
				) : (
					<iframe
						src={getEmbedUrl()}
						title={block.caption ?? 'Відео'}
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen
						className='h-full w-full'
					/>
				)}
			</div>
			{block.caption && (
				<figcaption className='text-muted-foreground mt-2 text-center text-sm'>
					{block.caption}
				</figcaption>
			)}
		</figure>
	)
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
