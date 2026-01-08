import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { cookies } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { Toaster } from 'sonner'

import { ThemeSwitcher } from '@/components/common/ThemeSwitcher/ThemeSwitcher'

import './globals.css'
import { Provider } from './provider'
import { getMessagesByLocale } from '@/shared/helpers/i18n/getMessagesByLocale'
import { I18nProvider } from '@/shared/providers'

const manrope = Manrope({
	variable: '--font-manrope',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'Studyx',
	description: 'Education platform'
}

const TOASTER_DURATION = 1500

interface RootLayoutProps {
	children: React.ReactNode
}

const LocaleProvider = async ({ children }: { children: React.ReactNode }) => {
	const cookieStore = await cookies()
	const locale = cookieStore.get('locale')?.value ?? 'en'
	const messages = getMessagesByLocale(locale)

	return (
		<html
			lang={locale}
			suppressHydrationWarning
		>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              const theme = document.cookie.match(/theme=(.*?)(;|$)/)?.[1] || 'dark';
              document.documentElement.classList.add(theme);
            `
					}}
				/>
			</head>
			<body className={`${manrope.variable} antialiased`}>
				<NuqsAdapter>
					<I18nProvider
						locale={locale}
						messages={messages}
					>
						<Provider>
							{children}
							<ThemeSwitcher />
						</Provider>
					</I18nProvider>
				</NuqsAdapter>
				<Toaster
					richColors
					duration={TOASTER_DURATION}
				/>
				<Analytics />
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
