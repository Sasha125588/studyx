import { Card, CardContent } from '@/components/ui/card'

import { LoginForm } from './(components)/LoginForm/LoginForm'

const LoginPage = () => {
	return (
		<div className='flex items-center justify-center p-4'>
			<div className='flex w-full max-w-4xl flex-col items-center gap-6'>
				<Card className='w-full overflow-hidden p-0'>
					<CardContent className='grid p-0 md:grid-cols-2'>
						<LoginForm />
						<div className='bg-violet-200' />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default LoginPage
