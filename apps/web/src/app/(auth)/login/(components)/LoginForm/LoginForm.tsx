'use client'

// import { SocialLoginButtons } from '@/components/common/SocialLoginButtons/SocialLoginButtons'
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@studyx/ui/base'

import { IntlText } from '@/components/common/IntlText/IntlText'

import { useLoginForm } from './hooks/useLoginForm'
import { useIntl } from '@/app/(contexts)/intl/useIntl'

export const LoginForm = () => {
	const { form, functions, state } = useLoginForm()
	const i18n = useIntl()

	return (
		<Form {...form}>
			<form
				className='p-6 md:p-8'
				onSubmit={event => {
					event.preventDefault()
					functions.onSubmit()
				}}
			>
				<div className='flex flex-col gap-6'>
					<div className='flex flex-col items-center text-center'>
						<h1 className='text-2xl font-bold'>
							<IntlText path='form.login.title' />
						</h1>
						<p className='text-muted-foreground w-max text-balance'>
							<IntlText path='form.login.description' />
						</p>
					</div>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='email'>
									<IntlText path='field.email.label' />
								</FormLabel>
								<FormControl>
									<Input
										id='email'
										aria-label='Email'
										type='email'
										placeholder={i18n.formatMessage({
											id: 'field.email.placeholder'
										})}
										disabled={state.loading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<div className='flex items-center'>
									<FormLabel htmlFor='password'>
										<IntlText path='field.password.label' />
									</FormLabel>
									<a
										href='#'
										className='ml-auto text-sm underline-offset-2 hover:underline'
									>
										<IntlText path='form.forgotPassword' />
									</a>
								</div>
								<FormControl>
									<Input
										id='password'
										aria-label='Password'
										type='password'
										placeholder={i18n.formatMessage({
											id: 'field.password.placeholder'
										})}
										disabled={state.loading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
								<p className='text-muted-foreground mt-2 text-sm'>
									<IntlText path='form.passwordRequirements' />
								</p>
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='w-full cursor-pointer'
						disabled={state.loading}
					>
						{state.loading ? <IntlText path='loading' /> : <IntlText path='button.login' />}
					</Button>
					<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
						<span className='bg-card text-muted-foreground relative z-10 px-2'>
							<IntlText path='form.orContinueWith' />
						</span>
					</div>
					{/* <SocialLoginButtons /> */}
					<div className='text-center text-sm'>
						<IntlText path='form.dontHaveAccount' />{' '}
						<Button
							type='button'
							variant='link'
							className='h-auto cursor-pointer p-0'
							onClick={functions.goToSignUp}
						>
							<IntlText path='button.signup' />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
