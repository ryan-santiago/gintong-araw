import { ResponsiveDialog } from '@/components/responsive-dialog'
import { MemberForm } from './member-form'

interface NewMemberDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const NewMemberDialog = ({
	open,
	onOpenChange,
}: NewMemberDialogProps) => {
	return (
		<ResponsiveDialog
			title="New Member"
			description="Create a new member"
			open={open}
			onOpenChange={onOpenChange}
		>
			<MemberForm
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	)
}
