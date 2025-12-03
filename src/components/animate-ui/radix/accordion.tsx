import { ChevronDownIcon } from 'lucide-react'

import {
	AccordionContent as AccordionContentPrimitive,
	type AccordionContentProps as AccordionContentPrimitiveProps,
	AccordionHeader as AccordionHeaderPrimitive,
	AccordionItem as AccordionItemPrimitive,
	type AccordionItemProps as AccordionItemPrimitiveProps,
	Accordion as AccordionPrimitive,
	type AccordionProps as AccordionPrimitiveProps,
	AccordionTrigger as AccordionTriggerPrimitive,
	type AccordionTriggerProps as AccordionTriggerPrimitiveProps
} from '@/components/animate-ui/primitives/radix/accordion'

import { cn } from '@/shared/helpers'

type AccordionProps = AccordionPrimitiveProps

function Accordion(props: AccordionProps) {
	return <AccordionPrimitive {...props} />
}

type AccordionItemProps = AccordionItemPrimitiveProps

function AccordionItem({ className, ...props }: AccordionItemProps) {
	return (
		<AccordionItemPrimitive
			className={cn('border-b', className)}
			{...props}
		/>
	)
}

type AccordionTriggerProps = AccordionTriggerPrimitiveProps & {
	showArrow?: boolean
}

function AccordionTrigger({
	className,
	children,
	showArrow = true,
	...props
}: AccordionTriggerProps) {
	return (
		<AccordionHeaderPrimitive className='flex'>
			<AccordionTriggerPrimitive
				className={cn(
					'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
					className
				)}
				{...props}
			>
				{children}
				{showArrow && (
					<ChevronDownIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200' />
				)}
			</AccordionTriggerPrimitive>
		</AccordionHeaderPrimitive>
	)
}

type AccordionContentProps = AccordionContentPrimitiveProps

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
	return (
		<AccordionContentPrimitive {...props}>
			<div className={cn('pt-0 pb-4 text-sm', className)}>{children}</div>
		</AccordionContentPrimitive>
	)
}

export {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
	type AccordionProps,
	type AccordionItemProps,
	type AccordionTriggerProps,
	type AccordionContentProps
}
