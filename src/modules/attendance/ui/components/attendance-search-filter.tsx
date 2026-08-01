import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

import { useAttendanceFilters } from '../../hooks/use-attendance-filters'

export const AttendanceSearchFilter = () => {
	const [filters, setFilters] = useAttendanceFilters()

	return (
		<div className="relative">
			<Input
				placeholder="Filter by name or tracking number"
				className="h-9 bg-white w-[240px] pl-7"
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value })}
			/>
			<SearchIcon className="absolute size-4 left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
		</div>
	)
}
