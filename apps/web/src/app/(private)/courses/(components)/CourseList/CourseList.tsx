'use client'

import type { CourseEnrollment, CourseWithDetails } from '@studyx/types'
import { BookOpenIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

import { CourseFilters } from '../CourseFilters/CourseFilters'
import { useCourseFilters } from '../hooks/useCourseFilters'

import { CourseCard } from './components/CourseCard/CourseCard'

interface CourseListProps {
	courses: CourseWithDetails[]
	enrollments?: CourseEnrollment[]
	userId?: string
}

export const CourseList = ({ courses, enrollments = [], userId }: CourseListProps) => {
	const {
		filters,
		filteredCourses,
		authors,
		skills,
		setTab,
		setMyCoursesStatus,
		setSortBy,
		setAuthor,
		setSkill,
		resetFilters,
		hasActiveFilters,
		getEnrollment
	} = useCourseFilters({ courses, enrollments, userId })

	return (
		<div className='space-y-6'>
			<CourseFilters
				filters={filters}
				authors={authors}
				skills={skills}
				setTab={setTab}
				setMyCoursesStatus={setMyCoursesStatus}
				setSortBy={setSortBy}
				setAuthor={setAuthor}
				setSkill={setSkill}
				resetFilters={resetFilters}
				hasActiveFilters={hasActiveFilters}
				coursesCount={filteredCourses.length}
			/>

			{filteredCourses.length > 0 ? (
				<div className='grid gap-4 pt-0.5 sm:grid-cols-2 xl:grid-cols-3'>
					{filteredCourses.map(course => (
						<CourseCard
							key={course.id}
							course={course}
							enrollment={getEnrollment(course.id)}
						/>
					))}
				</div>
			) : (
				<EmptyState
					title={hasActiveFilters ? 'Курсів не знайдено' : 'Курси ще не додані'}
					text={
						hasActiveFilters
							? 'Спробуйте змінити параметри фільтрації.'
							: 'Створіть перший курс або поверніться пізніше.'
					}
				/>
			)}
		</div>
	)
}

const EmptyState = ({ title, text }: { title: string; text: string }) => (
	<Card className='border-dashed'>
		<CardContent className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
			<BookOpenIcon className='size-9' />
			<div className='space-y-1'>
				<p className='text-lg font-semibold'>{title}</p>
				<p className='text-muted-foreground text-sm'>{text}</p>
			</div>
		</CardContent>
	</Card>
)
