'use client'
import { useState } from 'react'
import { QrCodeIcon, XCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DEFAULT_PAGE } from '@/constants'

import { ScanAttendanceDialog } from './scan-attendance-dialog'
import { useAttendanceFilters } from '../../hooks/use-attendance-filters'
import { AttendanceSearchFilter } from './attendance-search-filter'

const AttendanceListHeader = () => {
	const [filters, setFilters] = useAttendanceFilters()
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const isAnyFilterModified = !!filters.search
	const onClearFilters = () => {
		setFilters({ search: '', page: DEFAULT_PAGE })
	}

	return (
		<>
			<ScanAttendanceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
			<div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
				<div className="flex items-center justify-between">
					<h5 className="font-medium text-xl">Attendance</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<QrCodeIcon /> Take Attendance
					</Button>
				</div>
				<div className="flex items-center gap-x-2 p-1">
					<AttendanceSearchFilter />
					{isAnyFilterModified && (
						<Button variant="outline" size="sm" onClick={onClearFilters}>
							<XCircleIcon />
							Clear
						</Button>
					)}
				</div>
			</div>
		</>
	)
}

export default AttendanceListHeader
