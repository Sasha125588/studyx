import type { Course } from '@studyx/database'
import { BellIcon } from 'lucide-react'

import InputSearch from '@/components/ui/input-search'

import { SidebarBreadcrumb } from '../Sidebar/SidebarBreadcrumb/SidebarBreadcrumb'

import { type User, UserProfile } from './UserProfile/UserProfile'

interface HeaderProps {
	courses: Course[]
	user: User
}

export const Header = ({ courses, user }: HeaderProps) => {
	return (
		<header className='bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2'>
				<SidebarBreadcrumb courses={courses} />
			</div>
			<div className='flex items-center justify-center gap-6'>
				<InputSearch />
				<BellIcon size={18} />
				<UserProfile user={user} />
			</div>
		</header>
	)
}
