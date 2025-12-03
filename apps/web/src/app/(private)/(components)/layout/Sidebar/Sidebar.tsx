import {
	Sidebar,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from '@/components/animate-ui/radix/sidebar'

import { SidebarNavigation } from './SidebarNavigation/SidebarNavigation'
import { SIDEBAR_DATA } from './constants/data'

export const AppSidebar = () => {
	return (
		<Sidebar
			variant='sidebar'
			collapsible='none'
			className='sticky top-0 h-screen gap-4 border-r'
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg'>
							<div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg'>
								<SIDEBAR_DATA.site.logo className='size-5' />
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarNavigation />

			<SidebarRail />
		</Sidebar>
	)
}
