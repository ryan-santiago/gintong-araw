"use client";

import { useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MemberForm } from "./member-form";
import { MemberGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MemberRowActionsProps {
  member: MemberGetOne;
}

export const MemberRowActions = ({ member }: MemberRowActionsProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const deleteMember = useMutation(
    trpc.members.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.members.getMany.queryOptions({}),
        );
        toast.success("Member deleted successfully");
        setIsDeleteOpen(false);
        setConfirmationText("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const isDeleteDisabled = confirmationText.trim() !== member.tracking_number;

  const handleDelete = () => {
    if (isDeleteDisabled) {
      return;
    }

    deleteMember.mutate({ id: member.id });
  };

  return (
    <>
      <div
        className="flex items-center justify-end gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          //   variant=""
          size="icon"
          type="button"
          onClick={() => setIsEditOpen(true)}
        >
          <PencilIcon className="size-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          type="button"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>

      <ResponsiveDialog
        title="Edit Member"
        description="Update the member details below."
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      >
        <MemberForm
          initialValues={member}
          onSuccess={() => setIsEditOpen(false)}
          onCancel={() => setIsEditOpen(false)}
        />
      </ResponsiveDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. To continue, type the tracking
              number below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If you want to delete this, please type this in the box:{" "}
              <span className="font-semibold text-foreground">
                {member.tracking_number}
              </span>
            </p>
            <Input
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              placeholder={member.tracking_number}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleteDisabled || deleteMember.isPending}
              onClick={handleDelete}
            >
              {deleteMember.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
