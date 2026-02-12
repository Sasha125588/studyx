import type { CourseWithDetailsQuery } from '@/shared/api/requests/courses/types'

export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (params: CourseWithDetailsQuery) =>
      ['courses', 'list', {
        ...params,
        status: params.tab === 'my' ? params.status : 'all',
      }] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.courses.details(), slug] as const,
    continueLearning: (userId: string) => [...queryKeys.courses.all, 'continue-learning', userId] as const,
  },
  enrollments: {
    all: ['enrollments'] as const,
    status: (courseId: string, userId: string) => [...queryKeys.enrollments.all, 'status', courseId, userId] as const,
    user: (userId: string) => [...queryKeys.enrollments.all, 'user', userId] as const,
  },
  lessons: {
    all: ['lessons'] as const,
    byId: (id: number) => [...queryKeys.lessons.all, id] as const,
    bySlug: (courseSlug: string, lessonSlug: string) => [...queryKeys.lessons.all, 'slug', courseSlug, lessonSlug] as const,
    byModule: (moduleId: number) => [...queryKeys.lessons.all, 'module', moduleId] as const,
  },
  modules: {
    all: ['modules'] as const,
    byId: (id: number) => [...queryKeys.modules.all, id] as const,
    byCourse: (courseId: number) => [...queryKeys.modules.all, 'course', courseId] as const,
  },
  lessonProgress: {
    all: ['lesson-progress'] as const,
    course: (courseId: string, userId: string) => [...queryKeys.lessonProgress.all, 'course', courseId, 'user', userId] as const,
  },
  blockSubmissions: {
    all: ['block-submissions'] as const,
    byLesson: (lessonId: number, userId: string) => [...queryKeys.blockSubmissions.all, 'lesson', lessonId, 'user', userId] as const,
  },
  roadmapPositions: {
    all: ['roadmap-positions'] as const,
    byUserAndCourse: (userId: string, courseId: string) => [...queryKeys.roadmapPositions.all, 'user', userId, 'course', courseId] as const,
  },
} as const
