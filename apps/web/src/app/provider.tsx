'use client'

import * as React from 'react'

import { ThemeProvider } from '@/shared/providers/theme/ThemeProvider'

interface ProviderProps {
	children: React.ReactNode
}

export const Provider = ({ children }: ProviderProps) => <ThemeProvider>{children}</ThemeProvider>
