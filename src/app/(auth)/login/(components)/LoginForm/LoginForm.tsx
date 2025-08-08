'use client'

import { I18nText } from '@/components/common/I18nText/I18nText'
// import { SocialLoginButtons } from '@/components/common/SocialLoginButtons/SocialLoginButtons'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useLoginForm } from './hooks/useLoginForm'
import { useI18n } from '@/shared/providers'

export const LoginForm = () => {
	const { form, functions, state } = useLoginForm()
	const i18n = useI18n()

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
							<I18nText path='form.login.title' />
						</h1>
						<p className='text-muted-foreground w-max text-balance'>
							<I18nText path='form.login.description' />
						</p>
					</div>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='email'>
									<I18nText path='field.email.label' />
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
										<I18nText path='field.password.label' />
									</FormLabel>
									<a
										href='#'
										className='ml-auto text-sm underline-offset-2 hover:underline'
									>
										<I18nText path='form.forgotPassword' />
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
									<I18nText path='form.passwordRequirements' />
								</p>
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='w-full cursor-pointer dark:hover:bg-zinc-50/80'
						disabled={state.loading}
					>
						{state.loading ? <I18nText path='loading' /> : <I18nText path='button.login' />}
					</Button>
					<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
						<span className='bg-card text-muted-foreground relative z-10 px-2'>
							<I18nText path='form.orContinueWith' />
						</span>
					</div>
					{/* <SocialLoginButtons /> */}
					<div className='text-center text-sm'>
						<I18nText path='form.dontHaveAccount' />{' '}
						<Button
							type='button'
							variant='link'
							className='h-auto cursor-pointer p-0'
							onClick={functions.goToSignUp}
						>
							<I18nText path='button.signup' />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
