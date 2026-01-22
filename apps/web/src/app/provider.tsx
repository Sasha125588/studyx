'use client'

import type { ComponentProps, ReactNode } from 'react'

import { ThemeProvider } from '@/app/(contexts)/theme/ThemeProvider'
import { IntlProvider } from './(contexts)/intl/IntlProvider'

interface ProviderProps {
  children: ReactNode
  intl: Omit<ComponentProps<typeof IntlProvider>, 'children'>
}

export function Provider({ children, intl }: ProviderProps) {
  return (
    <IntlProvider {...intl}>
      <ThemeProvider>{children}</ThemeProvider>
    </IntlProvider>
  )
}
