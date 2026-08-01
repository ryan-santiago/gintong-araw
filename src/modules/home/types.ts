import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type DashboardStats = inferRouterOutputs<AppRouter>["dashboard"]["getStats"];
export type AttendanceTrendPoint =
  inferRouterOutputs<AppRouter>["dashboard"]["getAttendanceTrend"][number];
export type PositionBreakdownItem =
  inferRouterOutputs<AppRouter>["dashboard"]["getPositionBreakdown"][number];
export type LatestMember =
  inferRouterOutputs<AppRouter>["dashboard"]["getLatestMembers"][number];
export type LatestAttendanceRow =
  inferRouterOutputs<AppRouter>["dashboard"]["getLatestAttendance"][number];
