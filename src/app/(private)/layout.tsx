import { AppSidebar } from './components/Sidebar/Sidebar'

interface PrivateLayoutProps {
	children: React.ReactNode
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
	return <AppSidebar>{children}</AppSidebar>
}

export default PrivateLayout
