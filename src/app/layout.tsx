import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { cookies } from 'next/headers'
import { Toaster } from 'sonner'

import './globals.css'
import { getMessagesByLocale } from '@/shared/helpers/i18n/getMessageByLocale'
import { I18nProvider } from '@/shared/providers'

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'Studyx',
	description: 'Education platform'
}

const RootLayout = async ({
	children
}: Readonly<{
	children: React.ReactNode
}>) => {
	const cookieStore = await cookies()
	const locale = cookieStore.get('locale')?.value ?? 'en'
	const messages = getMessagesByLocale(locale)
	return (
		<html
			lang={locale}
			suppressHydrationWarning
		>
			<body className={`${nunito.variable} antialiased`}>
				<I18nProvider
					locale={locale}
					messages={messages}
				>
					{children}
					<Toaster
						richColors
						duration={1500}
					/>
				</I18nProvider>
			</body>
		</html>
	)
}

export default RootLayout
