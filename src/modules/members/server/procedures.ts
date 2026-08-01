import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { attendance, members } from "@/db/schema";

import { membersInsertSchema, membersUpdateSchema } from "../schemas";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  ne,
  or,
} from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

export const membersRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingMember] = await db
        .select({
          ...getTableColumns(members),
          meetingCount: count(attendance.id),
        })
        .from(members)
        .leftJoin(attendance, eq(attendance.member_id, members.id))
        .where(eq(members.id, input.id))
        .groupBy(members.id);

      if (!existingMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      return existingMember;
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
    .query(async ({ input }) => {
      const { search, page, pageSize } = input;
      const data = await db
        .select({
          ...getTableColumns(members),
          meetingCount: count(attendance.id),
        })
        .from(members)
        .leftJoin(attendance, eq(attendance.member_id, members.id))
        .where(
          search
            ? or(
                ilike(members.first_name, `%${search}%`),
                ilike(members.last_name, `%${search}%`),
              )
            : undefined,
        )
        .groupBy(members.id)
        .orderBy(desc(members.createdAt), desc(members.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(members)
        .where(
          search
            ? or(
                ilike(members.first_name, `%${search}%`),
                ilike(members.last_name, `%${search}%`),
              )
            : undefined,
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
  create: protectedProcedure
    .input(membersInsertSchema)
    .mutation(async ({ input }) => {
      const [existingTrackingMember] = await db
        .select({ id: members.id })
        .from(members)
        .where(eq(members.tracking_number, input.tracking_number));

      if (existingTrackingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tracking number already exists",
        });
      }

      const [createdMember] = await db
        .insert(members)
        .values({ ...input })
        .returning();

      return createdMember;
    }),
  update: protectedProcedure
    .input(membersUpdateSchema)
    .mutation(async ({ input }) => {
      const [existingTrackingMember] = await db
        .select({ id: members.id })
        .from(members)
        .where(
          and(
            eq(members.tracking_number, input.tracking_number),
            ne(members.id, input.id),
          ),
        );

      if (existingTrackingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tracking number already exists",
        });
      }

      const { id, ...memberData } = input;
      const [updatedMember] = await db
        .update(members)
        .set({
          ...memberData,
          updatedAt: new Date(),
        })
        .where(eq(members.id, id))
        .returning();

      if (!updatedMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      return updatedMember;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [deletedMember] = await db
        .delete(members)
        .where(eq(members.id, input.id))
        .returning();

      if (!deletedMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      return deletedMember;
    }),
});
