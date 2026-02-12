import { Skeleton } from '@studyx/ui/base'

function Loading() {
  return (
    <>
      {/* Main Content Skeleton */}
      <main className="min-w-0 flex-1 px-4">
        {/* Header Skeleton */}
        <div className="space-y-4">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Lesson header card skeleton */}
          <div className="relative overflow-hidden rounded-2xl border p-6">
            <div className="mb-3 flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="mt-6 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3"
            >
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>

        {/* Comments Section Skeleton */}
        <div className="mt-12">
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
        </div>
      </main>

      {/* Right Panel Skeleton */}
      <aside className="sticky top-4 h-fit w-72 shrink-0 pt-14 pl-6">
        <div className="space-y-4">
          {/* Progress card skeleton */}
          <div className="bg-card rounded-xl border p-4">
            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>

          {/* Attachments card skeleton */}
          <div className="bg-card rounded-xl border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Loading
