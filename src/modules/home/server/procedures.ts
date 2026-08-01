import { z } from "zod";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { db } from "@/db";
import { attendance, members } from "@/db/schema";
import { count, desc, eq, gte, lte, and } from "drizzle-orm";

type TrendRange = "week" | "month" | "year";

interface TrendBucket {
  label: string;
  start: Date;
  end: Date;
}

const getTrendBuckets = (range: TrendRange, now: Date): TrendBucket[] => {
  if (range === "week") {
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end }).map((date) => ({
      label: format(date, "EEE"),
      start: date,
      end: date,
    }));
  }

  if (range === "month") {
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map(
      (weekStart, index) => ({
        label: `Wk ${index + 1}`,
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      }),
    );
  }

  const start = startOfYear(now);
  const end = endOfYear(now);

  return eachMonthOfInterval({ start, end }).map((monthStart) => ({
    label: format(monthStart, "MMM"),
    start: startOfMonth(monthStart),
    end: endOfMonth(monthStart),
  }));
};

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async () => {
    const [{ count: totalMembers }] = await db
      .select({ count: count() })
      .from(members);

    return { totalMembers };
  }),

  getAttendanceTrend: protectedProcedure
    .input(z.object({ range: z.enum(["week", "month", "year"]) }))
    .query(async ({ input }) => {
      const buckets = getTrendBuckets(input.range, new Date());
      const rangeStart = format(buckets[0].start, "yyyy-MM-dd");
      const rangeEnd = format(buckets[buckets.length - 1].end, "yyyy-MM-dd");

      const rows = await db
        .select({ attendance_date: attendance.attendance_date })
        .from(attendance)
        .where(
          and(
            gte(attendance.attendance_date, rangeStart),
            lte(attendance.attendance_date, rangeEnd),
          ),
        );

      const [{ count: totalMembers }] = await db
        .select({ count: count() })
        .from(members);

      return buckets.map(({ label, start, end }) => {
        const startStr = format(start, "yyyy-MM-dd");
        const endStr = format(end, "yyyy-MM-dd");

        const attended = rows.filter(
          (row) => row.attendance_date >= startStr && row.attendance_date <= endStr,
        ).length;

        return { label, attended, totalMembers };
      });
    }),

  getPositionBreakdown: protectedProcedure.query(async () => {
    const rows = await db
      .select({ position: members.position, count: count() })
      .from(members)
      .groupBy(members.position)
      .orderBy(desc(count()));

    const named = rows.map((row) => ({
      position: row.position?.trim() || "No Position",
      count: row.count,
    }));

    const top = named.slice(0, 4);
    const restTotal = named.slice(4).reduce((sum, row) => sum + row.count, 0);

    return restTotal > 0 ? [...top, { position: "Other", count: restTotal }] : top;
  }),

  getLatestMembers: protectedProcedure.query(async () => {
    return db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt), desc(members.id))
      .limit(5);
  }),

  getLatestAttendance: protectedProcedure.query(async () => {
    return db
      .select({
        id: attendance.id,
        attendance_date: attendance.attendance_date,
        scanned_at: attendance.scanned_at,
        member_id: members.id,
        tracking_number: members.tracking_number,
        first_name: members.first_name,
        middle_name: members.middle_name,
        last_name: members.last_name,
      })
      .from(attendance)
      .innerJoin(members, eq(attendance.member_id, members.id))
      .orderBy(desc(attendance.scanned_at))
      .limit(5);
  }),
});
