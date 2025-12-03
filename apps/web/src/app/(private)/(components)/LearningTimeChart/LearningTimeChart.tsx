'use client'

import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { RadialProgress } from '@/components/common/statistics/RadialProgress/RadialProgress'
// import { I18nText } from '@/components/common/I18nText/I18nText'
import { Card, CardAction, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
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

export const description = 'A simple area chart'

const chartData = [
	{ day: 'Monday', hour: 6.5 },
	{ day: 'Tuesday', hour: 4.2 },
	{ day: 'Wednesday', hour: 2.5 },
	{ day: 'Thursday', hour: 5.1 },
	{ day: 'Friday', hour: 1.2 },
	{ day: 'Saturday', hour: 3.8 },
	{ day: 'Sunday', hour: 4.5 }
]

const chartConfig = {
	day: {
		label: 'Day',
		color: '#85d4b3'
	}
} satisfies ChartConfig

export const LearningTimeChart = () => {
	return (
		<Card className='rounded-[20px] py-4'>
			<CardContent className='flex gap-4 px-4'>
				<div className='w-[70%]'>
					<div className='flex items-center justify-between'>
						<CardTitle className='text-xl font-semibold'>Learning Time:</CardTitle>
						<CardAction>
							<Select
								defaultValue='7d'
								// value={timeRange}
								// onValueChange={setTimeRange}
							>
								<SelectTrigger
									className='hidden w-[130px] sm:ml-auto sm:flex'
									aria-label='Select a value'
								>
									<SelectValue placeholder='Last 3 months' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='90d'>
										{/* <I18nText path='statistics.chart.yearly' /> */}
										Last year
									</SelectItem>
									<SelectItem value='30d'>
										{/* <I18nText path='statistics.chart.monthly' /> */}
										Last month
									</SelectItem>
									<SelectItem value='7d'>
										{/* <I18nText path='statistics.chart.weekly' /> */}
										Last week
									</SelectItem>
								</SelectContent>
							</Select>
						</CardAction>
					</div>
					<ChartContainer
						className='mt-4 h-[200px] w-full'
						config={chartConfig}
					>
						<AreaChart
							accessibilityLayer
							data={chartData}
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

				<div className='flex w-[30%] flex-col'>
					<p className='ml-3 font-semibold'>Courses statistics:</p>
					<div className='flex flex-col -space-y-4'>
						<div className='flex items-center'>
							<RadialProgress
								value={91.2}
								progressClassName='stroke-[#82c1a4]'
								labelClassName='text-[#82c1a4]'
								renderLabel={progress => progress}
							/>
							<p className='text-[15px] font-semibold'>Average score of tasks</p>
						</div>
						<div className='flex items-center'>
							<RadialProgress
								progressClassName='stroke-[#e47883]'
								value={43}
								labelClassName='text-[#e47883]'
							/>
							<p className='text-[15px] font-semibold'>Tasks completed</p>
						</div>
						<div className='flex items-center'>
							<RadialProgress
								progressClassName='stroke-[#e47883]'
								value={20}
								labelClassName='text-[#e47883]'
							/>
							<p className='text-[15px] font-semibold'>Courses completed</p>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className='px-4'>
				<div className='flex w-full items-center gap-6'>
					<div className='flex h-16 flex-1 rounded-2xl border-1 border-[#daf7e7]'>
						<div className='flex h-full w-[30%] items-center justify-center rounded-l-[15px] bg-[#daf7e7] text-lg font-semibold text-[#64ab7a]'>
							4h 21m
						</div>
						<div className='flex w-[70%] justify-between px-4 py-2.5'>
							<div>
								<p className='text-xs font-medium text-gray-500'>On average</p>
								<p className='font-medium'>Per day</p>
							</div>
							<div className='flex flex-col items-center gap-1'>
								<div className='flex h-6 w-5.5 items-center justify-center rounded-sm bg-[#daf7e7]'>
									<ArrowUpIcon
										size={16}
										color='#64ab7a'
									/>
								</div>
								<p className='text-xs font-medium text-[#64ab7a]'>+2.3%</p>
							</div>
						</div>
					</div>
					<div className='flex h-16 flex-1 rounded-2xl border-1 border-[#f0d8dc]'>
						<div className='flex h-full w-[30%] items-center justify-center rounded-l-[15px] bg-[#f0d8dc] text-lg font-semibold text-[#b86a6e]'>
							29h 47m
						</div>
						<div className='flex w-[70%] justify-between px-4 py-2.5'>
							<div>
								<p className='text-xs font-medium text-gray-500'>On average</p>
								<p className='font-medium'>Per week</p>
							</div>
							<div className='flex flex-col items-center gap-1'>
								<div className='flex h-6 w-5.5 items-center justify-center rounded-sm bg-[#f0d8dc]'>
									<ArrowDownIcon
										size={16}
										color='#b86a6e'
									/>
								</div>
								<p className='text-xs font-medium text-[#b86a6e]'>-0.4%</p>
							</div>
						</div>
					</div>
					<div className='flex h-16 flex-1 rounded-2xl border-1 border-[#f2efda]'>
						<div className='flex h-full w-[30%] items-center justify-center rounded-l-[15px] bg-[#f2efda] text-lg font-semibold text-[#918c3a]'>
							884h
						</div>
						<div className='flex w-[70%] justify-between px-4 py-2.5'>
							<div>
								<p className='text-xs font-medium text-gray-500'>On average</p>
								<p className='font-medium'>Per month</p>
							</div>
							<div className='flex flex-col items-center gap-1'>
								<div className='flex h-6 w-5.5 items-center justify-center rounded-sm bg-[#f2efda]'>
									<MinusIcon
										size={16}
										color='#918c3a'
									/>
								</div>
								<p className='text-xs font-medium text-[#918c3a]'>—</p>
							</div>
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}
