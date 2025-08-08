import { zodResolver } from '@hookform/resolvers/zod'
import { redirect, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signUpFormSchema } from '../constants/signUpSchema'

import { handleSignUp } from '@/app/(auth)/(actions)/handleSignUp'
import { getErrorMessage } from '@/shared/helpers/auth/getErrorMessage'
import { useI18n } from '@/shared/providers'

interface SignUpForm {
	email: string
	name: string
	password: string
	confirmPassword: string
}

export const useSignUpForm = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const i18n = useI18n()

	const signUpForm = useForm<SignUpForm>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: '',
			name: '',
			password: '',
			confirmPassword: ''
		}
	})

	const onSubmit = signUpForm.handleSubmit(async values => {
		const loadingToast = toast.loading(i18n.formatMessage({ id: 'toast.signingUp' }))
		startTransition(async () => {
			try {
				await handleSignUp(values.email, values.password, values.name)

				toast.success(i18n.formatMessage({ id: 'toast.signedUp' }), {
					id: loadingToast
				})

				router.push('/dashboard')
			} catch (error) {
				const errMsg = getErrorMessage(error instanceof Error ? error.message : String(error))
				toast.error(i18n.formatMessage({ id: 'toast.failedLogin' }) + ' ' + errMsg, {
					id: loadingToast
				})
				throw new Error(errMsg)
			}
		})
	})

	const goToSignIn = () => redirect('/login')

	return {
		state: {
			loading: isPending
		},
		form: signUpForm,
		functions: { onSubmit, goToSignIn }
	}
}
