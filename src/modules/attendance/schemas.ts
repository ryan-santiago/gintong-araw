import { z } from "zod";

export const attendanceScanPayloadSchema = z.object({
  tracking_number: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export const recordScanInputSchema = z.object({
  payload: z.string().trim().min(1, { message: "QR payload is required" }),
});
