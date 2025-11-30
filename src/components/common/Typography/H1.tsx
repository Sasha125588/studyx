import { cn } from '@/shared/helpers'

export const H1 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight text-balance', className)}>
		{children}
	</h1>
)
