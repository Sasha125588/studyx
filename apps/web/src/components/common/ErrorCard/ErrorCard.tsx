import { AlertCircle } from 'lucide-react'

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from '@/components/ui/empty'

interface ErrorCardProps {
	icon?: React.ReactNode
	title?: string
	description?: string
	children?: React.ReactNode
}

export const ErrorCard = ({ icon, title, description, children }: ErrorCardProps) => {
	const defaultIcon = <AlertCircle size={16} />
	return (
		<Empty className='border-destructive/30 bg-destructive/5 border'>
			<EmptyHeader>
				<EmptyMedia
					variant='icon'
					className='bg-destructive/15 text-destructive dark:bg-destructive/25 mb-0 shrink-0 rounded-full'
				>
					{icon ?? defaultIcon}
				</EmptyMedia>
				<EmptyTitle className='text-destructive dark:text-destructive'>{title}</EmptyTitle>
				<EmptyDescription className='text-destructive/80 dark:text-destructive/70'>
					{description}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>{children}</EmptyContent>
		</Empty>
	)
}
