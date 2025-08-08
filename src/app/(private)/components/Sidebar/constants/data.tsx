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
			icon: SquareTerminal,
			items: [
				{
					title: 'History',
					url: '#'
				},
				{
					title: 'Starred',
					url: '#'
				},
				{
					title: 'Settings',
					url: '#'
				}
			]
		},
		{
			title: 'My Courses',
			url: '/courses',
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
			url: '/calendar',
			icon: BookOpen,
			items: [
				{
					title: 'Introduction',
					url: '#'
				},
				{
					title: 'Get Started',
					url: '#'
				},
				{
					title: 'Tutorials',
					url: '#'
				},
				{
					title: 'Changelog',
					url: '#'
				}
			]
		},
		{
			title: 'Settings',
			url: '/settings',
			icon: Settings2,
			items: [
				{
					title: 'General',
					url: '#'
				},
				{
					title: 'Team',
					url: '#'
				},
				{
					title: 'Billing',
					url: '#'
				},
				{
					title: 'Limits',
					url: '#'
				}
			]
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
