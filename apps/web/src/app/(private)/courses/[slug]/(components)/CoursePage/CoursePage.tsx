import type { CourseWithDetails, RoadmapPosition } from '@studyx/types'
import { Badge } from '@studyx/ui/base'
import { EmptyCard } from '@studyx/ui/common'

import { LayoutListIcon, MapIcon, MessageCircleIcon, MessageSquareIcon } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/primitives/radix/tabs'
import { CourseContent } from './components/CourseContent/CourseContent'
import { CourseHero } from './components/CourseHero/CourseHero'
import { CourseRoadmap } from './components/CourseRoadmap/CourseRoadmap'
import { CourseSidebar } from './components/CourseSidebar/CourseSidebar'

interface CoursePageMainProps {
  course: CourseWithDetails
  savedPositions: RoadmapPosition[]
  isEnrolled: boolean
  userId: string
}

export function CoursePageMain({ course, savedPositions, isEnrolled, userId }: CoursePageMainProps) {
  const modules = course.modules ?? []

  const completedLessons = 0

  return (
    <div className="grid grid-cols-12 gap-8 space-y-6">
      <div className="col-span-9">
        <CourseHero
          course={course}
          isEnrolled={isEnrolled}
          progress={0}
        />
        <div className="min-w-0 flex-1">
          <Tabs defaultValue="content">
            <TabsList className="bg-muted/50 mb-6 inline-flex h-auto gap-1 rounded-xl p-1">
              <TabsHighlight className="bg-background rounded-lg shadow-sm">
                <TabsHighlightItem value="content">
                  <TabsTrigger
                    value="content"
                    className="text-muted-foreground data-[state=active]:text-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <LayoutListIcon className="h-4 w-4" />
                    Зміст
                    <Badge
                      variant="secondary"
                      className="ml-1"
                    >
                      {modules.length}
                    </Badge>
                  </TabsTrigger>
                </TabsHighlightItem>

                <TabsHighlightItem value="roadmap">
                  <TabsTrigger
                    value="roadmap"
                    className="text-muted-foreground data-[state=active]:text-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <MapIcon className="h-4 w-4" />
                    Roadmap
                  </TabsTrigger>
                </TabsHighlightItem>

                <TabsHighlightItem value="reviews">
                  <TabsTrigger
                    value="reviews"
                    className="text-muted-foreground data-[state=active]:text-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <MessageSquareIcon className="h-4 w-4" />
                    Відгуки
                  </TabsTrigger>
                </TabsHighlightItem>
              </TabsHighlight>
            </TabsList>

            <TabsContents>
              <TabsContent value="content">
                <CourseContent
                  modules={modules}
                  courseSlug={course.slug}
                />
              </TabsContent>

              <TabsContent value="roadmap">
                <CourseRoadmap
                  userId={userId}
                  courseId={course.id}
                  modules={modules}
                  savedPositions={savedPositions}
                />
              </TabsContent>

              <TabsContent value="reviews">
                <EmptyCard
                  icon={<MessageCircleIcon size={16} />}
                  title="Відгуки поки що відсутні"
                  description="Будьте першим, хто поділиться своєю думкою про цей курс."
                />
              </TabsContent>
            </TabsContents>
          </Tabs>
        </div>
      </div>

      <div className="col-span-3 hidden shrink-0 lg:block">
        <CourseSidebar
          course={course}
          isEnrolled={isEnrolled}
          completedLessons={completedLessons}
        />
      </div>
    </div>
  )
}
