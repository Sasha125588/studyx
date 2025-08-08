'use client'

import {
	BadgeCheck,
	Bell,
	ChevronRight,
	ChevronsUpDown,
	CreditCard,
	Folder,
	Forward,
	LogOut,
	MoreHorizontal,
	Sparkles,
	Trash2
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
	SidebarMenuAction,
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
import { signOut } from '@/lib/better-auth/client'
import { cn } from '@/shared/helpers/common/cn'
import { useIsMobile } from '@/shared/hooks/useIsMobile'

export interface User {
	name: string
	surname: string
	email: string
}

interface AppSidebarProps {
	user: User
	children: React.ReactNode
}

const siteInfo = SIDEBAR_DATA.site

export const AppSidebar = ({ children, user }: AppSidebarProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const pageName = `/${pathname.split('/')[1]}`
	const decodedCourseName = decodeURIComponent(pathname)

	const isMobile = useIsMobile()

	const [openItem, setOpenItem] = React.useState<string | null>(
		SIDEBAR_DATA.navMain.find(item => !!match(item.url)(pageName))?.title || null
	)

	const handleItemToggle = (itemTitle: string) => {
		setOpenItem(prev => (prev === itemTitle ? null : itemTitle))
	}

	React.useEffect(() => {
		const currentItem = SIDEBAR_DATA.navMain.find(item => !!match(item.url)(pageName))
		if (currentItem) {
			setOpenItem(currentItem.title)
		}
	}, [pageName])

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
			<Sidebar collapsible='icon'>
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
									open={openItem === item.title}
									onOpenChange={() => handleItemToggle(item.title)}
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
													<ChevronRight className='chevron-right ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90' />
												</Link>
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map(subItem => {
													const isActive = subItem.url === decodedCourseName
													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton
																asChild
																isActive={isActive}
																className={cn(isActive && 'pointer-events-none')}
															>
																<Link
																	href={subItem.url}
																	replace
																>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													)
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroup>
					{/* Nav Main */}

					{/* Nav Project */}
					<SidebarGroup className='group-data-[collapsible=icon]:hidden'>
						<SidebarGroupLabel>Projects</SidebarGroupLabel>
						<SidebarMenu>
							{SIDEBAR_DATA.projects.map(item => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.name}</span>
										</a>
									</SidebarMenuButton>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<SidebarMenuAction showOnHover>
												<MoreHorizontal />
												<span className='sr-only'>More</span>
											</SidebarMenuAction>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											className='w-48 rounded-lg'
											side={isMobile ? 'bottom' : 'right'}
											align={isMobile ? 'end' : 'start'}
										>
											<DropdownMenuItem>
												<Folder className='text-muted-foreground' />
												<span>View Project</span>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Forward className='text-muted-foreground' />
												<span>Share Project</span>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>
												<Trash2 className='text-muted-foreground' />
												<span>Delete Project</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem>
								<SidebarMenuButton className='text-sidebar-foreground/70'>
									<MoreHorizontal className='text-sidebar-foreground/70' />
									<span>More</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
					{/* Nav Project */}
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
								<BreadcrumbItem className='hidden md:block'>
									<BreadcrumbLink href='#'>Building Your Application</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className='hidden md:block' />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className='p-6'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
