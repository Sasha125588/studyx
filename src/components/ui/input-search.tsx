import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

const InputSearch = () => {
	return (
		<div className='w-xs'>
			<div className='relative'>
				<div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
					<SearchIcon className='size-4' />
					<span className='sr-only'>Search</span>
				</div>
				<Input
					type='search'
					placeholder='Search...'
					className='peer bg-accent h-8 rounded-lg border-none px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
				/>
			</div>
		</div>
	)
}

export default InputSearch
