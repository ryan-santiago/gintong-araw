import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { LatestAttendanceRow } from "../../types";

interface LatestAttendanceListProps {
  records: LatestAttendanceRow[];
}

const formatFullName = (record: LatestAttendanceRow) => {
  const middleInitial = record.middle_name
    ? `${record.middle_name.charAt(0).toUpperCase()}.`
    : "";

  return `${record.last_name}, ${record.first_name}${
    middleInitial ? ` ${middleInitial}` : ""
  }`;
};

export const LatestAttendanceList = ({ records }: LatestAttendanceListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No attendance recorded yet.
          </p>
        ) : (
          <ItemGroup>
            {records.map((record, index) => {
              const fullName = formatFullName(record);

              return (
                <div key={record.id}>
                  <Item size="sm">
                    <ItemMedia>
                      <GeneratedAvatar
                        seed={fullName}
                        variant="initials"
                        className="size-10"
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="capitalize">{fullName}</ItemTitle>
                      <ItemDescription>
                        {format(
                          new Date(`${record.attendance_date}T00:00:00`),
                          "PPP",
                        )}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="secondary">Present</Badge>
                    </ItemActions>
                  </Item>
                  {index < records.length - 1 && <ItemSeparator />}
                </div>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
};
