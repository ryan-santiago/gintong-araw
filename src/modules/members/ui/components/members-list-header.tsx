'use client'
import { useState } from 'react'
import { PlusIcon, XCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DEFAULT_PAGE } from '@/constants'

import { NewMemberDialog } from './new-member-dialog'
import { useMembersFilters } from '../../hooks/use-members-filters'
import { MembersSearchFilter } from './members-search-filter'

const MemberListHeader = () => {
	const [filters, setFilters] = useMembersFilters()
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const isAnyFilterModified = !!filters.search
	const onClearFilters = () => {
		setFilters({ search: '', page: DEFAULT_PAGE })
	}

	return (
		<>
			<NewMemberDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
			<div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
				<div className="flex items-center justify-between">
					<h5 className="font-medium text-xl">My Members</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon /> New Member
					</Button>
				</div>
				<div className="flex items-center gap-x-2 p-1">
					<MembersSearchFilter />
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

export default MemberListHeader
