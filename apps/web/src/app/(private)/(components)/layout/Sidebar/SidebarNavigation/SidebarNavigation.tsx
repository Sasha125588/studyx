'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { match } from 'path-to-regexp'

import {
	Tooltip,
	TooltipPanel,
	TooltipTrigger
} from '@/components/animate-ui/components/base/tooltip'
import {
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/animate-ui/radix/sidebar'

import { SIDEBAR_DATA } from '../constants/data'

export const SidebarNavigation = () => {
	const pathname = usePathname() // /courses/%D0%9C%D0%9B%D0%A2%D0%90
	const pageName = `/${pathname.split('/')[1]}`

	return (
		<SidebarContent className='overflow-hidden'>
			{/* Nav Main */}
			<SidebarGroup>
				<SidebarMenu className='gap-1'>
					{SIDEBAR_DATA.navMain.map(item => (
						<SidebarMenuItem key={item.title}>
							<Tooltip>
								<TooltipTrigger className='w-full'>
									<SidebarMenuButton
										asChild
										size='md'
										isActive={!!match(item.url)(pageName)}
									>
										<Link
											href={item.url}
											className='items-center justify-center'
										>
											<item.icon className='size-5!' />
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipPanel side='right'>{item.title}</TooltipPanel>
							</Tooltip>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroup>
			{/* Nav Main */}
		</SidebarContent>
	)
}
