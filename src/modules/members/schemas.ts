import { z } from 'zod'

export const membersInsertSchema = z.object({
	tracking_number: z
		.string()
		.min(1, { message: 'Tracking number is required' }),
	first_name: z.string().min(1, { message: 'First name is required' }),
	middle_name: z.string().optional(),
	last_name: z.string().min(1, { message: 'Last name is required' }),
	position: z.string().optional(),
	contact_number: z.string().optional(),
	block_number: z.string().optional(),
	lot_number: z.string().optional(),
})
