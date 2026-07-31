import { z } from "zod";

const optionalPhilippineMobileSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^09\d{9}$/.test(value), {
    message: "Contact number must be in Philippine mobile format 09XXXXXXXXX",
  })
  .optional();

const optionalNumberRangeSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+$/.test(value), {
    message: "Only digits are allowed",
  })
  .refine(
    (value) => value === "" || (Number(value) >= 1 && Number(value) <= 100),
    {
      message: "Value must be between 1 and 100",
    },
  )
  .optional();

export const membersInsertSchema = z.object({
  tracking_number: z
    .string()
    .trim()
    .min(1, { message: "Tracking number is required" }),
  first_name: z.string().trim().min(1, { message: "First name is required" }),
  middle_name: z.string().trim().optional(),
  last_name: z.string().trim().min(1, { message: "Last name is required" }),
  position: z.string().optional(),
  contact_number: optionalPhilippineMobileSchema,
  block_number: optionalNumberRangeSchema,
  lot_number: optionalNumberRangeSchema,
});

export const membersUpdateSchema = membersInsertSchema.extend({
  id: z.string().min(1, { message: "Member id is required" }),
});
