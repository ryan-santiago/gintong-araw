'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CornerDownRightIcon, VideoIcon } from 'lucide-react'

import { GeneratedAvatar } from '@/components/generated-avatar'
import { Badge } from '@/components/ui/badge'

import { MemberGetOne } from '../../types'

export const columns: ColumnDef<MemberGetOne>[] = [
	{
		accessorKey: 'name',
		header: 'Member Name',
		cell: ({ row }) => (
			<div className="flex flex-col gap-y-1">
				<div className="flex items-center gap-x-2">
					<GeneratedAvatar
						variant="botttsNeutral"
						seed={row.original.first_name}
						className="size-6"
					/>
					<span className="font-semibold capitalize">
						{row.original.first_name}
					</span>
				</div>

				<div className="flex items-center gap-x-2">
					<CornerDownRightIcon className="size-3 text-muted-foreground" />
					<span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
						{row.original.last_name}
					</span>
				</div>
			</div>
		),
	},
	{
		accessorKey: 'meetingCount',
		header: 'Meetings',
		cell: ({ row }) => (
			<Badge
				variant="outline"
				className="flex items-center gap-x-2 [&>svg]:size-4"
			>
				<VideoIcon className="text-blue-700" />
				{row.original.meetingCount}{' '}
				{row.original.meetingCount === 1 ? 'meeting' : 'meetings'}
			</Badge>
		),
	},
]
