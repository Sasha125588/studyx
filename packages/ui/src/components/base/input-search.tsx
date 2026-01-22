import { SearchIcon } from 'lucide-react'

import { Input } from './input'

export function InputSearch() {
  return (
    <div className="w-xs">
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <SearchIcon className="size-4" />
        </div>
        <Input
          type="search"
          placeholder="Search..."
          className="peer h-9 rounded-full px-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        />
      </div>
    </div>
  )
}
