import { type IntlShape } from 'react-intl'

import { type Database } from '@/generated/database.types'

interface BreadcrumbItem {
	label: string
	href?: string
	isActive?: boolean
}

interface BreadcrumbConfig {
	courses?: Database['public']['Tables']['course']['Row'][]
}

export const getBreadcrumbs = (
	pathname: string,
	i18n: IntlShape,
	config?: BreadcrumbConfig
): BreadcrumbItem[] => {
	const paths = pathname.split('/').filter(Boolean)
	const breadcrumbs: BreadcrumbItem[] = []

	// Always add home
	breadcrumbs.push({
		label: i18n.formatMessage({ id: 'home' }),
		href: '/'
	})

	paths.forEach((path, index) => {
		if (path === 'courses') {
			breadcrumbs.push({
				label: i18n.formatMessage({ id: 'myCourses' }),
				href: '/courses',
				isActive: paths.length === 1
			})
		} else if (config?.courses && index === 1 && paths[0] === 'courses') {
			const course = config.courses.find(c => c.url === decodeURIComponent(path))
			if (course) {
				breadcrumbs.push({
					label: course.name ?? course.url ?? '',
					isActive: true
				})
			}
		} else if (path === 'dashboard') {
			breadcrumbs.push({
				label: i18n.formatMessage({ id: 'dashboard' }),
				isActive: true
			})
		}
	})

	return breadcrumbs
}
