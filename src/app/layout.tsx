import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import './globals.css'

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'Studyx',
	description: 'Education platform'
}

const RootLayout = ({
	children
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<html lang='en'>
			<body
				className={`${nunito.variable} antialiased`}
				suppressHydrationWarning
			>
				{children}
			</body>
		</html>
	)
}

export default RootLayout
