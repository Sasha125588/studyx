import { AppSidebar } from './(components)/Sidebar/Sidebar'
import { getUser } from '@/shared/api/requests/auth/getUser'
import { getCourses } from '@/shared/api/requests/getCourses'

interface PrivateLayoutProps {
	children: React.ReactNode
}

const PrivateLayout = async ({ children }: PrivateLayoutProps) => {
	const { name, surname, email } = await getUser()
	const { data: courses } = await getCourses()

	return (
		<AppSidebar
			user={{ name, surname, email }}
			courses={courses ?? []}
		>
			{children}
		</AppSidebar>
	)
}

export default PrivateLayout
