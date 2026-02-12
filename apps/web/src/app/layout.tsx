import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { RootProvider as FumadocsRootProvider } from 'fumadocs-ui/provider/next'
import { Manrope } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'

import { getDictionary } from '@/app/(contexts)/intl/helpers/getMessagesByLocale'

import { ThemeSwitcher } from '@/components/common/ThemeSwitcher/ThemeSwitcher'
import { Provider } from './provider'
import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Studyx',
  description: 'Education platform',
}

interface RootLayoutProps {
  children: React.ReactNode
}

async function getInitialLocale() {
  const locale = 'uk' as Locale
  const messages = await getDictionary(locale)
  return { locale, messages }
}

async function RootLayout({ children }: RootLayoutProps) {
  const initialLocale = await getInitialLocale()

  return (
    <html
      lang="uk"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const theme = document.cookie.match(/theme=(.*?)(;|$)/)?.[1] || 'dark';
              document.documentElement.classList.add(theme);
            `,
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
          duration={1500}
        />
        {process.env.NODE_ENV === 'production' && <Analytics mode="production" />}
        {' '}
      </body>
    </html>
  )
}

export default RootLayout
