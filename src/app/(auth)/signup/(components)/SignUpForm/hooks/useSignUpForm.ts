import { zodResolver } from '@hookform/resolvers/zod'
import { redirect, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getErrorMessage } from '@/utils/helpers/auth/getErrorMessage'

import { signUpFormSchema } from '../constants/signUpSchema'

import { handleSignUp } from '@/app/(auth)/(actions)/handleSignUp'

interface SignUpForm {
	email: string
	username: string
	password: string
	confirmPassword: string
}

export const useSignUpForm = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const signUpForm = useForm<SignUpForm>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
			confirmPassword: ''
		}
	})

	const onSubmit = signUpForm.handleSubmit(async values => {
		startTransition(async () => {
			const loadingToast = toast.loading('Creating your account...')

			const error = await handleSignUp(values.email, values.password, values.username)

			if (error?.code) {
				const errMsg = getErrorMessage(error.code)
				toast.error(`Failed to create account. ${errMsg}`, {
					id: loadingToast
				})
				return
			}

			toast.success('Account created successfully! Welcome to Task Hub!', {
				id: loadingToast
			})

			router.push('/dashboard')
		})
	})

	const goToSignIn = () => redirect('/signin')

	return {
		state: {
			loading: isPending
		},
		form: signUpForm,
		functions: { onSubmit, goToSignIn }
	}
}
