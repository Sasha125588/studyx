import { cn } from '@/shared/helpers/common/cn'

export const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
	<h2 className={cn('scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0', className)}>
		{children}
	</h2>
)
