"use client";

import { format } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/trpc/client";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { LoadingSate } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

interface MemberHistoryDialogProps {
  memberId: string | null;
  onOpenChange: (open: boolean) => void;
}

const MemberHistoryList = ({ memberId }: { memberId: string }) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.attendance.getMemberHistory.queryOptions({ memberId }),
  );

  if (data.records.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No attendance recorded yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-y-2 max-h-[50vh] overflow-y-auto">
      {data.records.map((record) => (
        <li
          key={record.id}
          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
        >
          {format(new Date(`${record.attendance_date}T00:00:00`), "PPP")}
        </li>
      ))}
    </ul>
  );
};

export const MemberHistoryDialog = ({
  memberId,
  onOpenChange,
}: MemberHistoryDialogProps) => {
  return (
    <ResponsiveDialog
      title="Attendance History"
      description="All recorded attendance dates for this member."
      open={!!memberId}
      onOpenChange={onOpenChange}
    >
      {memberId && (
        <Suspense fallback={<LoadingSate title="Loading history" description="This may take a few seconds..." />}>
          <ErrorBoundary
            fallback={
              <ErrorState title="Error Loading History" description="Please try again later" />
            }
          >
            <MemberHistoryList memberId={memberId} />
          </ErrorBoundary>
        </Suspense>
      )}
    </ResponsiveDialog>
  );
};
