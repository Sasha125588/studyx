import { I18nText } from '@/components/common/I18nText/I18nText'
import { SocialLoginButtons } from '@/components/common/SocialLoginButtons/SocialLoginButtons'
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

import { useSignUpForm } from './hooks/useSignUpForm'
import { useI18n } from '@/shared/providers'

export const SignUpForm = () => {
	const { form, functions, state } = useSignUpForm()
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
							<I18nText path='auth.signup.form.title' />
						</h1>
						<p className='text-muted-foreground text-balance'>
							<I18nText path='auth.signup.form.description' />
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
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='username'>
									<I18nText path='field.username.label' />
								</FormLabel>
								<FormControl>
									<Input
										id='username'
										aria-label='Username'
										type='text'
										placeholder={i18n.formatMessage({
											id: 'field.username.placeholder'
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
								<FormLabel htmlFor='password'>
									<I18nText path='field.password.label' />
								</FormLabel>
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
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='confirmPassword'>
									<I18nText path='field.confirmPassword.label' />
								</FormLabel>
								<FormControl>
									<Input
										id='confirmPassword'
										aria-label='Confirm Password'
										type='password'
										placeholder={i18n.formatMessage({
											id: 'field.confirmPassword.placeholder'
										})}
										disabled={state.loading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type='submit'
						className='w-full cursor-pointer dark:hover:bg-zinc-50/80'
						disabled={state.loading}
					>
						{state.loading ? (
							<I18nText path='site.loading' />
						) : (
							<I18nText path='button.createAccount' />
						)}
					</Button>
					<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
						<span className='bg-card text-muted-foreground relative z-10 px-2'>
							<I18nText path='auth.form.orContinueWith' />
						</span>
					</div>
					<SocialLoginButtons />
					<div className='text-center text-sm'>
						<I18nText path='auth.form.alreadyHaveAccount' />{' '}
						<Button
							type='button'
							variant='link'
							className='h-auto cursor-pointer p-0'
							onClick={functions.goToSignIn}
						>
							<I18nText path='button.login' />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
