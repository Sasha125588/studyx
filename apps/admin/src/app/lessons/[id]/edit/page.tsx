import type { LessonBlock } from '@studyx/types'

import { LessonEditor } from '../../(components)/LessonEditor/LessonEditor'

async function getLesson(id: string) {
  const getLessonResponse = await fetch(`http://localhost:3024/api/lessons/${id}`)
  const lesson = await getLessonResponse.json()
  return lesson
}

async function getCourses() {
  const getCoursesResponse = await fetch('http://localhost:3024/api/courses')
  const courses = await getCoursesResponse.json()
  return courses
}

async function getModules(courseId: number) {
  const getModulesResponse = await fetch(`http://localhost:3024/api/modules/course/${courseId}`)
  const modules = await getModulesResponse.json()
  return modules
}

async function EditLessonPage({ params }: PageProps<'/lessons/[id]/edit'>) {
  const { id } = await params

  const [lessonResult, coursesResult] = await Promise.all([getLesson(id), getCourses()])

  const lesson = lessonResult
  const courses = coursesResult ?? []

  // Отримуємо courseId з модуля
  const moduleId = lesson.module_id
  let courseId: number | undefined
  let modules: any[] = []

  if (moduleId) {
    // Шукаємо модуль в усіх курсах
    for (const course of courses) {
      const courseModulesResult = await getModules(course.id)
      if (courseModulesResult.some((m: any) => m.id === moduleId)) {
        courseId = course.id
        modules = courseModulesResult.data ?? []
        break
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Редагування уроку</h1>
        <p className="text-muted-foreground mt-1">Редагуйте контент та налаштування уроку</p>
      </div>

      <LessonEditor
        initialData={{
          id: lesson.id,
          title: lesson.title ?? '',
          slug: lesson.slug ?? '',
          type: lesson.type,
          blocks: (lesson.blocks as unknown as LessonBlock[]) ?? [],
          moduleId: moduleId ?? undefined,
          courseId,
        }}
        courses={courses}
        modules={modules ?? []}
      />
    </div>
  )
}

export default EditLessonPage
