'use client'

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/animate-ui/radix/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { SIDEBAR_DATA } from '../../Sidebar/constants/data'

export interface User {
	name: string
	surname: string
	email: string
}

interface UserProfileProps {
	user: User
}

export const UserProfile = ({ user }: UserProfileProps) => {
	// const handleSignOut = () => {
	// 	signOut({
	// 		fetchOptions: {
	// 			onSuccess: () => {
	// 				toast.success(<I18nText path='toast.loggedOut' />)
	// 				router.push('/login')
	// 			},
	// 			onError: () => {
	// 				toast.error(<I18nText path='toast.failedLogout' />)
	// 			}
	// 		}
	// 	})
	// }

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className='size-8 cursor-pointer rounded-full transition-colors duration-300 ease-in-out'>
					<AvatarImage
						src={SIDEBAR_DATA.user.avatar}
						alt={SIDEBAR_DATA.user.name}
					/>
					<AvatarFallback className='font-semibold'>
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
								alt={SIDEBAR_DATA.user.name}
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
						<Sparkles />
						Upgrade to Pro
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheck />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				{/* <DropdownMenuItem onClick={handleSignOut}> */}
				<DropdownMenuItem>
					<LogOut />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
