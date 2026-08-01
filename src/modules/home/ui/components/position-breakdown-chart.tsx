"use client";

import { Cell, Pie, PieChart } from "recharts";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const SLICE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export const PositionBreakdownChart = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.dashboard.getPositionBreakdown.queryOptions(),
  );

  const chartData = data.map((item, index) => ({
    ...item,
    fill: SLICE_COLORS[index % SLICE_COLORS.length],
  }));

  const chartConfig = data.reduce<ChartConfig>((config, item, index) => {
    config[item.position] = {
      label: item.position,
      color: SLICE_COLORS[index % SLICE_COLORS.length],
    };
    return config;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members by Position</CardTitle>
        <CardDescription>Distribution across current roles</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No members yet.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="position" hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="position"
                innerRadius={60}
                strokeWidth={2}
                stroke="var(--card)"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.position} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="position" />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export const PositionBreakdownChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-1 h-4 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className="mx-auto h-[280px] w-[280px] rounded-full" />
    </CardContent>
  </Card>
);
