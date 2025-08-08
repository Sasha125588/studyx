import { BrainIcon, CalculatorIcon, CodeIcon, NetworkIcon } from 'lucide-react'

export const GRID_DATA = [
	{
		Icon: CalculatorIcon,
		name: 'Дискретний аналіз',
		description: 'Розділ математики, який вивчає властивості дискретних об’єктів.',
		href: '/courses/ДА',
		cta: 'Детальніше',
		className: 'col-span-3 lg:col-span-1',
		background: <div>1</div>
	},
	{
		Icon: BrainIcon,
		name: 'Математична логіка та теорія алгоритмів',
		description: 'Розділ математики, який вивчає математичну логіку та теорію алгоритмів.',
		href: '/courses/МЛТА',
		cta: 'Детальніше',
		className: 'col-span-3 lg:col-span-2',
		background: <div>2</div>
	},
	{
		Icon: NetworkIcon,
		name: 'Алгоритми та структури даних',
		description: 'Розділ математики, який вивчає алгоритми та структури даних.',
		href: '/courses/АіСД',
		cta: 'Детальніше',
		className: 'col-span-3 lg:col-span-2',
		background: <div>3</div>
	},
	{
		Icon: CodeIcon,
		name: 'Програмування C++',
		description: 'Розділ програмування, який вивчає програмування на мові C++.',
		className: 'col-span-3 lg:col-span-1',
		href: '/courses/ПР_C++',
		cta: 'Детальніше',
		background: <div>4</div>
	}
]
