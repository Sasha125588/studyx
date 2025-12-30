import { SidebarInset, SidebarProvider } from '@/components/animate-ui/radix/sidebar'

import { Header } from './(components)/layout/Header/Header'
import { AppSidebar } from './(components)/layout/Sidebar/Sidebar'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { getCourses } from '@/shared/api/requests/courses/getCourses'

interface PrivateLayoutProps {
	children: React.ReactNode
}

const PrivateLayout = async ({ children }: PrivateLayoutProps) => {
	const user = await getUser()
	const { data } = await getCourses()

	const name = user?.name?.split(' ')[0] ?? 'Anonymous'
	const surname = user?.name?.split(' ')[1] ?? 'Anonymous'
	const email = user?.email ?? 'Anonymous'

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<Header
					courses={data ?? []}
					user={{ name, surname, email }}
				/>
				<div className='p-4'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

export default PrivateLayout
