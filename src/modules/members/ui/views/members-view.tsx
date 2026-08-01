"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingSate } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { columns } from "../components/columns";
import { MemberCard } from "../components/member-card";
import { EmptyState } from "@/components/empty-state";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { ViewToggle } from "@/components/view-toggle";
import { useViewMode } from "@/hooks/use-view-mode";
import { useMembersFilters } from "../../hooks/use-members-filters";

export const MembersView = () => {
  const [filters, setFilters] = useMembersFilters();
  const [viewMode, setViewMode] = useViewMode();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.members.getMany.queryOptions({ ...filters }),
  );

  return (
    <div className="flex flex-col flex-1 gap-y-4 pb-4 px-4 md:px-8 ">
      <div className="flex justify-end">
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "table" ? (
        <DataTable data={data.items} columns={columns} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.items.map((member) => (
            <MemberCard key={member.id} member={member} />
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
          title="Create your member"
          description="Add your first member to get started to Gintong Araw System"
        />
      )}
    </div>
  );
};

export const MembersViewLoading = () => {
  return (
    <LoadingSate
      title="Loading Members"
      description="This may take a few seconds..."
    />
  );
};

export const MembersViewError = () => {
  return (
    <ErrorState
      title="Error Loading Members"
      description="Please try again later"
    />
  );
};
