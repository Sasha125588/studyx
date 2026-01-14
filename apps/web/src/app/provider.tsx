'use client'

import type { ComponentProps, ReactNode } from 'react'

import { IntlProvider } from './(contexts)/intl/IntlProvider'
import { ThemeProvider } from '@/app/(contexts)/theme/ThemeProvider'

interface ProviderProps {
	children: ReactNode
	intl: Omit<ComponentProps<typeof IntlProvider>, 'children'>
}

export const Provider = ({ children, intl }: ProviderProps) => (
	<IntlProvider {...intl}>
		<ThemeProvider>{children}</ThemeProvider>
	</IntlProvider>
)
