import type { Course } from '@studyx/types'
import type { IntlShape } from 'react-intl'

interface BreadcrumbItem {
	label: string
	href?: string
	isActive?: boolean
}

interface GetBreadcrumbsProps {
	pathname: string
	i18n: IntlShape
	courses?: Course[]
}

export const getBreadcrumbs = ({ pathname, i18n, courses }: GetBreadcrumbsProps) => {
	const paths = pathname.split('/').filter(Boolean)

	const breadcrumbs: BreadcrumbItem[] = []

	breadcrumbs.push({
		label: i18n.formatMessage({ id: 'home' }),
		href: '/'
	})

	paths.forEach(path => {
		if (path === 'courses') {
			breadcrumbs.push({
				label: i18n.formatMessage({ id: 'courses' }),
				href: '/courses',
				isActive: paths.length === 1
			})
		} else if (courses) {
			const course = courses.find(c => c.slug === decodeURIComponent(path))
			if (course) {
				breadcrumbs.push({
					label: course.title!,
					href: `/courses/${course.slug}`,
					isActive: true
				})
			}
		}
	})

	return breadcrumbs
}
