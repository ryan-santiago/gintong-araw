import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { db } from "@/db";
import { attendance, members } from "@/db/schema";

import { attendanceScanPayloadSchema, recordScanInputSchema } from "../schemas";
import { and, count, desc, eq, getTableColumns, ilike, max, or } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";

const UNIQUE_VIOLATION_CODE = "23505";

const getPhilippineDateString = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(date);

export const attendanceRouter = createTRPCRouter({
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
      const whereClause = search
        ? or(
            ilike(members.first_name, `%${search}%`),
            ilike(members.last_name, `%${search}%`),
            ilike(members.tracking_number, `%${search}%`),
          )
        : undefined;

      const items = await db
        .select({
          ...getTableColumns(members),
          totalAttended: count(attendance.id),
          lastAttendedAt: max(attendance.attendance_date),
        })
        .from(members)
        .leftJoin(attendance, eq(attendance.member_id, members.id))
        .where(whereClause)
        .groupBy(members.id)
        .orderBy(desc(members.createdAt), desc(members.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(members)
        .where(whereClause);

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items,
        total: total.count,
        totalPages,
      };
    }),

  recordScan: protectedProcedure
    .input(recordScanInputSchema)
    .mutation(async ({ input }) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(input.payload);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "QR code is not valid JSON",
        });
      }

      const result = attendanceScanPayloadSchema.safeParse(parsed);
      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "QR code is missing tracking_number or name",
        });
      }

      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.tracking_number, result.data.tracking_number));

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No member found with tracking number ${result.data.tracking_number}`,
        });
      }

      const attendanceDate = getPhilippineDateString(new Date());
      const alreadyPresentMessage = `${member.first_name} ${member.last_name} is already marked present today`;

      const [existing] = await db
        .select({ id: attendance.id })
        .from(attendance)
        .where(
          and(
            eq(attendance.member_id, member.id),
            eq(attendance.attendance_date, attendanceDate),
          ),
        );

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: alreadyPresentMessage });
      }

      try {
        const [createdAttendance] = await db
          .insert(attendance)
          .values({ member_id: member.id, attendance_date: attendanceDate })
          .returning();

        return { member, attendance: createdAttendance };
      } catch (error) {
        const isUniqueViolation =
          error instanceof Error &&
          "code" in error &&
          (error as { code?: string }).code === UNIQUE_VIOLATION_CODE;

        if (isUniqueViolation) {
          throw new TRPCError({ code: "CONFLICT", message: alreadyPresentMessage });
        }

        throw error;
      }
    }),

  getMemberHistory: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .query(async ({ input }) => {
      const [member] = await db
        .select()
        .from(members)
        .where(eq(members.id, input.memberId));

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      const records = await db
        .select()
        .from(attendance)
        .where(eq(attendance.member_id, input.memberId))
        .orderBy(desc(attendance.attendance_date));

      return { member, records };
    }),
});
