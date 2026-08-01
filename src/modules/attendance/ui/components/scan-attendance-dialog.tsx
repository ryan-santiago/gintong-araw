"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { QrCodeScanner } from "./qr-scanner";

interface ScanAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAME_PAYLOAD_COOLDOWN_MS = 4000;

export const ScanAttendanceDialog = ({
  open,
  onOpenChange,
}: ScanAttendanceDialogProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [manualPayload, setManualPayload] = useState("");
  const recentScansRef = useRef<Map<string, number>>(new Map());

  const recordScan = useMutation(
    trpc.attendance.recordScan.mutationOptions({
      onSuccess: async ({ member }) => {
        toast.success(`${member.first_name} ${member.last_name} marked present`);
        await queryClient.invalidateQueries(
          trpc.attendance.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(
          trpc.attendance.getMemberHistory.queryOptions({ memberId: member.id }),
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const submitPayload = (payload: string) => {
    recordScan.mutate({ payload });
  };

  const handleDecode = (payload: string) => {
    const now = Date.now();
    const lastScanned = recentScansRef.current.get(payload);

    if (lastScanned && now - lastScanned < SAME_PAYLOAD_COOLDOWN_MS) {
      return;
    }

    recentScansRef.current.set(payload, now);
    submitPayload(payload);
  };

  const handleManualSubmit = () => {
    if (!manualPayload.trim()) {
      return;
    }

    submitPayload(manualPayload.trim());
    setManualPayload("");
  };

  return (
    <ResponsiveDialog
      title="Take Attendance"
      description="Scan a member's QR code to record their attendance. Keep scanning to record multiple members."
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-y-4">
        <QrCodeScanner active={open} onDecode={handleDecode} />

        <div className="flex flex-col gap-y-2">
          <p className="text-sm text-muted-foreground">
            Or paste the scanned QR JSON manually
          </p>
          <Textarea
            value={manualPayload}
            onChange={(e) => setManualPayload(e.target.value)}
            placeholder='{"tracking_number":"...","name":"..."}'
            rows={2}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!manualPayload.trim() || recordScan.isPending}
            onClick={handleManualSubmit}
          >
            Record
          </Button>
        </div>

        <Button type="button" onClick={() => onOpenChange(false)}>
          Done
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
