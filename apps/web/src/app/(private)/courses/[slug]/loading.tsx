import { Skeleton } from '@studyx/ui/base'

const Loading = () => {
	return (
		<div className='grid grid-cols-12 gap-8 space-y-6'>
			{/* Main Content - col-span-9 */}
			<div className='col-span-9'>
				{/* CourseHero Skeleton */}
				<section className='relative mb-8'>
					<div className='mb-4 flex items-center gap-3'>
						<Skeleton className='h-6 w-24 rounded-full' />
					</div>

					<Skeleton className='h-10 w-3/4' />

					<Skeleton className='mt-4 h-4 w-full max-w-4xl' />
					<Skeleton className='mt-2 h-4 w-5/6 max-w-4xl' />

					<div className='mt-6 flex flex-wrap items-center gap-3'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-5 w-px' />
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-5 w-px' />
						<div className='flex items-center gap-2'>
							<Skeleton className='h-5 w-16' />
							<div className='flex -space-x-2'>
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton
										key={i}
										className='h-8 w-8 rounded-full'
									/>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Tabs Skeleton */}
				<div className='min-w-0 flex-1'>
					{/* Tabs List */}
					<div className='bg-muted/50 mb-6 inline-flex h-auto gap-1 rounded-xl p-1'>
						<Skeleton className='h-9 w-32 rounded-lg' />
						<Skeleton className='h-9 w-28 rounded-lg' />
						<Skeleton className='h-9 w-24 rounded-lg' />
					</div>

					{/* CourseContent Skeleton - Accordion */}
					<div className='space-y-4'>
						{Array.from({ length: 3 }).map((_, moduleIdx) => (
							<div
								key={moduleIdx}
								className='bg-card overflow-hidden rounded-xl border px-0'
							>
								{/* Accordion Header */}
								<div className='flex items-center justify-between border-b px-6 py-4'>
									<div className='flex-1'>
										<Skeleton className='h-6 w-48' />
										<div className='mt-2 flex items-center gap-2'>
											<Skeleton className='h-4 w-4' />
											<Skeleton className='h-4 w-20' />
										</div>
									</div>
									<Skeleton className='h-5 w-12' />
								</div>

								{/* Accordion Content - Lessons */}
								<div className='px-0 pb-0'>
									{Array.from({ length: 2 }).map((_, lessonIdx) => (
										<div
											key={lessonIdx}
											className='flex items-center justify-between border-t px-6 py-4'
										>
											<div className='flex items-center gap-4'>
												<Skeleton className='h-10 w-10 rounded-lg' />
												<div>
													<Skeleton className='h-5 w-64' />
													<Skeleton className='mt-1 h-3 w-32' />
												</div>
											</div>
											<Skeleton className='h-4 w-16' />
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Sidebar - col-span-3 */}
			<div className='col-span-3 hidden shrink-0 lg:block'>
				<aside className='sticky top-24 space-y-4'>
					{/* Statistics Card */}
					<div className='bg-card rounded-xl border p-6'>
						<Skeleton className='mb-4 h-5 w-32' />

						{/* Progress Circle */}
						<div className='mb-6 flex justify-center'>
							<Skeleton className='h-24 w-24 rounded-full' />
						</div>

						{/* Stats Details */}
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Skeleton className='h-4 w-16' />
								<Skeleton className='h-4 w-8' />
							</div>
							<div className='flex items-center justify-between'>
								<Skeleton className='h-4 w-20' />
								<Skeleton className='h-4 w-8' />
							</div>
							<div className='bg-border h-px' />
							<div className='flex justify-between'>
								<Skeleton className='h-4 w-16' />
								<Skeleton className='h-4 w-8' />
							</div>
						</div>

						{/* CTA Button */}
						<Skeleton className='mt-6 h-10 w-full rounded-lg' />
					</div>

					{/* Authors Card */}
					<div className='bg-card rounded-xl border p-4'>
						<Skeleton className='mb-3 h-4 w-28' />
						<div className='space-y-3'>
							{Array.from({ length: 2 }).map((_, i) => (
								<div
									key={i}
									className='flex items-center gap-3'
								>
									<Skeleton className='h-10 w-10 rounded-full' />
									<div className='flex-1'>
										<Skeleton className='h-4 w-24' />
										<Skeleton className='mt-1 h-3 w-32' />
									</div>
								</div>
							))}
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}

export default Loading
