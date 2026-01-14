import type { CalloutBlock as CalloutBlockType, CalloutVariant } from '@studyx/types'
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon, LightbulbIcon } from 'lucide-react'

interface CalloutBlockProps {
	block: CalloutBlockType
}

const variantConfig: Record<
	CalloutVariant,
	{
		icon: typeof InfoIcon
		bgClass: string
		borderClass: string
		iconClass: string
		titleClass: string
	}
> = {
	info: {
		icon: InfoIcon,
		bgClass: 'bg-blue-50 dark:bg-blue-950/50',
		borderClass: 'border-blue-200 dark:border-blue-800',
		iconClass: 'text-blue-600 dark:text-blue-400',
		titleClass: 'text-blue-900 dark:text-blue-100'
	},
	warning: {
		icon: AlertTriangleIcon,
		bgClass: 'bg-yellow-50 dark:bg-yellow-950/50',
		borderClass: 'border-yellow-200 dark:border-yellow-800',
		iconClass: 'text-yellow-600 dark:text-yellow-400',
		titleClass: 'text-yellow-900 dark:text-yellow-100'
	},
	tip: {
		icon: LightbulbIcon,
		bgClass: 'bg-green-50 dark:bg-green-950/50',
		borderClass: 'border-green-200 dark:border-green-800',
		iconClass: 'text-green-600 dark:text-green-400',
		titleClass: 'text-green-900 dark:text-green-100'
	},
	danger: {
		icon: AlertCircleIcon,
		bgClass: 'bg-red-50 dark:bg-red-950/50',
		borderClass: 'border-red-200 dark:border-red-800',
		iconClass: 'text-red-600 dark:text-red-400',
		titleClass: 'text-red-900 dark:text-red-100'
	}
} as const

export const CalloutBlock = ({ block }: CalloutBlockProps) => {
	const config = variantConfig[block.variant]
	const Icon = config.icon

	return (
		<div className={`rounded-xl border p-4 ${config.bgClass} ${config.borderClass}`}>
			<div className='flex gap-3'>
				<Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconClass}`} />
				<div className='min-w-0 flex-1'>
					{block.title && (
						<p className={`mb-1 font-semibold ${config.titleClass}`}>{block.title}</p>
					)}
					<div className='text-muted-foreground text-sm'>{block.content}</div>
				</div>
			</div>
		</div>
	)
}
