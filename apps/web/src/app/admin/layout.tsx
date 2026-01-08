import Link from 'next/link'

import { getUser } from '@/shared/api/requests/auth'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await getUser()

	return (
		<div className='bg-background min-h-screen'>
			{/* Admin Header */}
			<header className='bg-card sticky top-0 z-50 border-b'>
				<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
					<div className='flex items-center gap-4'>
						<h1 className='text-xl font-bold'>StudyX Admin</h1>
						<nav className='flex items-center gap-2'>
							<a
								href='/admin'
								className='text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors'
							>
								Dashboard
							</a>
							<a
								href='/admin/courses'
								className='text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors'
							>
								Курси
							</a>
							<a
								href='/admin/lessons'
								className='text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors'
							>
								Уроки
							</a>
							<a
								href='/admin/submissions'
								className='text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors'
							>
								Роботи студентів
							</a>
						</nav>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-muted-foreground text-sm'>{user?.name}</span>
						<Link
							href='/'
							className='text-muted-foreground hover:text-foreground text-sm'
						>
							← На сайт
						</Link>
					</div>
				</div>
			</header>

			<main className='mx-auto max-w-7xl px-4 py-8'>{children}</main>
		</div>
	)
}

export default AdminLayout
