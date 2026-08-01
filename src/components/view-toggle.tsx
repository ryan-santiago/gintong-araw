'use client'

import { LayoutGridIcon, TableIcon } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ViewMode } from '@/hooks/use-view-mode'

interface ViewToggleProps {
	value: ViewMode
	onChange: (value: ViewMode) => void
}

export const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
	return (
		<ToggleGroup
			type="single"
			variant="outline"
			value={value}
			onValueChange={(next) => {
				if (next) {
					onChange(next as ViewMode)
				}
			}}
		>
			<ToggleGroupItem value="table" aria-label="Table view">
				<TableIcon />
			</ToggleGroupItem>
			<ToggleGroupItem value="card" aria-label="Card view">
				<LayoutGridIcon />
			</ToggleGroupItem>
		</ToggleGroup>
	)
}
