import { AppSidebar } from './components/Sidebar/Sidebar'
import { getUser } from '@/shared/api/requests/auth/getUser'

interface PrivateLayoutProps {
	children: React.ReactNode
}

const PrivateLayout = async ({ children }: PrivateLayoutProps) => {
	const { name, surname, email } = await getUser()

	return <AppSidebar user={{ name, surname, email }}>{children}</AppSidebar>
}

export default PrivateLayout
