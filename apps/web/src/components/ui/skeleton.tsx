import { cn } from '@/shared/helpers/common/cn'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='skeleton'
			className={cn('bg-accent animate-pulse rounded-md', className)}
			{...props}
		/>
	)
}

export { Skeleton }
