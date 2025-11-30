import { cn } from '@/shared/helpers'

export const H4 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>{children}</h4>
)
