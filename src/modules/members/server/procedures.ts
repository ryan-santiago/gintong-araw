import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'

import { db } from '@/db'
import { members } from '@/db/schema'

import { membersInsertSchema } from '../schemas'
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MIN_PAGE_SIZE,
} from '@/constants'

export const membersRouter = createTRPCRouter({
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const [existingMember] = await db
				.select({
					//TODO: Change to actual count
					meetingCount: sql<number>`5`,
					...getTableColumns(members),
				})
				.from(members)
				.where(eq(members.id, input.id))

			if (!existingMember) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found' })
			}

			return existingMember
		}),
	getMany: protectedProcedure
		.input(
			z.object({
				page: z.number().default(DEFAULT_PAGE),
				pageSize: z
					.number()
					.min(MIN_PAGE_SIZE)
					.max(MAX_PAGE_SIZE)
					.default(DEFAULT_PAGE_SIZE),
				search: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { search, page, pageSize } = input
			const data = await db
				.select({
					//TODO: Change to actual count
					meetingCount: sql<number>`6`,
					...getTableColumns(members),
				})
				.from(members)
				.where(search ? ilike(members.first_name, `%${search}%`) : undefined)
				.orderBy(desc(members.createdAt), desc(members.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize)

			const [total] = await db
				.select({ count: count() })
				.from(members)
				.where(search ? ilike(members.first_name, `%${search}%`) : undefined)

			const totalPages = Math.ceil(total.count / pageSize)

			return {
				items: data,
				total: total.count,
				totalPages,
			}
		}),
	create: protectedProcedure
		.input(membersInsertSchema)
		.mutation(async ({ input, ctx }) => {
			const [createdMember] = await db
				.insert(members)
				.values({ ...input })
				.returning()

			return createdMember
		}),
})
