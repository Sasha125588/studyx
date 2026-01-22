import { Skeleton } from '@studyx/ui/base'
import { Suspense } from 'react'

import { SidebarInset, SidebarProvider } from '@/components/animate-ui/components/radix/sidebar'

import { Header } from './(components)/layout/Header/Header'
import { AppSidebar } from './(components)/layout/Sidebar/Sidebar'

interface PrivateLayoutProps {
  children: React.ReactNode
}

function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Suspense fallback={<Skeleton className="h-14 w-full animate-pulse rounded-full" />}>
          <Header />
        </Suspense>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default PrivateLayout
