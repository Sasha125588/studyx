import * as React from 'react'

import {
	TooltipArrow as TooltipArrowPrimitive,
	TooltipPopup as TooltipPopupPrimitive,
	type TooltipPopupProps as TooltipPopupPrimitiveProps,
	TooltipPortal as TooltipPortalPrimitive,
	TooltipPositioner as TooltipPositionerPrimitive,
	type TooltipPositionerProps as TooltipPositionerPrimitiveProps,
	Tooltip as TooltipPrimitive,
	type TooltipProps as TooltipPrimitiveProps,
	TooltipProvider as TooltipProviderPrimitive,
	type TooltipProviderProps as TooltipProviderPrimitiveProps,
	TooltipTrigger as TooltipTriggerPrimitive,
	type TooltipTriggerProps as TooltipTriggerPrimitiveProps
} from '@/components/animate-ui/primitives/base/tooltip'

import { cn } from '@/shared/helpers'

type TooltipProviderProps = TooltipProviderPrimitiveProps

function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
	return (
		<TooltipProviderPrimitive
			delay={delay}
			{...props}
		/>
	)
}

type TooltipProps = TooltipPrimitiveProps & {
	delay?: TooltipPrimitiveProps['delay']
}

function Tooltip({ delay = 0, ...props }: TooltipProps) {
	return (
		<TooltipProvider delay={delay}>
			<TooltipPrimitive {...props} />
		</TooltipProvider>
	)
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
	return <TooltipTriggerPrimitive {...props} />
}

type TooltipPanelProps = TooltipPositionerPrimitiveProps & TooltipPopupPrimitiveProps

function TooltipPanel({ className, sideOffset = 4, children, style, ...props }: TooltipPanelProps) {
	return (
		<TooltipPortalPrimitive>
			<TooltipPositionerPrimitive
				sideOffset={sideOffset}
				className='z-50'
				{...props}
			>
				<TooltipPopupPrimitive
					className={cn(
						'bg-primary text-primary-foreground w-fit origin-(--transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
						className
					)}
					style={style}
				>
					{children}
					<TooltipArrowPrimitive className="bg-primary fill-primary z-50 size-2.5 rotate-45 rounded-[2px] data-[side='bottom']:-top-[4px] data-[side='inline-end']:-left-[4px] data-[side='inline-start']:-right-[4px] data-[side='left']:-right-[4px] data-[side='right']:-left-[4px]" />
				</TooltipPopupPrimitive>
			</TooltipPositionerPrimitive>
		</TooltipPortalPrimitive>
	)
}

export {
	Tooltip,
	TooltipTrigger,
	TooltipPanel,
	type TooltipProps,
	type TooltipTriggerProps,
	type TooltipPanelProps
}
