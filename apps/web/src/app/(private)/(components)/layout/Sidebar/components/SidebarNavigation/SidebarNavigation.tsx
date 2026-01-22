'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@studyx/ui/base'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { match } from 'path-to-regexp'

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/animate-ui/components/radix/sidebar'

import { SIDEBAR_DATA } from '../../constants/data'

export function SidebarNavigation() {
  const pathname = usePathname() // /courses/%D0%9C%D0%9B%D0%A2%D0%90
  const pageName = pathname === '/' ? '/' : `/${pathname.split('/')[1]}`

  return (
    <SidebarContent className="overflow-hidden">
      {/* Nav Main */}
      <SidebarGroup>
        <SidebarMenu className="gap-1">
          {SIDEBAR_DATA.navMain.map(item => (
            <SidebarMenuItem key={item.title}>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <SidebarMenuButton
                    asChild
                    size="md"
                    isActive={!!match(item.url)(pageName)}
                    className="data-[active=true]:border-sidebar-primary/40 data-[active=true]:text-sidebar-primary data-[active=true]:bg-sidebar-primary/5 transition-all duration-200 ease-in-out data-[active=true]:border"
                  >
                    <Link
                      href={item.url}
                      className="items-center justify-center"
                    >
                      <item.icon className="size-5!" />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {/* Nav Main */}
    </SidebarContent>
  )
}
