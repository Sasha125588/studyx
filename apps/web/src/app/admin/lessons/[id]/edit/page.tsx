import type { LessonBlock } from '@studyx/types'
import { notFound } from 'next/navigation'

import { LessonEditor } from '../../(components)/LessonEditor/LessonEditor'

import { api } from '@/lib/elysia/client'
import { getCourses } from '@/shared/api'
import { getLessonById } from '@/shared/api/requests/lessons/{id}/getLessonById'

interface EditLessonPageProps {
	params: Promise<{ id: string }>
}

const EditLessonPage = async ({ params }: EditLessonPageProps) => {
	const { id } = await params

	const [lessonResult, coursesResult] = await Promise.all([getLessonById(+id), getCourses()])

	if (lessonResult.error || !lessonResult.data) {
		notFound()
	}

	const lesson = lessonResult.data
	const courses = coursesResult.data ?? []

	// Отримуємо courseId з модуля
	const moduleId = lesson.module_id
	let courseId: number | undefined
	let modules: Awaited<ReturnType<ReturnType<typeof api.modules.course>['get']>>['data'] = []

	if (moduleId) {
		// Шукаємо модуль в усіх курсах
		for (const course of courses) {
			const courseModulesResult = await api.modules.course({ courseId: course.id }).get()
			if (courseModulesResult.data?.some(m => m.id === moduleId)) {
				courseId = course.id
				modules = courseModulesResult.data ?? []
				break
			}
		}
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold'>Редагування уроку</h1>
				<p className='text-muted-foreground mt-1'>Редагуйте контент та налаштування уроку</p>
			</div>

			<LessonEditor
				initialData={{
					id: lesson.id,
					title: lesson.title ?? '',
					slug: lesson.slug ?? '',
					type: lesson.type,
					blocks: (lesson.blocks as unknown as LessonBlock[]) ?? [],
					moduleId: moduleId ?? undefined,
					courseId
				}}
				courses={courses}
				modules={modules ?? []}
			/>
		</div>
	)
}

export default EditLessonPage
