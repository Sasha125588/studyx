import { InputSearch } from '@studyx/ui/base'
import { BellIcon } from 'lucide-react'

import { LanguageSwitcher } from '@/components/common/LanguageSwitcher/LanguageSwitcher'

import { SidebarBreadcrumb } from '../Sidebar/components/SidebarBreadcrumb/SidebarBreadcrumb'

import { UserProfile } from './components/UserProfile/UserProfile'
import { getCourses, getUser } from '@/shared/api'

export const Header = async () => {
	const user = await getUser()
	const courses = await getCourses()

	const name = user?.name?.split(' ')[0] ?? 'Anonymous'
	const surname = user?.name?.split(' ')[1] ?? 'Anonymous'
	const email = user?.email ?? 'Anonymous'

	return (
		<header className='bg-sidebar sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
			<div className='flex items-center gap-2'>
				<SidebarBreadcrumb courses={courses.data ?? []} />
			</div>
			<div className='flex items-center justify-center gap-6'>
				<InputSearch />
				<LanguageSwitcher />
				<BellIcon size={18} />
				<UserProfile user={{ name, surname, email }} />
			</div>
		</header>
	)
}
