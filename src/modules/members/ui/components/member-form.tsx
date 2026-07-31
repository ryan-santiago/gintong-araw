import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { membersInsertSchema } from "../../schemas";
import { MemberGetOne } from "../../types";

interface MemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: MemberGetOne;
}

export const MemberForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MemberFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMember = useMutation(
    trpc.members.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.members.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.members.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        //TODO: check if error code is 'FORBIDDEN', redirect to Upgrade
      },
    }),
  );

  const form = useForm<z.infer<typeof membersInsertSchema>>({
    resolver: zodResolver(membersInsertSchema),
    defaultValues: {
      tracking_number: initialValues?.tracking_number ?? "",
      first_name: initialValues?.first_name ?? "",
      middle_name: initialValues?.middle_name ?? "",
      last_name: initialValues?.last_name ?? "",
      position: initialValues?.position ?? "Member",
      contact_number: initialValues?.contact_number ?? "",
      block_number: initialValues?.block_number ?? "",
      lot_number: initialValues?.lot_number ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMember.isPending;

  const onSubmit = (values: z.infer<typeof membersInsertSchema>) => {
    if (isEdit) {
      console.log("TODO: updateMember");
    } else {
      createMember.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="tracking_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tracking Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g.. 2026-01-01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="first_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your First Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="middle_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Middle Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="last_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Last Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="position"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="President">President</SelectItem>

                  <SelectItem value="Vice President">Vice President</SelectItem>

                  <SelectItem value="Secretary">Secretary</SelectItem>

                  <SelectItem value="Treasurer">Treasurer</SelectItem>

                  <SelectItem value="PIO">PIO</SelectItem>

                  <SelectItem value="Board Member">Board Member</SelectItem>

                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="contact_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Contact Number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="block_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Block Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Block Number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lot_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lot Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your Lot Number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button disabled={isPending} type="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
