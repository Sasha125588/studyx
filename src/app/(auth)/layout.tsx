import type { Metadata } from 'next'
import { type PropsWithChildren } from 'react'

export const metadata: Metadata = {
	title: 'Auth',
	description: 'Auth'
}

const AuthLayout = ({ children }: PropsWithChildren) => {
	return <div className='flex h-screen w-screen items-center justify-center'>{children}</div>
}

export default AuthLayout
