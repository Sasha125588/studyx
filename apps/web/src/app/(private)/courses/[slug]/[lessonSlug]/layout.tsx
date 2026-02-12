import type { ReactNode } from 'react'
import { LessonSidebar } from './(components)/LessonPage/components/LessonSidebar/LessonSidebar'

interface LessonLayoutProps {
  children: ReactNode
  params: Promise<{
    slug: string
    lessonSlug: string
  }>
}

export default async function LessonLayout({ children, params }: LessonLayoutProps) {
  const { slug, lessonSlug } = await params
  const decodedCourseSlug = decodeURIComponent(slug)
  const decodedLessonSlug = decodeURIComponent(lessonSlug)

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)]">
      <aside className="sticky top-4 h-fit w-60 shrink-0 pt-14 pr-6">
        <LessonSidebar
          courseSlug={decodedCourseSlug}
          lessonSlug={decodedLessonSlug}
        />
      </aside>

      {children}
    </div>
  )
}
