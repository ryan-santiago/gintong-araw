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

import { LatestMember } from "../../types";

interface LatestMembersListProps {
  members: LatestMember[];
}

const formatFullName = (member: LatestMember) => {
  const middleInitial = member.middle_name
    ? `${member.middle_name.charAt(0).toUpperCase()}.`
    : "";

  return `${member.last_name}, ${member.first_name}${
    middleInitial ? ` ${middleInitial}` : ""
  }`;
};

export const LatestMembersList = ({ members }: LatestMembersListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Added Members</CardTitle>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No members yet.
          </p>
        ) : (
          <ItemGroup>
            {members.map((member, index) => {
              const fullName = formatFullName(member);

              return (
                <div key={member.id}>
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
                        {member.position || "No position"}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="outline">{member.tracking_number}</Badge>
                    </ItemActions>
                  </Item>
                  {index < members.length - 1 && <ItemSeparator />}
                </div>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
};
