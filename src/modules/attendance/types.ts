import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type AttendanceGetManyOutput =
  inferRouterOutputs<AppRouter>["attendance"]["getMany"];
export type AttendanceRow = AttendanceGetManyOutput["items"][number];
export type MemberHistoryOutput =
  inferRouterOutputs<AppRouter>["attendance"]["getMemberHistory"];
