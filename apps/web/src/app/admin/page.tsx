import { BookOpenIcon, ClipboardCheckIcon, FileTextIcon, UsersIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

const AdminDashboard = () => {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-bold'>Панель адміністратора</h1>
				<p className='text-muted-foreground mt-1'>Керування контентом LMS</p>
			</div>

			{/* Stats */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<Card className='p-6'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950'>
							<BookOpenIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Курси</p>
							<p className='text-2xl font-bold'>12</p>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950'>
							<FileTextIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Уроки</p>
							<p className='text-2xl font-bold'>48</p>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950'>
							<UsersIcon className='h-6 w-6 text-purple-600 dark:text-purple-400' />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>Студенти</p>
							<p className='text-2xl font-bold'>256</p>
						</div>
					</div>
				</Card>

				<Card className='p-6'>
					<div className='flex items-center gap-4'>
						<div className='flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950'>
							<ClipboardCheckIcon className='h-6 w-6 text-amber-600 dark:text-amber-400' />
						</div>
						<div>
							<p className='text-muted-foreground text-sm'>На перевірку</p>
							<p className='text-2xl font-bold'>8</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Quick actions */}
			<div>
				<h2 className='mb-4 text-xl font-semibold'>Швидкі дії</h2>
				<div className='grid gap-4 md:grid-cols-3'>
					<a
						href='/admin/lessons/new'
						className='bg-card hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-4 transition-colors'
					>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-500'>
							<FileTextIcon className='h-5 w-5 text-white' />
						</div>
						<div>
							<p className='font-medium'>Створити урок</p>
							<p className='text-muted-foreground text-sm'>Новий урок з блоками</p>
						</div>
					</a>

					<a
						href='/admin/submissions'
						className='bg-card hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-4 transition-colors'
					>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500'>
							<ClipboardCheckIcon className='h-5 w-5 text-white' />
						</div>
						<div>
							<p className='font-medium'>Перевірити роботи</p>
							<p className='text-muted-foreground text-sm'>8 робіт очікують</p>
						</div>
					</a>

					<a
						href='/admin/courses/new'
						className='bg-card hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-4 transition-colors'
					>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500'>
							<BookOpenIcon className='h-5 w-5 text-white' />
						</div>
						<div>
							<p className='font-medium'>Створити курс</p>
							<p className='text-muted-foreground text-sm'>Новий навчальний курс</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard
