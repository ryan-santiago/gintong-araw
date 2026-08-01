"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type TrendRange = "week" | "month" | "year";

const chartConfig = {
  attended: {
    label: "Attended",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const BUCKET_UNIT: Record<TrendRange, string> = {
  week: "day",
  month: "week",
  year: "month",
};

export const AttendanceTrendChart = () => {
  const [range, setRange] = useState<TrendRange>("week");
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.dashboard.getAttendanceTrend.queryOptions({ range }),
  );

  const totalMembers = data[0]?.totalMembers ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>
          Check-ins per {BUCKET_UNIT[range]}. The dashed line reflects current
          total members, not historical membership at each period.
        </CardDescription>
        <CardAction>
          <Select
            value={range}
            onValueChange={(value) => setRange(value as TrendRange)}
          >
            <SelectTrigger className="w-[110px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart data={data} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine
              y={totalMembers}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              label={{
                value: "Total Members",
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />
            <Bar dataKey="attended" fill="var(--color-attended)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const AttendanceTrendChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-1 h-4 w-64" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[280px] w-full" />
    </CardContent>
  </Card>
);
