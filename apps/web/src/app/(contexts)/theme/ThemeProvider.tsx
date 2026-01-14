import { getCookie, setCookie } from '@siberiacancode/reactuse'
import { useLayoutEffect, useMemo, useState } from 'react'

import { type Theme, ThemeContext } from './ThemeContext'
import { COOKIES } from '@/app/(constants)'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') return 'dark'
		return (getCookie(COOKIES.THEME) as Theme) ?? 'dark'
	})

	useLayoutEffect(() => {
		const root = document.documentElement
		setCookie(COOKIES.THEME, theme, {
			path: '/'
		})
		root.classList.remove('dark', 'light')
		root.classList.add(theme)
	}, [theme])

	const value = useMemo(() => ({ value: theme, set: setTheme }), [theme])

	return <ThemeContext value={value}>{children}</ThemeContext>
}
