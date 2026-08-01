import { LucideIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlaceholderChartCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PlaceholderChartCard = ({
  icon: Icon,
  title,
  description,
}: PlaceholderChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Badge variant="outline">Coming soon</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground">
          <Icon className="size-8" />
          <p className="text-sm">Not enough data yet</p>
        </div>
      </CardContent>
    </Card>
  );
};
