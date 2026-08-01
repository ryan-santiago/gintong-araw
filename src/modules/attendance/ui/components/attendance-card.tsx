"use client";

import { format } from "date-fns";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AttendanceRow } from "../../types";

interface AttendanceCardProps {
  member: AttendanceRow;
  onClick: (memberId: string) => void;
}

export const AttendanceCard = ({ member, onClick }: AttendanceCardProps) => {
  const { first_name, middle_name, last_name } = member;

  const middleInitial = middle_name
    ? `${middle_name.charAt(0).toUpperCase()}.`
    : "";

  const fullName = `${last_name}, ${first_name}${
    middleInitial ? ` ${middleInitial}` : ""
  }`;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onClick(member.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(member.id);
        }
      }}
      className="cursor-pointer transition-colors hover:border-primary/50"
    >
      <CardHeader>
        <CardTitle className="capitalize">{fullName}</CardTitle>
        <CardDescription>
          Tracking Number: {member.tracking_number}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary">{member.totalAttended} times</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Last Attended</span>
        <span className="font-medium">
          {member.lastAttendedAt
            ? format(new Date(`${member.lastAttendedAt}T00:00:00`), "PPP")
            : "—"}
        </span>
      </CardContent>
    </Card>
  );
};
