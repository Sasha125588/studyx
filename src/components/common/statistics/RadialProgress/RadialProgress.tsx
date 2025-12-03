import { CircularProgress, type CircularProgressProps } from '@/components/ui/chart-radial'

export const RadialProgress = (props: CircularProgressProps) => {
	return (
		<div className='flex max-w-xs flex-col items-center'>
			<CircularProgress {...props} />
		</div>
	)
}
