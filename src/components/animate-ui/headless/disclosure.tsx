'use client'

import {
	DisclosureButton as DisclosureButtonPrimitive,
	type DisclosureButtonProps as DisclosureButtonPrimitiveProps,
	DisclosurePanel as DisclosurePanelPrimitive,
	type DisclosurePanelProps as DisclosurePanelPrimitiveProps,
	Disclosure as DisclosurePrimitive,
	type DisclosureProps as DisclosurePrimitiveProps
} from '@headlessui/react'
import { AnimatePresence, type HTMLMotionProps, type Transition, motion } from 'motion/react'
import * as React from 'react'

import { cn } from '@/shared/helpers/common'

type DisclosureContextType = {
	isOpen: boolean
}

const DisclosureContext = React.createContext<DisclosureContextType | undefined>(undefined)

const useDisclosure = (): DisclosureContextType => {
	const context = React.useContext(DisclosureContext)
	if (!context) {
		throw new Error('useDisclosure must be used within a Disclosure')
	}
	return context
}

type DisclosureProps<TTag extends React.ElementType = 'div'> = DisclosurePrimitiveProps<TTag> & {
	as?: TTag
}

function Disclosure<TTag extends React.ElementType = 'div'>({
	children,
	...props
}: DisclosureProps<TTag>) {
	return (
		<DisclosurePrimitive
			data-slot='disclosure'
			{...props}
		>
			{bag => (
				<DisclosureContext.Provider value={{ isOpen: bag.open }}>
					{typeof children === 'function' ? children(bag) : children}
				</DisclosureContext.Provider>
			)}
		</DisclosurePrimitive>
	)
}

type DisclosureButtonProps<TTag extends React.ElementType = 'button'> =
	DisclosureButtonPrimitiveProps<TTag> & {
		as?: TTag
	}

function DisclosureButton<TTag extends React.ElementType = 'button'>(
	props: DisclosureButtonProps<TTag>
) {
	return (
		<DisclosureButtonPrimitive
			data-slot='disclosure-button'
			{...props}
		/>
	)
}

type DisclosurePanelProps<TTag extends React.ElementType = typeof motion.div> = Pick<
	DisclosurePanelPrimitiveProps<TTag>,
	'static' | 'unmount' | 'children'
> &
	Omit<HTMLMotionProps<'div'>, 'children'> & {
		transition?: Transition
		as?: TTag
	}

function DisclosurePanel<TTag extends React.ElementType = typeof motion.div>(
	props: DisclosurePanelProps<TTag>
) {
	const {
		className,
		children,
		transition = { type: 'spring', stiffness: 150, damping: 22 },
		as = motion.div,
		unmount,
		...rest
	} = props
	const { isOpen } = useDisclosure()

	return (
		<AnimatePresence>
			{isOpen && (
				<DisclosurePanelPrimitive
					static
					as={as as React.ElementType}
					unmount={unmount}
				>
					{bag => (
						<motion.div
							key='disclosure-panel'
							data-slot='disclosure-panel'
							initial={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
							animate={{ height: 'auto', opacity: 1, '--mask-stop': '100%' }}
							exit={{ height: 0, opacity: 0, '--mask-stop': '0%' }}
							transition={transition}
							style={{
								maskImage: 'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
								WebkitMaskImage:
									'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))'
							}}
							className={cn('overflow-hidden', className)}
							{...rest}
						>
							{typeof children === 'function' ? children(bag) : children}
						</motion.div>
					)}
				</DisclosurePanelPrimitive>
			)}
		</AnimatePresence>
	)
}

export {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	useDisclosure,
	type DisclosureProps,
	type DisclosureButtonProps,
	type DisclosurePanelProps
}
