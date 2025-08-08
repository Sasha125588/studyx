import { zodResolver } from '@hookform/resolvers/zod'
import { redirect, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { loginFormSchema } from '../constants/loginSchema'

import { handleLogin } from '@/app/(auth)/(actions)/handleLogin'
import { getErrorMessage } from '@/shared/helpers/auth/getErrorMessage'
import { useI18n } from '@/shared/providers'

interface SignInForm {
	email: string
	password: string
}

export const useLoginForm = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const i18n = useI18n()

	const signInForm = useForm<SignInForm>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = signInForm.handleSubmit(async values => {
		const loadingToast = toast.loading(i18n.formatMessage({ id: 'toast.loggingIn' }))
		startTransition(async () => {
			try {
				await handleLogin(values.email, values.password)

				toast.success(i18n.formatMessage({ id: 'toast.loggedIn' }), {
					id: loadingToast
				})

				router.push('/dashboard')
			} catch (error) {
				const errMsg = getErrorMessage(error instanceof Error ? error.message : String(error))
				toast.error(i18n.formatMessage({ id: 'toast.failedLogin' }) + ' ' + errMsg, {
					id: loadingToast
				})
				return
			}
		})
	})

	const goToSignUp = () => redirect('/signup')

	return {
		state: {
			loading: isPending
		},
		form: signInForm,
		functions: { onSubmit, goToSignUp }
	}
}
