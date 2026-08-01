"use client";

import { Suspense } from "react";
import { CalendarClock, PercentIcon, UserPlus, Users, Wallet } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingSate } from "@/components/loading-state";

import { StatCard } from "../components/stat-card";
import { LatestMembersList } from "../components/latest-members-list";
import { LatestAttendanceList } from "../components/latest-attendance-list";
import {
  AttendanceTrendChart,
  AttendanceTrendChartSkeleton,
} from "../components/attendance-trend-chart";
import {
  PositionBreakdownChart,
  PositionBreakdownChartSkeleton,
} from "../components/position-breakdown-chart";
import { PlaceholderChartCard } from "../components/placeholder-chart-card";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(trpc.dashboard.getStats.queryOptions());
  const { data: latestMembers } = useSuspenseQuery(
    trpc.dashboard.getLatestMembers.queryOptions(),
  );
  const { data: latestAttendance } = useSuspenseQuery(
    trpc.dashboard.getLatestAttendance.queryOptions(),
  );

  return (
    <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto px-4 pt-4 pb-4 md:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} />
        <StatCard
          icon={PercentIcon}
          label="Attendance Rate"
          value="—"
          placeholder
          description="Attended vs. total members, latest meeting"
        />
        <StatCard
          icon={UserPlus}
          label="New Members"
          value="—"
          placeholder
          description="Added this month"
        />
        <StatCard
          icon={CalendarClock}
          label="Last Meeting"
          value="—"
          placeholder
          description="Most recent recorded attendance date"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Suspense fallback={<AttendanceTrendChartSkeleton />}>
            <AttendanceTrendChart />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<PositionBreakdownChartSkeleton />}>
            <PositionBreakdownChart />
          </Suspense>
        </div>

        <div className="lg:col-span-6">
          <LatestMembersList members={latestMembers} />
        </div>
        <div className="lg:col-span-6">
          <LatestAttendanceList records={latestAttendance} />
        </div>

        <div className="lg:col-span-12">
          <PlaceholderChartCard
            icon={Wallet}
            title="Dues & Collections"
            description="Track member dues and payment status once the finance module is added."
          />
        </div>
      </div>
    </div>
  );
};

export const HomeViewLoading = () => {
  return (
    <LoadingSate
      title="Loading Dashboard"
      description="This may take a few seconds..."
    />
  );
};

export const HomeViewError = () => {
  return (
    <ErrorState
      title="Error Loading Dashboard"
      description="Please try again later"
    />
  );
};
