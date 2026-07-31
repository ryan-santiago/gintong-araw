'use client'

import { ErrorState } from '@/components/error-state'
import { LoadingSate } from '@/components/loading-state'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

import { columns } from '../components/columns'
import { EmptyState } from '@/components/empty-state'
import { DataTable } from '../components/data-table'
import { DataPagination } from '../components/data-pagination'
import { useMembersFilters } from '../../hooks/use-members-filters'
import { useRouter } from 'next/navigation'

export const MembersView = () => {
	const router = useRouter()
	const [filters, setFilters] = useMembersFilters()
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(
		trpc.members.getMany.queryOptions({ ...filters }),
	)

	return (
		<div className="flex flex-col flex-1 gap-y-4 pb-4 px-4 md:px-8 ">
			<DataTable
				data={data.items}
				columns={columns}
				onRowClick={(row) => router.push(`/agents/${row.id}`)}
			/>
			<DataPagination
				page={filters.page}
				totalPages={data.totalPages}
				onPageChange={(page) => setFilters({ page })}
			/>
			{data.items.length === 0 && (
				<EmptyState
					title="Create your first agent"
					description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call"
				/>
			)}
		</div>
	)
}

export const MembersViewLoading = () => {
	return (
		<LoadingSate
			title="Loading Members"
			description="This may take a few seconds..."
		/>
	)
}

export const MembersViewError = () => {
	return (
		<ErrorState
			title="Error Loading Members"
			description="Please try again later"
		/>
	)
}
