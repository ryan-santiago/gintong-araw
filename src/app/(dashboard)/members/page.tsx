import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from 'nuqs'

import { auth } from '@/lib/auth'
import { getQueryClient, trpc } from '@/trpc/server'

import { loadSearchParams } from '@/modules/members/params'
import MemberListHeader from '@/modules/members/ui/components/members-list-header'
import {
	MembersView,
	MembersViewError,
	MembersViewLoading,
} from '@/modules/members/ui/views/members-view'

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
		trpc.members.getMany.queryOptions({
			...filters,
		}),
	)
	return (
		<>
			<MemberListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MembersViewLoading />}>
					<ErrorBoundary fallback={<MembersViewError />}>
						<MembersView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	)
}

export default Page
