'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { H3 } from '@/components/common/Typography/H3'
// import { I18nText } from '@/components/common/I18nText/I18nText'
import { Card, CardAction, CardContent } from '@/components/ui/card'
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

const chartData = [
	{ day: 'Понеділок', hour: 6.5 },
	{ day: 'Вівторок', hour: 4.2 },
	{ day: 'Середа', hour: 2.5 },
	{ day: 'Четвер', hour: 5.1 },
	{ day: "П'ятниця", hour: 1.2 },
	{ day: 'Субота', hour: 3.8 },
	{ day: 'Неділя', hour: 4.5 }
]

const chartConfig = {
	day: {
		label: 'Day',
		color: '#85d4b3'
	}
} satisfies ChartConfig

export const LearningTimeChart = () => {
	return (
		<Card>
			<CardContent className='flex gap-4'>
				<div className='h-full w-full min-w-0'>
					<div className='flex items-center justify-between'>
						<H3>Годин навчання</H3>
						<CardAction>
							<Select
								defaultValue='7d'
								// value={timeRange}
								// onValueChange={setTimeRange}
							>
								<SelectTrigger
									className='hidden font-medium sm:ml-auto sm:flex'
									aria-label='Select a value'
								>
									<SelectValue placeholder='Last 3 months' />
								</SelectTrigger>
								<SelectContent className='font-medium'>
									<SelectItem value='90d'>
										{/* <I18nText path='statistics.chart.yearly' /> */}
										За рік
									</SelectItem>
									<SelectItem value='30d'>
										{/* <I18nText path='statistics.chart.monthly' /> */}
										За місяць
									</SelectItem>
									<SelectItem value='7d'>
										{/* <I18nText path='statistics.chart.weekly' /> */}
										За тиждень
									</SelectItem>
								</SelectContent>
							</Select>
						</CardAction>
					</div>
					<ChartContainer
						className='mt-4 h-[200px] min-h-0 w-full min-w-0'
						config={chartConfig}
					>
						<AreaChart
							accessibilityLayer
							data={chartData}
							width={undefined}
							height={200}
							margin={{
								left: -38,
								right: 4
							}}
						>
							<CartesianGrid
								vertical={true}
								horizontal={false}
							/>
							<YAxis
								dataKey='hour'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
							/>
							<XAxis
								dataKey='day'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={value => value.slice(0, 3)}
							/>
							<defs>
								<linearGradient
									id='dayGradient'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='0%'
										stopColor='#85d4b3'
										stopOpacity={0.6}
									/>
									<stop
										offset='100%'
										stopColor='#85d4b3'
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										hideLabel={true}
										hideIndicator={true}
										formatter={value => `${value}h`}
										className='min-w-fit'
										indicator='line'
									/>
								}
							/>
							<Area
								dataKey='hour'
								type='natural'
								strokeWidth={2}
								fill='url(#dayGradient)'
								stroke='#85d4b3'
							/>
						</AreaChart>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	)
}
