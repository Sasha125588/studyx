import type { HeadingBlock as HeadingBlockType } from '@studyx/types'

interface HeadingBlockProps {
	block: HeadingBlockType
}

export const HeadingBlock = ({ block }: HeadingBlockProps) => {
	const id = block.text
		.toLowerCase()
		.replace(/[^a-zа-яіїєґ0-9\s]/g, '')
		.replace(/\s+/g, '-')
		.slice(0, 50)

	switch (block.level) {
		case 1:
			return (
				<h1
					id={id}
					className='scroll-mt-20 text-3xl font-bold tracking-tight'
				>
					{block.text}
				</h1>
			)
		case 2:
			return (
				<h2
					id={id}
					className='scroll-mt-20 text-2xl font-semibold tracking-tight'
				>
					{block.text}
				</h2>
			)
		case 3:
			return (
				<h3
					id={id}
					className='scroll-mt-20 text-xl font-semibold'
				>
					{block.text}
				</h3>
			)
		default:
			return <h2 className='text-2xl font-semibold'>{block.text}</h2>
	}
}
