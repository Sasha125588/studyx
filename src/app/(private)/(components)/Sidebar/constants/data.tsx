import {
	BookOpen,
	Bot,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal
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
			title: 'Home',
			url: '/dashboard',
			icon: SquareTerminal
		},
		{
			title: 'My Courses',
			url: '#',
			icon: Bot,
			items: [
				{
					title: 'ДА',
					url: '/courses/ДА'
				},
				{
					title: 'МЛТА',
					url: '/courses/МЛТА'
				},
				{
					title: 'АіСД',
					url: '/courses/АіСД'
				},
				{
					title: 'ПР_C++',
					url: '/courses/ПР_C++'
				}
			]
		},
		{
			title: 'Calendar',
			url: '#',
			icon: BookOpen
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings2
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
