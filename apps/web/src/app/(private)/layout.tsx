import { SidebarInset, SidebarProvider } from '@/components/animate-ui/radix/sidebar'

import { Header } from './(components)/layout/Header/Header'
import { AppSidebar } from './(components)/layout/Sidebar/Sidebar'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { getCourses } from '@/shared/api/requests/courses/getCourses'

interface PrivateLayoutProps {
	children: React.ReactNode
}

const PrivateLayout = async ({ children }: PrivateLayoutProps) => {
	const { name, surname, email } = await getUser()
	const { data } = await getCourses()

	const user = { name, surname, email }

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				{/* #f8f8f8 */}
				<Header
					courses={data}
					user={user}
				/>
				<div className='p-4'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

export default PrivateLayout
