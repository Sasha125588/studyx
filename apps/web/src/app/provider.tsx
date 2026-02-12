'use client'

import type { ComponentProps, ReactNode } from 'react'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { IntlProvider } from './(contexts)/intl/IntlProvider'
import { QueryProvider } from './(contexts)/query/QueryProvider'
import { ThemeProvider } from './(contexts)/theme/ThemeProvider'

interface ProviderProps {
  children: ReactNode
  intl: Omit<ComponentProps<typeof IntlProvider>, 'children'>
}

export function Provider({ children, intl }: ProviderProps) {
  return (
    <QueryProvider>
      <ReactQueryDevtools />
      <IntlProvider {...intl}>
        <ThemeProvider>{children}</ThemeProvider>
      </IntlProvider>
    </QueryProvider>
  )
}
