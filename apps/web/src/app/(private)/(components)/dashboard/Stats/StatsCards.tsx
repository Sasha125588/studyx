'use client'

import { AlarmClockCheck, BookOpenCheck, Gauge, Trophy } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'

const statsCards = [
	{
		title: 'Годин навчання',
		value: '142',
		delta: '+8.5%',
		trend: 'up' as const,
		subtext: 'За тиждень',
		Icon: AlarmClockCheck
	},
	{
		title: 'Курсів завершено',
		value: '12',
		delta: '+3.1%',
		subtext: 'За весь час',
		Icon: BookOpenCheck
	},
	{
		title: 'Середня оцінка за тест',
		value: '8.6',
		delta: '+0.6',
		trend: 'up' as const,
		subtext: 'За тиждень',
		Icon: Gauge
	},
	{
		title: 'Досягнень отримано',
		value: '18',
		delta: '+1',
		subtext: 'За весь час',
		Icon: Trophy
	}
]

export const StatsCards = () => {
	const [gradientPositions] = useState(() =>
		statsCards.map(() => ({
			x: Math.floor(Math.random() * 80) + 10,
			y: Math.floor(Math.random() * 80) + 10
		}))
	)

	return (
		<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
			{statsCards.map((card, index) => (
				<Card
					key={card.title}
					className='relative overflow-hidden rounded-[20px] shadow-xs transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-sm'
				>
					<div className='absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-yellow-500 via-yellow-200 to-yellow-500' />
					<div
						style={{
							background: `radial-gradient(circle at ${gradientPositions[index].x}% ${gradientPositions[index].y}%, rgba(250, 204, 21,0.1), transparent 42%)`
						}}
						className='pointer-events-none absolute inset-0'
					/>
					<CardContent className='relative space-y-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200/70'>
									<card.Icon className='h-5 w-5' />
								</div>
								<p className='text-base leading-tight font-semibold text-slate-900'>{card.title}</p>
							</div>
							{card.trend && (
								<div
									className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold ${
										card.trend === 'up'
											? 'border-emerald-300 bg-emerald-50 text-emerald-700'
											: 'border-rose-300 bg-rose-50 text-rose-700'
									}`}
								>
									<span>{card.trend === 'up' ? '↑' : '↓'}</span>
									<span>{card.delta}</span>
								</div>
							)}
						</div>
						<div className='space-y-1'>
							<p className='text-3xl leading-none font-extrabold tracking-tight text-slate-900'>
								{card.value}
							</p>
							<p className='text-[13px] font-medium tracking-wide text-slate-500 uppercase'>
								{card.subtext}
							</p>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
