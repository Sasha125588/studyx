import { zodResolver } from '@hookform/resolvers/zod'
import { redirect, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getErrorMessage } from '@/utils/helpers/auth/getErrorMessage'

import { loginFormSchema } from '../constants/signInSchema'

import { handleSignIn } from '@/app/(auth)/(actions)/handleSignIn'

interface SignInForm {
	email: string
	password: string
}

export const useSignInForm = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const signInForm = useForm<SignInForm>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = signInForm.handleSubmit(async values => {
		startTransition(async () => {
			const loadingToast = toast.loading('Logging...')

			const error = await handleSignIn(values.email, values.password)

			if (error?.code) {
				const errMsg = getErrorMessage(error.code)
				toast.error(`Failed to login. ${errMsg}.`, {
					id: loadingToast
				})
				return
			}

			toast.success('Successfully logged in!', {
				id: loadingToast
			})

			router.push('/dashboard')
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
