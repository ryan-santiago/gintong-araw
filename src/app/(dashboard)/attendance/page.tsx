import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from 'nuqs'

import { auth } from '@/lib/auth'
import { getQueryClient, trpc } from '@/trpc/server'

import { loadSearchParams } from '@/modules/attendance/params'
import AttendanceListHeader from '@/modules/attendance/ui/components/attendance-list-header'
import {
	AttendanceView,
	AttendanceViewError,
	AttendanceViewLoading,
} from '@/modules/attendance/ui/views/attendance-view'

interface Props {
	searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
	const filters = await loadSearchParams(searchParams)

	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		redirect('/sign-in')
	}

	const queryClient = getQueryClient()
	void queryClient.prefetchQuery(
		trpc.attendance.getMany.queryOptions({
			...filters,
		}),
	)
	return (
		<>
			<AttendanceListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<AttendanceViewLoading />}>
					<ErrorBoundary fallback={<AttendanceViewError />}>
						<AttendanceView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	)
}

export default Page
