import type { CourseWithDetails } from '@studyx/types'
import Link from 'next/link'
import { Suspense } from 'react'

import { ErrorCard } from '@/components/common/ErrorCard/ErrorCard'
import { H2 } from '@/components/common/Typography/H2'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { CourseFilters } from './(components)/CourseFilters/CourseFilters'
import { CourseList } from './(components)/CourseList/CourseList'
import { getUserEnrollments } from '@/shared/api'
import { getUserId } from '@/shared/api/requests/auth/getUserId'
import { getCoursesWithDetails } from '@/shared/api/requests/courses/getCoursesWithDetails'

interface CoursesPageProps {
	searchParams: Promise<{
		q?: string
		author?: string
		skill?: string
		tab?: string
		status?: string
		sort?: string
	}>
}

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
	const params = await searchParams

	const userId = (await getUserId())!

	const [getCoursesResponse, getUserEnrollmentsResponse] = await Promise.all([
		getCoursesWithDetails({ ...params, userId }),
		getUserEnrollments(userId)
	])

	if (getCoursesResponse.error || !getUserEnrollmentsResponse.data) {
		return (
			<ErrorCard
				title='Не вдалося завантажити курси'
				description='Спробуйте оновити сторінку.'
			/>
		)
	}

	const hasActiveFilters = Object.values(params).some(value => value !== undefined)

	const courses = getCoursesResponse.data as unknown as CourseWithDetails[]

	return (
		<div className='space-y-8'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div className='space-y-1'>
					<H2>Курси</H2>
					<p className='text-muted-foreground text-sm'>
						Оберіть курс, щоб перейти до модулів та матеріалів.
					</p>
				</div>
				<Button
					asChild
					variant='outline'
					className='px-5'
				>
					<Link href='/'>Повернутися на дашборд</Link>
				</Button>
			</div>

			<CourseFilters
				courses={courses}
				enrollments={getUserEnrollmentsResponse.data}
			/>

			<Suspense fallback={<CoursesListSkeleton />}>
				<CourseList
					courses={courses}
					enrollments={getUserEnrollmentsResponse.data}
					hasActiveFilters={hasActiveFilters}
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
					className='flex h-[320px] flex-col justify-between rounded-2xl border p-5'
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
