'use client'

import {
	BadgeCheck,
	Bell,
	ChevronRight,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { match } from 'path-to-regexp'
import * as React from 'react'
import { toast } from 'sonner'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/animate-ui/radix/collapsible'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/animate-ui/radix/dropdown-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger
} from '@/components/animate-ui/radix/sidebar'
import { I18nText } from '@/components/common/I18nText/I18nText'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'

import { SIDEBAR_DATA } from './constants/data'
import type { Database } from '@/generated/database.types'
import { signOut } from '@/lib/better-auth/client'
import { getBreadcrumbs } from '@/shared/helpers/breadcrumb/getBreadcrumbs'
import { cn } from '@/shared/helpers/common/cn'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useI18n } from '@/shared/providers'

export interface User {
	name: string
	surname: string
	email: string
}

interface AppSidebarProps {
	user: User
	children: React.ReactNode
	courses: Database['public']['Tables']['course']['Row'][]
}

const siteInfo = SIDEBAR_DATA.site

export const AppSidebar = ({ children, user, courses }: AppSidebarProps) => {
	const i18n = useI18n()
	const pathname = usePathname() // /courses/%D0%9C%D0%9B%D0%A2%D0%90
	const router = useRouter()
	const pageName = `/${pathname.split('/')[1]}`
	const decodedCourseName = decodeURIComponent(pathname).split('/')[2] // МЛТА

	const isMobile = useIsMobile()

	const handleSignOut = () => {
		signOut({
			fetchOptions: {
				onSuccess: () => {
					toast.success(<I18nText path='toast.loggedOut' />)
					router.push('/login')
				},
				onError: () => {
					toast.error(<I18nText path='toast.failedLogout' />)
				}
			}
		})
	}

	return (
		<SidebarProvider>
			<Sidebar
				variant='inset'
				collapsible='icon'
			>
				<SidebarHeader>
					{/* Team Switcher */}
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
									<siteInfo.logo className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>{siteInfo.name}</span>
									<span className='truncate text-xs'>{siteInfo.plan}</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
					{/* Team Switcher */}
				</SidebarHeader>

				<SidebarContent className='overflow-hidden'>
					{/* Nav Main */}
					<SidebarGroup>
						<SidebarGroupLabel>Platform</SidebarGroupLabel>
						<SidebarMenu>
							{SIDEBAR_DATA.navMain.map(item => (
								<Collapsible
									key={item.title}
									className='group/collapsible'
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												asChild
												isActive={!!match(item.url)(pageName)}
												tooltip={item.title}
											>
												<Link
													href={item.url}
													replace
												>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													{item.items && (
														<ChevronRight className='chevron-right ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90' />
													)}
												</Link>
											</SidebarMenuButton>
										</CollapsibleTrigger>
										{item.title === 'My Courses' && (
											<CollapsibleContent>
												<SidebarMenuSub>
													{courses.map(course => {
														const isActive = course.url === decodedCourseName

														return (
															<SidebarMenuSubItem key={course.id}>
																<SidebarMenuSubButton
																	asChild
																	isActive={isActive}
																	className={cn(isActive && 'pointer-events-none')}
																>
																	<Link href={`/courses/${course.url}?courseId=${course.id}`}>
																		<span>{course.url}</span>
																	</Link>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														)
													})}
												</SidebarMenuSub>
											</CollapsibleContent>
										)}
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroup>
					{/* Nav Main */}
				</SidebarContent>
				<SidebarFooter>
					{/* Nav User */}
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										size='lg'
										className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
									>
										<Avatar className='h-8 w-8 rounded-lg'>
											<AvatarImage
												src={SIDEBAR_DATA.user.avatar}
												alt={SIDEBAR_DATA.user.name}
											/>
											<AvatarFallback className='rounded-lg font-bold'>
												{user.name.charAt(0)}
												{user.surname.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold'>
												{user.name} {user.surname}
											</span>
											<span className='truncate text-xs'>{user.email}</span>
										</div>
										<ChevronsUpDown className='ml-auto size-4' />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
									side={isMobile ? 'bottom' : 'right'}
									align='end'
									sideOffset={4}
								>
									<DropdownMenuLabel className='p-0 font-normal'>
										<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
											<Avatar className='h-8 w-8 rounded-lg'>
												<AvatarImage
													src={SIDEBAR_DATA.user.avatar}
													alt={SIDEBAR_DATA.user.name}
												/>
												<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
											</Avatar>
											<div className='grid flex-1 text-left text-sm leading-tight'>
												<span className='truncate font-semibold'>
													{user.name} {user.surname}
												</span>
												<span className='truncate text-xs'>{user.email}</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<Sparkles />
											Upgrade to Pro
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem>
											<BadgeCheck />
											Account
										</DropdownMenuItem>
										<DropdownMenuItem>
											<CreditCard />
											Billing
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Bell />
											Notifications
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignOut}>
										<LogOut />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
					{/* Nav User */}
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator
							orientation='vertical'
							className='mr-2 h-4'
						/>
						<Breadcrumb>
							<BreadcrumbList>
								{getBreadcrumbs(pathname, i18n, { courses }).map((item, index) => (
									<div
										className='flex items-center gap-2'
										key={item.label}
									>
										{index > 0 && <BreadcrumbSeparator className='hidden md:block' />}
										<BreadcrumbItem className='hidden md:block'>
											{item.isActive ? (
												<BreadcrumbPage>{item.label}</BreadcrumbPage>
											) : (
												<BreadcrumbLink href={item.href || '#'}>{item.label}</BreadcrumbLink>
											)}
										</BreadcrumbItem>
									</div>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className='p-6'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
