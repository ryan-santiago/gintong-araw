"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingSate } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { useTRPC } from "@/trpc/client";

import { columns } from "../components/columns";
import { AttendanceCard } from "../components/attendance-card";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { ViewToggle } from "@/components/view-toggle";
import { useViewMode } from "@/hooks/use-view-mode";
import { MemberHistoryDialog } from "../components/member-history-dialog";
import { useAttendanceFilters } from "../../hooks/use-attendance-filters";
import { AttendanceRow } from "../../types";

export const AttendanceView = () => {
  const [filters, setFilters] = useAttendanceFilters();
  const [viewMode, setViewMode] = useViewMode();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.attendance.getMany.queryOptions({ ...filters }),
  );

  return (
    <div className="flex flex-col flex-1 gap-y-4 pb-4 px-4 md:px-8 ">
      <div className="flex justify-end">
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "table" ? (
        <DataTable
          data={data.items}
          columns={columns}
          onRowClick={(row: AttendanceRow) => setSelectedMemberId(row.id)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.items.map((member) => (
            <AttendanceCard
              key={member.id}
              member={member}
              onClick={setSelectedMemberId}
            />
          ))}
        </div>
      )}

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="No members yet"
          description="Add members first, then take attendance to see records here"
        />
      )}

      <MemberHistoryDialog
        memberId={selectedMemberId}
        onOpenChange={(open) => !open && setSelectedMemberId(null)}
      />
    </div>
  );
};

export const AttendanceViewLoading = () => {
  return (
    <LoadingSate
      title="Loading Attendance"
      description="This may take a few seconds..."
    />
  );
};

export const AttendanceViewError = () => {
  return (
    <ErrorState
      title="Error Loading Attendance"
      description="Please try again later"
    />
  );
};
