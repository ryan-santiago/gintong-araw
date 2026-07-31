'use client'

import { ColumnDef } from '@tanstack/react-table'

import { MemberGetOne } from '../../types'

export const columns: ColumnDef<MemberGetOne>[] = [
	{
		accessorKey: 'tracking_number',
		header: 'Tracking Number',
		cell: ({ row }) => (
			<span className="font-medium">
				{row.original.tracking_number}
			</span>
		),
	},
	{
		accessorKey: 'full_name',
		header: 'Full Name',
		cell: ({ row }) => {
			const { first_name, middle_name, last_name } = row.original

			const middleInitial = middle_name
				? `${middle_name.charAt(0).toUpperCase()}.`
				: ''

			const fullName = `${last_name}, ${first_name}${
				middleInitial ? ` ${middleInitial}` : ''
			}`

			return (
				<span className="capitalize font-medium">
					{fullName}
				</span>
			)
		},
	},
	{
		accessorKey: 'contact_number',
		header: 'Contact Number',
		cell: ({ row }) => (
			<span>{row.original.contact_number}</span>
		),
	},
	{
		accessorKey: 'block_and_lot',
		header: 'Block and Lot',
		cell: ({ row }) => {
			const { block_number, lot_number } = row.original

			return (
				<span>
					Block {block_number} Lot {lot_number}
				</span>
			)
		},
	},
]