"use client";

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { AttendanceRow } from "../../types";

export const columns: ColumnDef<AttendanceRow>[] = [
  {
    accessorKey: "tracking_number",
    header: "Tracking Number",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.tracking_number}</span>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => {
      const { first_name, middle_name, last_name } = row.original;

      const middleInitial = middle_name
        ? `${middle_name.charAt(0).toUpperCase()}.`
        : "";

      const fullName = `${last_name}, ${first_name}${
        middleInitial ? ` ${middleInitial}` : ""
      }`;

      return <span className="capitalize font-medium">{fullName}</span>;
    },
  },
  {
    accessorKey: "totalAttended",
    header: "Times Attended",
    cell: ({ row }) => <span>{row.original.totalAttended}</span>,
  },
  {
    accessorKey: "lastAttendedAt",
    header: "Last Attended",
    cell: ({ row }) => {
      const { lastAttendedAt } = row.original;

      if (!lastAttendedAt) {
        return <span className="text-muted-foreground">—</span>;
      }

      return <span>{format(new Date(`${lastAttendedAt}T00:00:00`), "PPP")}</span>;
    },
  },
];
