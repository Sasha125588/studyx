import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { headers } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

import { ThemeSwitcher } from '@/components/common/ThemeSwitcher/ThemeSwitcher'

import './globals.css'
import { getMessagesByLocale } from '@/shared/helpers/i18n/getMessagesByLocale'
import { I18nProvider } from '@/shared/providers'
import { ThemeProvider } from '@/shared/providers/theme/ThemeProvider'

const manrope = Manrope({
	variable: '--font-manrope',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'Studyx',
	description: 'Education platform'
}

interface RootLayoutProps {
	children: React.ReactNode
}

const LocaleProvider = async ({ children }: { children: React.ReactNode }) => {
	const headersList = await headers()
	const locale = headersList.get('x-locale') ?? 'en'
	const messages = getMessagesByLocale(locale)

	return (
		<html
			lang={locale}
			suppressHydrationWarning
		>
			<body className={`${manrope.variable} antialiased`}>
				<NuqsAdapter>
					<I18nProvider
						locale={locale}
						messages={messages}
					>
						<ThemeProvider
							attribute='class'
							defaultTheme='dark'
							enableSystem
						>
							{children}
							<ThemeSwitcher />
						</ThemeProvider>
						<Toaster
							richColors
							duration={1500}
						/>
					</I18nProvider>
				</NuqsAdapter>
			</body>
		</html>
	)
}

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<Suspense
			fallback={
				<html
					lang='en'
					suppressHydrationWarning
				>
					<body className={`${manrope.variable} dark antialiased`}>
						<div className='flex h-screen items-center justify-center'>
							<div className='h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent' />
						</div>
					</body>
				</html>
			}
		>
			<LocaleProvider>{children}</LocaleProvider>
		</Suspense>
	)
}

export default RootLayout
