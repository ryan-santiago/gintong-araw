import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { MemberGetOne } from "../../types";
import { MemberRowActions } from "./member-row-actions";

interface MemberCardProps {
  member: MemberGetOne;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const { first_name, middle_name, last_name } = member;

  const middleInitial = middle_name
    ? `${middle_name.charAt(0).toUpperCase()}.`
    : "";

  const fullName = `${last_name}, ${first_name}${
    middleInitial ? ` ${middleInitial}` : ""
  }`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{fullName}</CardTitle>
        <CardDescription>{member.position || "No position"}</CardDescription>
        <CardAction>
          <Badge variant="outline">{member.tracking_number}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Contact Number</span>
          <span className="font-medium">
            {member.contact_number || "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Block and Lot</span>
          <span className="font-medium">
            Block {member.block_number || "—"} Lot {member.lot_number || "—"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <MemberRowActions member={member} />
      </CardFooter>
    </Card>
  );
};
