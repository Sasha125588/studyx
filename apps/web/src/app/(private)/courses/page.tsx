import type { CourseEnrollment, CourseWithModules } from '@studyx/database'
import Link from 'next/link'
import { Suspense } from 'react'

import { H2 } from '@/components/common/Typography/H2'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { CourseList } from './(components)/CourseList/CourseList'
import { getCoursesWithDetails } from '@/shared/api/requests/courses/getCoursesWithDetails'

// TODO: Замініть на реальний запит до бекенду
const getEnrollments = async (): Promise<CourseEnrollment[]> => {
	// Тимчасові моковані дані для демонстрації
	// Коли бекенд буде готовий, замініть на реальний запит
	return []
}

// TODO: Замініть на реальне отримання userId з сесії
const getCurrentUserId = async (): Promise<string | undefined> => {
	// Поки повертаємо undefined
	return undefined
}

const CoursesPage = async () => {
	const [{ data: courses, error }, enrollments, userId] = await Promise.all([
		getCoursesWithDetails(),
		getEnrollments(),
		getCurrentUserId()
	])

	if (error) {
		return (
			<Card className='border-destructive/30 bg-destructive/5'>
				<CardContent className='text-destructive py-6'>
					Не вдалося завантажити курси. Спробуйте оновити сторінку.
				</CardContent>
			</Card>
		)
	}

	const courseList = courses ?? []

	return (
		<div className='space-y-8'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div className='space-y-1'>
					<H2 className='text-slate-900'>Курси</H2>
					<p className='text-muted-foreground text-sm'>
						Оберіть курс, щоб перейти до модулів та матеріалів.
					</p>
				</div>
				<Button
					asChild
					variant='outline'
					className='rounded-full border-slate-200 px-5 text-slate-800'
				>
					<Link href='/'>Повернутися на дашборд</Link>
				</Button>
			</div>

			<Suspense fallback={<CoursesListSkeleton />}>
				<CourseList
					courses={courseList}
					enrollments={enrollments}
					userId={userId}
				/>
			</Suspense>
		</div>
	)
}

export default CoursesPage

const CoursesListSkeleton = () => (
	<div className='space-y-6'>
		{/* Skeleton для табів та пошуку */}
		<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
			<Skeleton className='h-10 w-80 rounded-full' />
			<div className='flex items-center gap-3'>
				<Skeleton className='h-9 w-72 rounded-full' />
				<Skeleton className='h-9 w-24 rounded-full' />
			</div>
		</div>
		{/* Skeleton для карток */}
		<div className='grid gap-4 pt-0.5 sm:grid-cols-2 xl:grid-cols-3'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className='flex h-[320px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5'
				>
					<div className='space-y-3'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-6 w-3/4' />
						<Skeleton className='h-16 w-full' />
						<div className='space-y-2'>
							<Skeleton className='h-3 w-16' />
							<div className='flex gap-2'>
								<Skeleton className='h-6 w-20' />
								<Skeleton className='h-6 w-24' />
							</div>
						</div>
					</div>
					<div className='flex items-center justify-between pt-4'>
						<div className='space-y-2'>
							<Skeleton className='h-3 w-32' />
							<Skeleton className='h-3 w-24' />
						</div>
						<Skeleton className='h-8 w-24 rounded-full' />
					</div>
				</div>
			))}
		</div>
	</div>
)
