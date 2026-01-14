'use client'

import type { Course } from '@studyx/types'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@studyx/ui/base'
import { usePathname } from 'next/navigation'

import { useIntl } from '@/app/(contexts)/intl'
import { getBreadcrumbs } from '@/shared/helpers/breadcrumb/getBreadcrumbs'

interface SidebarBreadcrumbProps {
	courses: Course[]
}

export const SidebarBreadcrumb = ({ courses }: SidebarBreadcrumbProps) => {
	const i18n = useIntl()
	const pathname = usePathname()

	const breadcrumbs = getBreadcrumbs({ pathname, i18n, courses })

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((item, index) => (
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
	)
}
