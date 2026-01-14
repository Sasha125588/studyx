'use client'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@studyx/ui/base'
import {
	BadgeCheckIcon,
	BellIcon,
	CreditCardIcon,
	Loader2Icon,
	LogOutIcon,
	SparklesIcon
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { SIDEBAR_DATA } from '../../../Sidebar/constants/data'

import { handleSignOut } from './(actions)/handleSignOut'
import { useIntl } from '@/app/(contexts)/intl'
import { getErrorMessage } from '@/shared/helpers'

export interface User {
	name: string
	surname: string
	email: string
}

interface UserProfileProps {
	user: User
}

export const UserProfile = ({ user }: UserProfileProps) => {
	const router = useRouter()
	const i18n = useIntl()

	const [isPending, startTransition] = useTransition()

	const signOut = () =>
		startTransition(async () => {
			try {
				await handleSignOut()

				toast.success(i18n.formatMessage({ id: 'toast.loggedOut' }))

				router.replace('/login')
			} catch (error) {
				const errMsg = getErrorMessage(error instanceof Error ? error.message : String(error))
				toast.error(i18n.formatMessage({ id: 'toast.failedLogout' }) + ' ' + errMsg)
			}
		})

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='size-8 cursor-pointer rounded-full transition-colors duration-300 ease-in-out'>
					<AvatarImage
						src={SIDEBAR_DATA.user.avatar}
						alt={`${user.name} ${user.surname}`}
					/>
					<AvatarFallback className='border-border border font-semibold'>
						{user.name.charAt(0)}
						{user.surname.charAt(0)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-56 rounded-lg'
				align='end'
				sideOffset={8}
			>
				<DropdownMenuLabel className='p-0 font-normal'>
					<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
						<Avatar className='h-8 w-8 rounded-full'>
							<AvatarImage
								src={SIDEBAR_DATA.user.avatar}
								alt={`${user.name} ${user.surname}`}
							/>
							<AvatarFallback className='font-semibold'>
								{user.name.charAt(0)}
								{user.surname.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-semibold'>
								{user.name} {user.surname}
							</span>
							<span className='truncate text-xs'>{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<SparklesIcon />
						Upgrade to Pro
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheckIcon />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCardIcon />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<BellIcon />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={isPending}
					onClick={signOut}
				>
					{isPending ? <Loader2Icon className='animate-spin' /> : <LogOutIcon />}
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
