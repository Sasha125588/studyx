// import { COOKIES } from './(constants)/cookies'
import { Analytics } from '@vercel/analytics/next'
import { RootProvider as FumadocsRootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
// import { cookies } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'

import { ThemeSwitcher } from '@/components/common/ThemeSwitcher/ThemeSwitcher'

import './globals.css'
import { Provider } from './provider'
import { getDictionary } from '@/app/(contexts)/intl/helpers/getMessagesByLocale'

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

const getInitialLocale = async () => {
	const locale = 'uk' as Locale
	const messages = await getDictionary(locale)
	return { locale, messages }
}

const RootLayout = async ({ children }: RootLayoutProps) => {
	const initialLocale = await getInitialLocale()

	return (
		<html
			lang='uk'
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
			<body className={`${manrope.variable} flex min-h-screen flex-col antialiased`}>
				<NuqsAdapter>
					<Provider intl={initialLocale}>
						<FumadocsRootProvider>{children}</FumadocsRootProvider>
						<ThemeSwitcher />
					</Provider>
				</NuqsAdapter>
				<Toaster
					richColors
					duration={TOASTER_DURATION}
				/>
				{process.env.NODE_ENV === 'production' && <Analytics mode='production' />}{' '}
			</body>
		</html>
	)
}

export default RootLayout
