import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  description?: string;
  placeholder?: boolean;
}

export const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  placeholder,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        {placeholder && (
          <CardAction>
            <Badge variant="outline">Coming soon</Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-3xl font-semibold tabular-nums",
            placeholder && "text-muted-foreground",
          )}
        >
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
