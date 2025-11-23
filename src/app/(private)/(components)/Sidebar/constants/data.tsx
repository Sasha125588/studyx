import {
	BookOpenTextIcon,
	CalendarIcon,
	Frame,
	GalleryVerticalEnd,
	HouseIcon,
	Map,
	PieChart,
	SettingsIcon
} from 'lucide-react'

export const SIDEBAR_DATA = {
	user: {
		name: 'Skyleen',
		email: 'skyleen@example.com',
		avatar: 'https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg'
	},
	site: {
		name: 'Studyx',
		logo: GalleryVerticalEnd,
		plan: 'Education Platform'
	},
	navMain: [
		{
			title: 'Головна',
			url: '/',
			icon: HouseIcon
		},
		{
			title: 'Курси',
			url: '/courses',
			icon: BookOpenTextIcon
		},
		{
			title: 'Розклад',
			url: '#',
			icon: CalendarIcon
		},
		{
			title: 'Налаштування',
			url: '#',
			icon: SettingsIcon
		}
	],
	projects: [
		{
			name: 'Design Engineering',
			url: '#',
			icon: Frame
		},
		{
			name: 'Sales & Marketing',
			url: '#',
			icon: PieChart
		},
		{
			name: 'Travel',
			url: '#',
			icon: Map
		}
	]
}
